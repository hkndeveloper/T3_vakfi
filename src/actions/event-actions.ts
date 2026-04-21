"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";

export async function createEventAction(formData: FormData) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];

    const title = String(formData.get("title") ?? "").trim();
    const type = String(formData.get("type") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const eventDateRaw = String(formData.get("eventDate") ?? "").trim();
    const startTime = String(formData.get("startTime") ?? "").trim();
    const endTime = String(formData.get("endTime") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();

    if (!title || !type || !eventDateRaw) {
      return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    await prisma.event.create({
      data: {
        communityId,
        title,
        type: type as any,
        description: description || null,
        eventDate: new Date(eventDateRaw),
        startTime: startTime || null,
        endTime: endTime || null,
        location: location || null,
        createdBy: session.user.id,
        status: "DRAFT",
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "event.create",
        modelType: "Event",
      },
    });

    revalidatePath("/baskan/etkinlikler");
    return { success: true, message: "Etkinlik taslağı başarıyla oluşturuldu." };
  } catch (error) {
    console.error("Event creation error:", error);
    return { success: false, error: "Etkinlik oluşturulurken bir hata oluştu." };
  }
}

export async function submitEventAction(formData: FormData) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];
    const eventId = String(formData.get("eventId") ?? "").trim();
    
    if (!eventId) return { success: false, error: "Etkinlik ID bulunamadı." };

    await prisma.event.updateMany({
      where: {
        id: eventId,
        communityId,
        createdBy: session.user.id,
      },
      data: {
        status: "PENDING_APPROVAL",
        reviewNote: null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "event.submit.for.approval",
        modelType: "Event",
        modelId: eventId,
      },
    });

    revalidatePath("/baskan/etkinlikler");
    return { success: true, message: "Etkinlik onaya gönderildi." };
  } catch (error) {
    console.error("Event submission error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function assignMemberToEventAction(eventId: string, userId: string) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];

    // Verify event belongs to community
    const event = await prisma.event.findFirst({ where: { id: eventId, communityId } });
    if (!event) return { success: false, error: "Etkinlik bulunamadı." };

    // Create participant entry
    await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      update: {
        inviteStatus: "INVITED",
        attendanceStatus: "PENDING"
      },
      create: {
        eventId,
        userId,
        inviteStatus: "INVITED",
        attendanceStatus: "PENDING"
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "event.member.assign",
        modelType: "EventParticipant",
        modelId: `${eventId}:${userId}`,
      },
    });

    revalidatePath("/baskan/uyeler");
    return { success: true, message: "Üye etkinliğe başarıyla eklendi." };
  } catch (error) {
    console.error("Event assignment error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

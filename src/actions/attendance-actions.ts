"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";

export async function toggleAttendanceAction(eventId: string, userId: string, status: any) {
  try {
    const session = await requireCommunityManager();
    
    // Yetki kontrolü (Bu etkinliği bu topluluk yöneticisi mi yönetiyor?)
    const event = await prisma.event.findFirst({
        where: { id: eventId, communityId: { in: session.user.communityIds } }
    });

    if (!event) {
        return { success: false, error: "Etkinlik bulunamadı veya yetkiniz yok." };
    }

    await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      update: {
        attendanceStatus: status,
        markedBy: session.user.id,
        markedAt: new Date()
      },
      create: {
        eventId,
        userId,
        attendanceStatus: status,
        markedBy: session.user.id,
        markedAt: new Date()
      }
    });

    revalidatePath(`/baskan/etkinlikler/${eventId}`);
    return { success: true, message: "Yoklama güncellendi." };
  } catch (error) {
    return { success: false, error: "İşlem sırasında hata oluştu." };
  }
}

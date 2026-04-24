"use server";

import { revalidatePath } from "next/cache";
import { AttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";

export async function toggleAttendanceAction(eventId: string, userId: string, status: AttendanceStatus) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];
    
    const [event, membership] = await Promise.all([
      prisma.event.findFirst({
        where: {
          id: eventId,
          OR: [
            { communityId: { in: session.user.communityIds } },
            { scope: "GLOBAL", status: { in: ["APPROVED", "COMPLETED"] } },
          ],
        },
      }),
      prisma.communityMember.findFirst({
        where: { communityId, userId, status: "ACTIVE" },
      }),
    ]);

    if (!event) {
        return { success: false, error: "Etkinlik bulunamadı veya yetkiniz yok." };
    }

    if (!membership) {
      return { success: false, error: "Yalnızca kendi topluluğunuzdaki aktif üyeler için yoklama alabilirsiniz." };
    }

    await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      update: {
        communityId,
        attendanceStatus: status,
        markedBy: session.user.id,
        markedAt: new Date()
      },
      create: {
        eventId,
        userId,
        communityId,
        attendanceStatus: status,
        markedBy: session.user.id,
        markedAt: new Date()
      }
    });

    revalidatePath(`/baskan/etkinlikler/${eventId}`);
    return { success: true, message: "Yoklama güncellendi." };
  } catch (error) {
    console.error("Attendance toggle error:", error);
    return { success: false, error: "İşlem sırasında hata oluştu." };
  }
}

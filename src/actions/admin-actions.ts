"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { createNotification } from "@/lib/notifications";

export async function reviewEventAction(formData: FormData) {
  const session = await requirePermission("event.approve");

  const eventId = String(formData.get("eventId") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const reviewNote = String(formData.get("reviewNote") ?? "").trim();

  if (!eventId || !["APPROVED", "REJECTED", "DRAFT"].includes(decision)) {
    return { success: false, error: "Geçersiz işlem." };
  }

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      status: decision as any,
      approvedBy: decision === "APPROVED" ? session.user.id : null,
      approvedAt: decision === "APPROVED" ? new Date() : null,
      reviewNote: reviewNote || null,
    },
  });

  // Create notification for the creator
  await createNotification({
    userId: event.createdBy,
    title: decision === "APPROVED" ? "Etkinlik Onaylandı" : "Etkinlik Revizyon/Red",
    content: `${event.title} isimli etkinliğiniz ${decision === "APPROVED" ? "onaylandı" : "için geri bildirim verildi"}.`,
    type: "EVENT",
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: `event.review.${decision.toLowerCase()}`,
      modelType: "Event",
      modelId: eventId,
    },
  });

  revalidatePath("/admin/etkinlik-onaylari");
  revalidatePath("/baskan/etkinlikler");
  return { success: true };
}

export async function reviewReportAction(formData: FormData) {
  const session = await requirePermission("report.approve");

  const reportId = String(formData.get("reportId") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const adminNote = String(formData.get("adminNote") ?? "").trim();

  if (!reportId || !["APPROVED", "REJECTED", "REVISION_REQUESTED"].includes(decision)) {
    return { success: false, error: "Geçersiz işlem." };
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: decision as any,
      approvedBy: decision === "APPROVED" ? session.user.id : null,
      approvedAt: decision === "APPROVED" ? new Date() : null,
      adminNote: adminNote || null,
    },
  });

  // Create notification for the creator
  await createNotification({
    userId: report.createdBy,
    title: decision === "APPROVED" ? "Rapor Onaylandı" : "Rapor Revizyon/Red",
    content: `${report.title} isimli raporunuz ${decision === "APPROVED" ? "onaylandı" : "için geri bildirim verildi"}.`,
    type: "REPORT",
  });

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: `report.review.${decision.toLowerCase()}`,
      modelType: "Report",
      modelId: reportId,
    },
  });

  revalidatePath("/admin/rapor-onaylari");
  revalidatePath("/baskan/raporlar");
  return { success: true };
}

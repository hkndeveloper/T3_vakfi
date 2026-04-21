"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin, requireCommunityManager } from "@/lib/permissions";

export async function createCommunityAction(formData: FormData) {
  try {
    const session = await requireSuperAdmin();

    const universityId = String(formData.get("universityId") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const shortName = String(formData.get("shortName") ?? "").trim().toUpperCase();
    const advisorName = String(formData.get("advisorName") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();
    const instagram = String(formData.get("instagram") ?? "").trim();
    const twitter = String(formData.get("twitter") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    if (!universityId || !name || !shortName) {
      return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    const community = await prisma.community.create({
      data: {
        universityId,
        name,
        shortName,
        advisorName: advisorName || null,
        description: description || null,
        contactEmail: contactEmail || null,
        instagram: instagram || null,
        twitter: twitter || null,
        website: website || null,
        status: "ACTIVE",
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "community.create",
        modelType: "Community",
        modelId: community.id,
      },
    });

    revalidatePath("/admin/topluluklar");
    return { success: true, message: "Topluluk başarıyla oluşturuldu." };
  } catch (error) {
    console.error("Community creation error:", error);
    return { success: false, error: "Hata oluştu, lütfen alanları kontrol edin." };
  }
}

export async function toggleCommunityStatusAction(id: string, currentStatus: string) {
  try {
    const session = await requireSuperAdmin();
    const newStatus = currentStatus === "ACTIVE" ? "PASSIVE" : "ACTIVE";

    await prisma.community.update({
      where: { id },
      data: { status: newStatus as any },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "community.status.toggle",
        modelType: "Community",
        modelId: id,
      },
    });

    revalidatePath("/admin/topluluklar");
    return { success: true, message: "Topluluk durumu güncellendi." };
  } catch (error) {
    return { success: false, error: "İşlem başarısız oldu." };
  }
}

export async function updateCommunityAction(id: string, formData: FormData) {
  try {
    const session = await requireSuperAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const shortName = String(formData.get("shortName") ?? "").trim().toUpperCase();
    const advisorName = String(formData.get("advisorName") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const status = String(formData.get("status") ?? "") as any;
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();
    const instagram = String(formData.get("instagram") ?? "").trim();
    const twitter = String(formData.get("twitter") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    if (!name || !shortName || !status) {
      return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    await prisma.community.update({
      where: { id },
      data: {
        name,
        shortName,
        advisorName: advisorName || null,
        description: description || null,
        contactEmail: contactEmail || null,
        instagram: instagram || null,
        twitter: twitter || null,
        website: website || null,
        status,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "community.update",
        modelType: "Community",
        modelId: id,
      },
    });

    revalidatePath("/admin/topluluklar");
    revalidatePath(`/admin/topluluklar/${id}`);
    return { success: true, message: "Topluluk bilgileri güncellendi." };
  } catch (error) {
    return { success: false, error: "Güncelleme hatası oluştu." };
  }
}

export async function assignCommunityPresidentAction(communityId: string, userId: string) {
  try {
    const session = await requireSuperAdmin();

    const presidentRole = await prisma.role.findUnique({
      where: { code: "president" },
    });

    if (!presidentRole) {
      return { success: false, error: "Başkan rolü sistemde bulunamadı." };
    }

    // Remove existing president for this community
    await prisma.userRole.deleteMany({
      where: {
        communityId,
        roleId: presidentRole.id,
      },
    });

    // Demote existing president in CommunityMember table
    await prisma.communityMember.updateMany({
      where: {
        communityId,
        membershipType: "PRESIDENT",
      },
      data: {
        membershipType: "MANAGEMENT", // Demote to management by default
      },
    });

    // Assign new president
    await prisma.userRole.create({
      data: {
        userId,
        roleId: presidentRole.id,
        communityId,
      },
    });

    // Also add to community members if not already there
    const existingMember = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
    });

    if (existingMember) {
      await prisma.communityMember.update({
        where: { id: existingMember.id },
        data: { membershipType: "PRESIDENT" },
      });
    } else {
      await prisma.communityMember.create({
        data: {
          communityId,
          userId,
          membershipType: "PRESIDENT",
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "community.president.assign",
        modelType: "Community",
        modelId: communityId,
      },
    });

    revalidatePath(`/admin/topluluklar/${communityId}`);
    return { success: true, message: "Topluluk başkanı başarıyla atandı." };
  } catch (error) {
    console.error("Assign president error:", error);
    return { success: false, error: "İşlem sırasında bir hata oluştu." };
  }
}

export async function updateCommunityProfileAction(formData: FormData) {
  try {
    const session = await requireCommunityManager();
    const communityId = session.user.communityIds[0];

    if (!communityId) {
      return { success: false, error: "Yetkisiz işlem." };
    }

    const advisorName = String(formData.get("advisorName") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();
    const instagram = String(formData.get("instagram") ?? "").trim();
    const twitter = String(formData.get("twitter") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    await prisma.community.update({
      where: { id: communityId },
      data: {
        advisorName: advisorName || null,
        description: description || null,
        contactEmail: contactEmail || null,
        instagram: instagram || null,
        twitter: twitter || null,
        website: website || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "community.profile.update",
        modelType: "Community",
        modelId: communityId,
      },
    });

    revalidatePath("/baskan/toplulugum");
    revalidatePath("/baskan");
    return { success: true, message: "Topluluk profili başarıyla güncellendi." };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Güncelleme sırasında bir hata oluştu." };
  }
}


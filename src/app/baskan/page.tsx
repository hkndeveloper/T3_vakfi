import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { PresidentDashboardClient } from "@/components/dashboard/PresidentDashboardClient";

export default async function PresidentPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    community,
    memberCount,
    upcomingEvents,
    pendingReports,
    studentStats,
    recentMedia,
    lastMonthMembers,
    thisMonthMembers,
    allCommunitiesForRank,
    approvedEvents,
    totalEvents,
    approvedReports,
    totalReports,
  ] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      include: { university: true },
    }),
    prisma.communityMember.count({
      where: { communityId, status: "ACTIVE" },
    }),
    prisma.event.count({
      where: {
        communityId,
        status: "APPROVED",
        eventDate: { gte: now },
      },
    }),
    prisma.report.count({
      where: {
        communityId,
        status: { in: ["DRAFT", "REVISION_REQUESTED", "REJECTED"] },
      },
    }),
    prisma.user.groupBy({
      by: ["department"],
      where: {
        memberships: { some: { communityId } },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    // Son yüklenen görseller
    prisma.mediaFile.findMany({
      where: { communityId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    // Geçen ay eklenen üye sayısı
    prisma.communityMember.count({
      where: {
        communityId,
        joinedAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
    }),
    // Bu ay eklenen üye sayısı
    prisma.communityMember.count({
      where: {
        communityId,
        joinedAt: { gte: startOfThisMonth },
      },
    }),
    // Sıralama için tüm toplulukların onaylanan etkinlik + rapor sayıları
    prisma.community.findMany({
      select: {
        id: true,
        _count: {
          select: {
            createdEvents: { where: { status: { in: ["APPROVED", "COMPLETED"] } } },
            reports: { where: { status: "APPROVED" } },
            members: { where: { status: "ACTIVE" } },
          },
        },
      },
    }),
    // Bu topluluğun onaylanan etkinlikleri
    prisma.event.count({
      where: { communityId, status: { in: ["APPROVED", "COMPLETED"] } },
    }),
    // Bu topluluğun toplam etkinlikleri
    prisma.event.count({ where: { communityId } }),
    // Bu topluluğun onaylanan raporları
    prisma.report.count({ where: { communityId, status: "APPROVED" } }),
    // Bu topluluğun toplam raporları
    prisma.report.count({ where: { communityId } }),
  ]);

  // Üye büyüme trendi hesapla
  let growthRate = 0;
  let growthLabel = "YENİ ÜYE YOK";
  if (thisMonthMembers > 0) {
    if (lastMonthMembers === 0) {
      growthRate = 100;
      growthLabel = `+${thisMonthMembers} YENİ`;
    } else {
      growthRate = Math.round(((thisMonthMembers - lastMonthMembers) / lastMonthMembers) * 100);
      growthLabel = growthRate >= 0 ? `+${growthRate}%` : `${growthRate}%`;
    }
  }

  // Kurumsal Karne skoru hesapla (%50 etkinlik, %50 rapor başarısı)
  const eventScore = totalEvents > 0 ? (approvedEvents / totalEvents) * 50 : 0;
  const reportScore = totalReports > 0 ? (approvedReports / totalReports) * 50 : 0;
  const performanceScore = Math.round(eventScore + reportScore);

  // Sıralama hesapla
  const communityScores = allCommunitiesForRank.map((c) => {
    const eScore = c._count.createdEvents * 50 > 0 ? Math.min(50, c._count.createdEvents * 5) : 0;
    const rScore = c._count.reports * 50 > 0 ? Math.min(50, c._count.reports * 10) : 0;
    return { id: c.id, score: eScore + rScore };
  });

  communityScores.sort((a, b) => b.score - a.score);
  const rank = communityScores.findIndex((c) => c.id === communityId) + 1;
  const totalCommunities = communityScores.length;

  const chartData = studentStats.map((stat: any) => ({
    name: stat.department || "Diğer",
    value: stat._count.id,
  }));

  if (chartData.length === 0) {
    chartData.push(
      { name: "Mühendislik", value: 0 },
      { name: "Mimarlık", value: 0 },
      { name: "İİBF", value: 0 }
    );
  }

  return (
    <PresidentDashboardClient
      session={session}
      community={community}
      memberCount={memberCount}
      upcomingEvents={upcomingEvents}
      pendingReports={pendingReports}
      chartData={chartData}
      growthLabel={growthLabel}
      performanceScore={performanceScore}
      rank={rank}
      totalCommunities={totalCommunities}
      recentMedia={recentMedia}
    />
  );
}

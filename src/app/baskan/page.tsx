import { prisma } from "@/lib/prisma";
import { requireCommunityManager } from "@/lib/permissions";
import { PresidentDashboardClient } from "@/components/dashboard/PresidentDashboardClient";

export default async function PresidentPage() {
  const session = await requireCommunityManager();
  const communityId = session.user.communityIds[0];

  const [community, memberCount, upcomingEvents, pendingReports, studentStats] = await Promise.all([
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
        eventDate: { gte: new Date() },
      },
    }),
    prisma.report.count({
      where: {
        communityId,
        status: { in: ["DRAFT", "REVISION_REQUESTED", "REJECTED"] },
      },
    }),
    prisma.user.groupBy({
      by: ['department'],
      where: { 
        memberships: { some: { communityId } } 
      },
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })
  ]);

  const chartData = studentStats.map((stat: any) => ({
    name: stat.department || "Diğer",
    value: stat._count.id
  }));

  if (chartData.length === 0) {
    chartData.push({ name: "Mühendislik", value: 12 }, { name: "Mimarlık", value: 8 }, { name: "İİBF", value: 5 });
  }

  return (
    <PresidentDashboardClient 
      session={session}
      community={community}
      memberCount={memberCount}
      upcomingEvents={upcomingEvents}
      pendingReports={pendingReports}
      chartData={chartData}
    />
  );
}

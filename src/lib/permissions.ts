import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function hasPermission(permissionCode: string) {
  const session = await getCurrentSession();
  return Boolean(session?.user?.permissions?.includes(permissionCode));
}

export async function isSuperAdmin() {
  const session = await getCurrentSession();
  return Boolean(session?.user?.roles?.includes("super_admin"));
}

export async function requireSuperAdmin() {
  const session = await getCurrentSession();

  if (!session?.user.roles.includes("super_admin")) {
    redirect("/");
  }

  return session;
}

export async function requirePermission(permissionCode: string) {
  const session = await getCurrentSession();

  if (!session?.user.permissions.includes(permissionCode)) {
    redirect("/");
  }

  return session;
}

export async function requireCommunityManager() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/giris");
  }

  const isCommunityManager = session.user.roles.some((role) =>
    ["president", "management_team"].includes(role),
  );

  if (!isCommunityManager || session.user.communityIds.length === 0) {
    redirect("/");
  }

  return session;
}

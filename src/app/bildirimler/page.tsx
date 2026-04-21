import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/permissions";

async function markAsReadAction(formData: FormData) {
  "use server";
  const session = await getCurrentSession();
  if (!session) redirect("/giris");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });

  revalidatePath("/bildirimler");
}

export default async function NotificationsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/giris");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Bildirimler</h1>
          <p className="mt-2 text-sm text-slate-600">Sistem ici etkinlik, rapor ve duyuru bildirimleri.</p>
        </div>
        {notifications.map((n) => (
          <article key={n.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{n.title}</p>
                <p className="mt-1 text-sm text-slate-700">{n.content}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {n.type} | {new Date(n.createdAt).toLocaleString("tr-TR")}
                </p>
              </div>
              {!n.isRead ? (
                <form action={markAsReadAction}>
                  <input type="hidden" name="id" value={n.id} />
                  <button className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white">Okundu</button>
                </form>
              ) : (
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">Okundu</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

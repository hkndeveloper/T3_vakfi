import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { User, Mail, Phone, GraduationCap, Building2, Calendar, ShieldCheck, Edit } from "lucide-react";
import { revalidatePath } from "next/cache";

async function updateProfileAction(formData: FormData) {
  "use server";
  const session = await getServerSession();
  if (!session?.user?.id) return;

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const rawGrade = String(formData.get("grade") ?? "").trim();
  const grade = rawGrade ? parseInt(rawGrade, 10) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, department, grade }
  });

  revalidatePath("/profilim");
}

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return <div>Oturum bulunamadı</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          community: {
            include: { university: true }
          }
        }
      },
      userRoles: {
        include: { role: true }
      }
    }
  });

  if (!user) {
    return <div>Kullanıcı bulunamadı</div>;
  }

  const membership = user.memberships[0];
  const roles = user.userRoles.map(ur => ur.role.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="t3-panel-elevated p-6">
        <h1 className="text-2xl font-semibold text-t3-navy font-montserrat">Profilim</h1>
        <p className="text-sm text-slate-500 mt-1">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
      </div>

      <form action={updateProfileAction} className="space-y-6">
        {/* Profile Card */}
        <div className="t3-panel p-6">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-t3 bg-t3-navy flex items-center justify-center text-white">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-t3-navy font-montserrat">{user.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                {membership && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="t3-badge bg-t3-cyan/10 text-t3-cyan">
                      {membership.community.shortName}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{membership.community.university.name}</span>
                  </div>
                )}
                {roles.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {roles.map(role => (
                      <span key={role} className="t3-badge bg-t3-navy/5 text-t3-navy text-[9px]">
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">Ad Soyad</label>
              <input
                name="name"
                defaultValue={user.name}
                className="t3-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">E-posta</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="t3-input w-full bg-slate-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">Telefon</label>
              <input
                name="phone"
                defaultValue={user.phone || ""}
                className="t3-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">Bölüm</label>
              <input
                name="department"
                defaultValue={user.department || ""}
                className="t3-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">Sınıf</label>
              <input
                name="grade"
                defaultValue={user.grade || ""}
                className="t3-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-t3-navy uppercase tracking-wider">Öğrenci Numarası</label>
              <input
                value={user.studentNumber || ""}
                disabled
                className="t3-input w-full bg-slate-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="t3-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Üyelik Tarihi</p>
                <p className="text-sm font-medium text-t3-navy">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "Belirtilmemiş"}
                </p>
              </div>
            </div>
          </div>

          <div className="t3-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Durum</p>
                <p className="text-sm font-medium text-t3-navy">
                  {user.isActive ? "Aktif" : "Pasif"}
                </p>
              </div>
            </div>
          </div>

          <div className="t3-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Rol Sayısı</p>
                <p className="text-sm font-medium text-t3-navy">{roles.length}</p>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="t3-button t3-button-primary w-full">
          <Edit className="h-4 w-4 mr-2" />
          Bilgileri Güncelle
        </button>
      </form>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Building2, ShieldCheck } from "lucide-react";

export default async function MemberProfilePage() {
  const session = await requirePermission("member.view");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          community: {
            include: { university: true }
          }
        }
      }
    }
  });

  if (!user) {
    return <div>Kullanıcı bulunamadı</div>;
  }

  const membership = user.memberships[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="t3-panel-elevated p-6">
        <h1 className="text-2xl font-semibold text-t3-navy font-montserrat">Profilim</h1>
        <p className="text-sm text-slate-500 mt-1">Kişisel bilgilerinizi görüntüleyin</p>
      </div>

      {/* Profile Card */}
      <div className="t3-panel p-6">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 rounded-t3 bg-t3-navy flex items-center justify-center text-white">
            <User className="h-10 w-10" />
          </div>
          <div className="flex-1">
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
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="t3-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">E-posta</p>
              <p className="text-sm font-medium text-t3-navy">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="t3-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Telefon</p>
              <p className="text-sm font-medium text-t3-navy">{user.phone || "Belirtilmemiş"}</p>
            </div>
          </div>
        </div>

        <div className="t3-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bölüm</p>
              <p className="text-sm font-medium text-t3-navy">{user.department || "Belirtilmemiş"}</p>
            </div>
          </div>
        </div>

        <div className="t3-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-t3 bg-t3-navy/5 flex items-center justify-center text-t3-navy">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sınıf</p>
              <p className="text-sm font-medium text-t3-navy">{user.grade || "Belirtilmemiş"}</p>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}

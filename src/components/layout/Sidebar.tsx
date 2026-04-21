"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Zap,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  title: string;
  subtitle: string;
}

export function Sidebar({ items, title, subtitle }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <div className="h-full bg-corporate-navy p-8 flex flex-col text-white border-r border-white/5 relative overflow-hidden shadow-2xl">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-corporate-blue/20 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
      
      {/* Logo Section */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-4 px-2">
          <div className="h-10 w-10 rounded bg-white flex items-center justify-center shadow-lg shadow-black/20">
            <span className="text-corporate-navy font-black text-lg tracking-tighter italic">T3</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-md font-black tracking-tighter leading-none uppercase italic text-white">{title}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">{subtitle}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 relative z-10 overflow-y-auto pr-2 -mr-2 t3-scrollbar">
        {items.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = (require("lucide-react") as any)[item.icon] || Zap;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 px-5 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all relative rounded-lg",
                  isActive 
                    ? "text-white bg-white/10" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-corporate-orange" : "text-slate-500 group-hover:text-white"
                )} />
                <span className="truncate">{item.label}</span>
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-corporate-orange text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-corporate-orange/20 animate-pulse">
                    {item.badge}
                  </span>
                )}
                
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1 h-6 bg-corporate-orange rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-white/10 relative z-10">
        <button 
          onClick={() => signOut({ callbackUrl: "/giris" })}
          className="flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all w-full rounded-lg group active:scale-95"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-corporate-navy z-40 px-6 flex items-center justify-between border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
            <span className="text-corporate-navy font-black text-sm italic">T3</span>
          </div>
          <span className="text-white font-black text-xs uppercase tracking-tighter italic">{title}</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-50 font-source-sans">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-80 z-[70] font-source-sans"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


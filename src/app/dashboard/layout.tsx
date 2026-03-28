"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/dashboard/jamaah", label: "Jamaah", icon: "users" },
  { href: "/dashboard/paket", label: "Paket Umroh", icon: "package" },
  { href: "/dashboard/checklist", label: "Checklist", icon: "check" },
  { href: "/dashboard/siskopatuh", label: "Siskopatuh", icon: "file" },
  { href: "/dashboard/keuangan", label: "Keuangan", icon: "dollar", adminOnly: true },
  { href: "/dashboard/kalender", label: "Kalender", icon: "calendar" },
  { href: "/dashboard/karyawan", label: "Karyawan", icon: "badge" },
  { href: "/dashboard/scanner", label: "Scan Dokumen", icon: "camera" },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#C9A84C" : "#666";
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? "rgba(201,168,76,0.2)" : "none"}/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "users": return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "package": return <svg {...props}><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>;
    case "check": return <svg {...props}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
    case "file": return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>;
    case "dollar": return <svg {...props}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
    case "calendar": return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="16" r="1" fill={color}/></svg>;
    case "badge": return <svg {...props}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "camera": return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    default: return null;
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [user, mounted, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Memuat...</p>
        </div>
      </div>
    );
  }

  const filteredMenu = menuItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-200 flex flex-col
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `} style={{ background: "#111", borderRight: "1px solid #1e1e1e" }}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid #1e1e1e" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
            A
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#C9A84C", fontFamily: "var(--font-cinzel)" }}>ARBANI</p>
            <p className="text-[10px] text-gray-500">Management System</p>
          </div>
          <button className="ml-auto lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {filteredMenu.map(item => (
            <button key={item.href}
              onClick={() => { router.push(item.href); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
              style={{
                background: isActive(item.href) ? "rgba(201,168,76,0.08)" : "transparent",
                borderRight: isActive(item.href) ? "2px solid #C9A84C" : "2px solid transparent",
              }}>
              <NavIcon icon={item.icon} active={isActive(item.href)} />
              <span className="text-sm" style={{ color: isActive(item.href) ? "#C9A84C" : "#888" }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4" style={{ borderTop: "1px solid #1e1e1e" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
              {user.nama.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.nama}</p>
              <p className="text-[10px] text-gray-500">{user.role === 'admin' ? 'Admin' : 'Karyawan'}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full text-xs py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
          style={{ background: "rgba(10,10,10,0.95)", borderBottom: "1px solid #1e1e1e", backdropFilter: "blur(12px)" }}>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <h1 className="text-sm font-bold text-white">
            {filteredMenu.find(m => isActive(m.href))?.label || "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full"
              style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>
              {user.role === 'admin' ? 'Admin' : 'Staff'}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

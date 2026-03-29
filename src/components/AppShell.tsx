"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const tabs = [
  {
    id: "home",
    label: "Beranda",
    href: "/",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "#C9A84C" : "none"} stroke={active ? "#C9A84C" : "#555"} strokeWidth={active ? 0 : 1.8}>
        {active ? (
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9" />
        )}
      </svg>
    ),
  },
  {
    id: "umroh",
    label: "Umroh",
    href: "/paket-umroh",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? "#C9A84C" : "#555"} strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C9 2 7 4 7 7v1H5v11h14V8h-2V7c0-3-2-5-5-5z" />
        <rect x="9" y="12" width="6" height="7" rx="0.5" strokeLinecap="round" strokeLinejoin="round" fill={active ? "rgba(201,168,76,0.3)" : "none"} />
        <line x1="12" y1="2" x2="12" y2="7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "haji",
    label: "Haji",
    href: "/paket-haji",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? "#C9A84C" : "#555"} strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C9.5 3 7 5 7 8v1H4v10h16V9h-3V8c0-3-2.5-5-5-5z" />
        <ellipse cx="12" cy="9" rx="3" ry="2" fill={active ? "rgba(201,168,76,0.3)" : "none"} />
        <line x1="7" y1="13" x2="7" y2="19" strokeLinecap="round" />
        <line x1="17" y1="13" x2="17" y2="19" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "doa",
    label: "Doa",
    href: "/doa-umroh",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={active ? "#C9A84C" : "#555"} strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "akun",
    label: "Akun",
    href: "/login",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "rgba(201,168,76,0.15)" : "none"} stroke={active ? "#C9A84C" : "#555"} strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = tabs.find((t) =>
    t.href === "/" ? pathname === "/" : pathname.startsWith(t.href)
  );

  return (
    <div className="app-shell">
      {/* Top Navigation Bar */}
      <div className="nav-bar flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Arbani Tour" width={28} height={28} className="rounded-full" />
          <span className="text-sm font-semibold tracking-wider" style={{ color: "#C9A84C", fontFamily: "var(--font-cinzel)" }}>
            ARBANI TOUR
          </span>
        </div>
        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className="text-sm font-medium transition-colors"
                style={{ color: isActive ? "#C9A84C" : "#888" }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
        {/* Mobile: minimal icons */}
        <div className="flex md:hidden items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.5 8.5C5.5 4 18.5 4 22.5 8.5M5 12C7.5 9 16.5 9 19 12M8.5 15.5C10 14 14 14 15.5 15.5M12 19h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          <svg className="w-4 h-3.5 text-white opacity-80" viewBox="0 0 24 12" fill="none">
            <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke="currentColor" strokeOpacity="0.5" />
            <rect x="2" y="2" width="15" height="8" rx="1" fill="currentColor" />
            <path d="M22 4v4a2 2 0 000-4z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Screen content */}
      <div className="screen-content page-in">
        <div className="content-container">
          {children}
        </div>
      </div>

      {/* Bottom Tab Bar - mobile only */}
      <div className="tab-bar md:hidden">
        <div className="flex items-center">
          {tabs.map((tab) => {
            const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className="flex-1 flex flex-col items-center justify-center pt-2 pb-1 gap-0.5 tap-target"
                style={{ background: "transparent", border: "none" }}
              >
                {tab.icon(isActive)}
                <span
                  className="text-[10px] font-semibold mt-0.5"
                  style={{ color: isActive ? "#C9A84C" : "#555" }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div
                    className="w-4 h-0.5 rounded-full mt-0.5"
                    style={{ background: "#C9A84C" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

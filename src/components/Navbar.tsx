"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #242424",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Arbani Tour"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p
              className="text-base font-bold leading-tight tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
            >
              ARBANI TOUR
            </p>
            <p className="text-xs text-gray-500 tracking-widest leading-tight">
              BIRO UMROH & HAJI
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/paket-umroh"
            className="text-sm text-gray-300 hover:text-[#C9A84C] transition-colors"
          >
            Paket Umroh
          </Link>
          <Link
            href="/paket-haji"
            className="text-sm text-gray-300 hover:text-[#C9A84C] transition-colors"
          >
            Paket Haji
          </Link>
          <Link
            href="/doa-umroh"
            className="text-sm text-gray-300 hover:text-[#C9A84C] transition-colors"
          >
            Doa-doa Umroh
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #A07830, #C9A84C)",
              color: "#0A0A0A",
            }}
          >
            Masuk / Daftar
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            style={{ background: "#C9A84C" }}
          />
          <span
            className={`block w-6 h-0.5 transition-all ${menuOpen ? "opacity-0" : ""}`}
            style={{ background: "#C9A84C" }}
          />
          <span
            className={`block w-6 h-0.5 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            style={{ background: "#C9A84C" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t flex flex-col"
          style={{ borderColor: "#242424", background: "#0A0A0A" }}
        >
          {[
            { href: "/paket-umroh", label: "Paket Umroh" },
            { href: "/paket-haji", label: "Paket Haji" },
            { href: "/doa-umroh", label: "Doa-doa Umroh" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-6 py-4 text-sm text-gray-300 hover:text-[#C9A84C] border-b transition-colors"
              style={{ borderColor: "#1a1a1a" }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mx-4 my-4 py-3 rounded-full text-sm font-semibold text-center transition-all"
            style={{
              background: "linear-gradient(135deg, #A07830, #C9A84C)",
              color: "#0A0A0A",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Masuk / Daftar
          </Link>
        </div>
      )}
    </nav>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full px-4 text-center">
          <div
            className="w-full rounded-3xl p-10"
            style={{ background: "#141414", border: "1px solid #242424" }}
          >
            <div className="text-5xl mb-4">✅</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
            >
              {mode === "login" ? "Berhasil Masuk!" : "Akun Terdaftar!"}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {mode === "login"
                ? "Selamat datang kembali di Arbani Tour."
                : "Terima kasih telah bergabung. Tim kami akan segera menghubungi Anda."}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm tap-target"
              style={{
                background: "linear-gradient(135deg, #A07830, #C9A84C)",
                color: "#0A0A0A",
              }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Page header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <Link href="/" className="tap-target w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#141414" }}>
          <svg className="w-5 h-5" fill="none" stroke="#C9A84C" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-base font-black tracking-wide" style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}>
            AKUN SAYA
          </h1>
          <p className="text-[10px] text-gray-500">Masuk atau buat akun baru</p>
        </div>
      </div>

      <div className="px-4 py-4">
      <div
        className="w-full rounded-3xl overflow-hidden"
        style={{ border: "1px solid #242424" }}
      >
        {/* Header */}
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{
            background: "linear-gradient(180deg, #1a1300 0%, #141414 100%)",
          }}
        >
          <Image
            src="/logo.jpg"
            alt="Arbani Tour"
            width={72}
            height={72}
            className="rounded-full mx-auto mb-4"
            style={{ boxShadow: "0 0 20px rgba(201,168,76,0.4)" }}
          />
          <h1
            className="text-xl font-black tracking-wide"
            style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
          >
            ARBANI TOUR
          </h1>
          <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">
            Portal Jamaah
          </p>
        </div>

        {/* Tab switcher */}
        <div
          className="flex border-b"
          style={{ borderColor: "#242424", background: "#141414" }}
        >
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setError(""); setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "", address: "" }); }}
              className="flex-1 py-4 text-sm font-semibold transition-all"
              style={{
                color: mode === tab ? "#C9A84C" : "#555",
                borderBottom: mode === tab ? "2px solid #C9A84C" : "2px solid transparent",
                background: "transparent",
              }}
            >
              {tab === "login" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 py-8" style={{ background: "#141414" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                  No. Handphone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                />
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                  Alamat
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Alamat lengkap Anda"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Minimal 8 karakter"
                minLength={8}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Ulangi password Anda"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #A07830, #C9A84C)",
                color: "#0A0A0A",
                boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
              }}
            >
              {mode === "login" ? "Masuk ke Akun" : "Buat Akun"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                className="text-xs text-center transition-colors hover:text-[#C9A84C]"
                style={{ color: "#555" }}
              >
                Lupa password?
              </button>
            )}
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: "#242424" }}>
            <p className="text-xs text-gray-500">
              {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="font-semibold transition-colors hover:text-[#E8C96D]"
                style={{ color: "#C9A84C" }}
              >
                {mode === "login" ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-4 text-center">
        Dengan mendaftar, Anda menyetujui syarat & ketentuan Arbani Tour.
      </p>
      </div>
    </AppShell>
  );
}

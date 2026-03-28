"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const router = useRouter();

  if (user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
              style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
              {user.nama.charAt(0)}
            </div>
            <h1 className="text-xl font-bold text-white">{user.nama}</h1>
            <p className="text-sm text-gray-400">{user.jabatan}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full"
              style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
              {user.role === 'admin' ? 'Administrator' : 'Karyawan'}
            </span>
          </div>
          <button onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl font-bold text-sm mb-3"
            style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
            Buka Dashboard
          </button>
          <button onClick={logout}
            className="w-full py-3 rounded-xl font-bold text-sm border"
            style={{ borderColor: "rgba(255,100,100,0.3)", color: "#ff6b6b" }}>
            Logout
          </button>
          <button onClick={() => router.push('/')}
            className="w-full py-3 mt-2 rounded-xl text-sm text-gray-500">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Email atau password salah");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-wide mb-1"
            style={{
              fontFamily: "var(--font-cinzel)",
              background: "linear-gradient(135deg, #A07830, #C9A84C, #E8C96D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            ARBANI TOUR
          </h1>
          <p className="text-xs text-gray-500">Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white"
              style={{ background: "#141414", border: "1px solid #242424" }}
              placeholder="email@arbani.com" required />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white"
              style={{ background: "#141414", border: "1px solid #242424" }}
              placeholder="Masukkan password" required />
          </div>
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
            {loading ? "Memuat..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl text-center" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-[10px] text-gray-500 mb-1">Demo Login:</p>
          <p className="text-[10px] text-gray-400">Admin: admin@arbani.com / admin123</p>
          <p className="text-[10px] text-gray-400">Karyawan: fauzi@arbani.com / karyawan123</p>
        </div>

        <button onClick={() => router.push('/')}
          className="w-full py-3 mt-4 rounded-xl text-sm text-gray-500">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

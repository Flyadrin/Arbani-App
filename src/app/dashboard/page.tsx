"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { jamaahStore, paketStore, taskStore, transaksiStore, formatRupiah } from "@/lib/store";
import { Jamaah, PaketUmroh, Task, Transaksi } from "@/lib/types";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [jamaah, setJamaah] = useState<Jamaah[]>([]);
  const [paket, setPaket] = useState<PaketUmroh[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);

  useEffect(() => {
    setJamaah(jamaahStore.getAll());
    setPaket(paketStore.getAll());
    setTasks(taskStore.getAll());
    setTransaksi(transaksiStore.getAll());
  }, []);

  const totalPemasukan = transaksi.filter(t => t.jenis !== 'refund').reduce((s, t) => s + t.jumlah, 0);
  const tasksBelum = tasks.filter(t => t.status === 'belum').length;
  const tasksUrgent = tasks.filter(t => t.prioritas === 'urgent' && t.status !== 'selesai').length;
  const myTasks = user ? tasks.filter(t => t.assignedTo === user.id && t.status !== 'selesai') : [];

  const today = new Date().toISOString().split('T')[0];
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'selesai' && t.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const stats = [
    { label: "Total Jamaah", value: jamaah.length, color: "#C9A84C" },
    { label: "Paket Aktif", value: paket.filter(p => p.status === 'aktif').length, color: "#4CAF50" },
    { label: "Task Pending", value: tasksBelum, color: "#FF9800" },
    ...(isAdmin ? [{ label: "Pemasukan", value: formatRupiah(totalPemasukan), color: "#2196F3" }] : []),
  ];

  const statusCount = {
    pendaftar: jamaah.filter(j => j.status === 'pendaftar').length,
    proses: jamaah.filter(j => j.status === 'proses').length,
    lunas: jamaah.filter(j => j.status === 'lunas').length,
    berangkat: jamaah.filter(j => j.status === 'berangkat').length,
    selesai: jamaah.filter(j => j.status === 'selesai').length,
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Welcome */}
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1a1200, #0d0d00)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <p className="text-xs text-gray-400">Selamat datang,</p>
        <h2 className="text-lg font-bold text-white">{user?.nama}</h2>
        <p className="text-xs text-gray-500 mt-1">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        {tasksUrgent > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(255,87,34,0.1)", color: "#FF5722" }}>
            <span>!</span>
            <span>{tasksUrgent} task urgent memerlukan perhatian segera</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>
              {typeof s.value === 'number' ? s.value : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Status Jamaah */}
      {jamaah.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-sm font-bold text-white mb-3">Status Jamaah</p>
          <div className="space-y-2">
            {Object.entries(statusCount).map(([key, val]) => {
              const total = jamaah.length || 1;
              const pct = Math.round((val / total) * 100);
              const colors: Record<string, string> = {
                pendaftar: "#FF9800", proses: "#2196F3", lunas: "#4CAF50", berangkat: "#9C27B0", selesai: "#607D8B"
              };
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-20 capitalize">{key}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "#1e1e1e" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colors[key] }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: colors[key] }}>{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Tasks & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {myTasks.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-sm font-bold text-white mb-3">Task Saya</p>
            <div className="space-y-2">
              {myTasks.slice(0, 5).map(t => {
                const pColors: Record<string, string> = { rendah: "#607D8B", sedang: "#FF9800", tinggi: "#f44336", urgent: "#d32f2f" };
                return (
                  <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "#1a1a1a" }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pColors[t.prioritas] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{t.judul}</p>
                      <p className="text-[10px] text-gray-500">{t.deadline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {upcomingDeadlines.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-sm font-bold text-white mb-3">Deadline Terdekat</p>
            <div className="space-y-2">
              {upcomingDeadlines.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: "#1a1a1a" }}>
                  <p className="text-xs text-white truncate flex-1">{t.judul}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                    style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                    {new Date(t.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {jamaah.length === 0 && paket.length === 0 && (
        <div className="text-center py-12 rounded-xl" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-4xl mb-3">🕌</p>
          <p className="text-sm text-gray-400 mb-1">Selamat datang di Arbani Management System</p>
          <p className="text-xs text-gray-600">Mulai dengan menambahkan Paket Umroh dan data Jamaah</p>
        </div>
      )}
    </div>
  );
}

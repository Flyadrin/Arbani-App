"use client";

import { useState, useEffect } from "react";
import { userStore } from "@/lib/store";
import { User, Role } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const ROLE_OPTIONS: { value: Role; label: string; color: string }[] = [
  { value: "admin", label: "Admin", color: "#C9A84C" },
  { value: "karyawan", label: "Karyawan", color: "#2196F3" },
];

const JABATAN_OPTIONS = [
  "Administrator",
  "Staff Operasional",
  "Staff Keuangan",
  "Staff Marketing",
  "Customer Service",
  "Tour Leader",
  "Mutawif",
  "Driver",
  "Lainnya",
];

const emptyForm: Omit<User, "id" | "createdAt"> = {
  nama: "",
  email: "",
  password: "",
  role: "karyawan",
  telepon: "",
  jabatan: "",
  aktif: true,
};

export default function KaryawanPage() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("semua");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const reload = () => {
    setUsers(userStore.getAll());
  };

  useEffect(() => {
    reload();
  }, []);

  // Filtered list
  const filtered = users.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.telepon.includes(search) ||
      u.jabatan.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "semua" || u.role === filterRole;
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && u.aktif) ||
      (filterStatus === "nonaktif" && !u.aktif);
    return matchSearch && matchRole && matchStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditingId(u.id);
    setForm({
      nama: u.nama,
      email: u.email,
      password: u.password,
      role: u.role,
      telepon: u.telepon,
      jabatan: u.jabatan,
      aktif: u.aktif,
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nama.trim() || !form.email.trim()) return;
    if (!editingId && !form.password.trim()) return;
    if (editingId) {
      const updateData: Partial<User> = { ...form };
      if (!form.password.trim()) {
        delete updateData.password;
      }
      userStore.update(editingId, updateData);
    } else {
      userStore.create(form);
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = (id: string) => {
    userStore.delete(id);
    setDeleteConfirm(null);
    reload();
  };

  const toggleAktif = (u: User) => {
    userStore.update(u.id, { aktif: !u.aktif });
    reload();
  };

  const getRoleStyle = (role: Role) => {
    const opt = ROLE_OPTIONS.find((r) => r.value === role);
    return opt
      ? { background: `${opt.color}20`, color: opt.color }
      : {};
  };

  const getRoleLabel = (role: Role) => {
    const opt = ROLE_OPTIONS.find((r) => r.value === role);
    return opt ? opt.label : role;
  };

  const inputStyle: React.CSSProperties = {
    background: "#1a1a1a",
    border: "1px solid #242424",
    color: "#fff",
  };

  const inputClass =
    "w-full text-xs px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#C9A84C] placeholder-gray-600";

  // Stats
  const totalActive = users.filter((u) => u.aktif).length;
  const totalInactive = users.filter((u) => !u.aktif).length;
  const totalAdmin = users.filter((u) => u.role === "admin").length;
  const totalKaryawan = users.filter((u) => u.role === "karyawan").length;

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="rounded-2xl p-8 text-center max-w-sm"
          style={{ background: "#141414", border: "1px solid #1e1e1e" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(244,67,54,0.1)" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f44336"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Akses Ditolak</h3>
          <p className="text-xs text-gray-500">
            Hanya admin yang dapat mengelola data karyawan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Data Karyawan</h1>
          <p className="text-xs text-gray-500">
            Kelola karyawan dan pengguna sistem Arbani Tour
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 self-start flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #C9A84C, #B8963F)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Tambah Karyawan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Karyawan", value: users.length, color: "#C9A84C" },
          { label: "Aktif", value: totalActive, color: "#4CAF50" },
          { label: "Non-Aktif", value: totalInactive, color: "#f44336" },
          { label: "Admin", value: totalAdmin, color: "#2196F3" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-3"
            style={{ background: "#141414", border: "1px solid #1e1e1e" }}
          >
            <p className="text-[10px] text-gray-500">{s.label}</p>
            <p className="text-lg font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari nama, email, telepon, jabatan..."
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#C9A84C] placeholder-gray-600"
            style={{
              background: "#141414",
              border: "1px solid #1e1e1e",
              color: "#fff",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm"
            >
              &times;
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Role filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg outline-none"
            style={{
              background: "#141414",
              border: "1px solid #242424",
              color: "#ccc",
            }}
          >
            <option value="semua">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="karyawan">Karyawan</option>
          </select>
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg outline-none"
            style={{
              background: "#141414",
              border: "1px solid #242424",
              color: "#ccc",
            }}
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non-Aktif</option>
          </select>
        </div>
      </div>

      {/* Employee list */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "#141414", border: "1px solid #1e1e1e" }}
        >
          <p className="text-gray-600 text-sm">Tidak ada karyawan ditemukan</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="rounded-xl p-4 transition-colors"
              style={{
                background: "#141414",
                border: `1px solid ${u.aktif ? "#1e1e1e" : "rgba(244,67,54,0.15)"}`,
                opacity: u.aktif ? 1 : 0.7,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background: u.aktif
                      ? "linear-gradient(135deg, #A07830, #C9A84C)"
                      : "#333",
                    color: u.aktif ? "#0A0A0A" : "#666",
                  }}
                >
                  {u.nama
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white truncate">
                      {u.nama}
                    </p>
                    {/* Role badge */}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={getRoleStyle(u.role)}
                    >
                      {getRoleLabel(u.role)}
                    </span>
                    {/* Active status */}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: u.aktif
                          ? "rgba(76,175,80,0.15)"
                          : "rgba(244,67,54,0.15)",
                        color: u.aktif ? "#4CAF50" : "#f44336",
                      }}
                    >
                      {u.aktif ? "Aktif" : "Non-Aktif"}
                    </span>
                    {/* Current user indicator */}
                    {currentUser?.id === u.id && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(201,168,76,0.1)",
                          color: "#C9A84C",
                        }}
                      >
                        Anda
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
                    <p className="text-[11px] text-gray-500">{u.jabatan}</p>
                    <p className="text-[11px] text-gray-600">{u.email}</p>
                    {u.telepon && (
                      <p className="text-[11px] text-gray-600">{u.telepon}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Toggle aktif */}
                  <button
                    onClick={() => toggleAktif(u)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    title={u.aktif ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {u.aktif ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4CAF50"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f44336"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(u)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-[#C9A84C]"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  {/* Delete */}
                  {currentUser?.id !== u.id && (
                    <>
                      {deleteConfirm === u.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="px-2 py-1 rounded text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded text-[10px] text-gray-500 hover:bg-white/5 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(u.id)}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-red-400"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="text-[10px] text-gray-600 text-center">
        Menampilkan {filtered.length} dari {users.length} karyawan
      </p>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowModal(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
            style={{ background: "#141414", border: "1px solid #242424" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingId ? "Edit Karyawan" : "Tambah Karyawan Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {/* Nama */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Nama lengkap karyawan..."
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@arbani.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Password {editingId ? "(kosongkan jika tidak diubah)" : "*"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder={
                      editingId ? "Kosongkan jika tidak diubah" : "Password..."
                    }
                    className={inputClass}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
                  >
                    {showPassword ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Telepon */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Telepon
                </label>
                <input
                  type="tel"
                  value={form.telepon}
                  onChange={(e) =>
                    setForm({ ...form, telepon: e.target.value })
                  }
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Role & Jabatan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value as Role })
                    }
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="karyawan">Karyawan</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">
                    Jabatan
                  </label>
                  <select
                    value={form.jabatan}
                    onChange={(e) =>
                      setForm({ ...form, jabatan: e.target.value })
                    }
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Pilih jabatan...</option>
                    {JABATAN_OPTIONS.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status aktif */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, aktif: !form.aktif })}
                  className="relative w-10 h-5 rounded-full transition-colors"
                  style={{
                    background: form.aktif
                      ? "linear-gradient(135deg, #A07830, #C9A84C)"
                      : "#333",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{
                      transform: form.aktif
                        ? "translateX(22px)"
                        : "translateX(2px)",
                    }}
                  />
                </button>
                <span className="text-xs text-gray-400">
                  Status: {form.aktif ? "Aktif" : "Non-Aktif"}
                </span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 text-xs py-2.5 rounded-lg transition-colors text-gray-400 hover:bg-white/5"
                style={{ border: "1px solid #242424" }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !form.nama.trim() ||
                  !form.email.trim() ||
                  (!editingId && !form.password.trim())
                }
                className="flex-1 text-xs py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #A07830, #C9A84C)",
                  color: "#0A0A0A",
                }}
              >
                {editingId ? "Simpan Perubahan" : "Tambah Karyawan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

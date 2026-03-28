"use client";

import { useState, useEffect } from "react";
import { jamaahStore, paketStore, formatRupiah } from "@/lib/store";
import { Jamaah, PaketUmroh } from "@/lib/types";

const STATUS_OPTIONS: { value: Jamaah["status"]; label: string; color: string }[] = [
  { value: "pendaftar", label: "Pendaftar", color: "#FF9800" },
  { value: "proses", label: "Proses", color: "#2196F3" },
  { value: "lunas", label: "Lunas", color: "#4CAF50" },
  { value: "berangkat", label: "Berangkat", color: "#9C27B0" },
  { value: "selesai", label: "Selesai", color: "#607D8B" },
];

const GOLDAR_OPTIONS = ["A", "B", "AB", "O", "-"];
const STATUS_KAWIN_OPTIONS = ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"];
const PENDIDIKAN_OPTIONS = ["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3", "Lainnya"];

const emptyForm: Omit<Jamaah, "id" | "createdAt" | "updatedAt"> = {
  namaLengkap: "",
  nik: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "L",
  golonganDarah: "",
  statusPerkawinan: "",
  pekerjaan: "",
  pendidikan: "",
  alamat: "",
  kelurahan: "",
  kecamatan: "",
  kota: "",
  provinsi: "",
  kodePos: "",
  telepon: "",
  email: "",
  noPaspor: "",
  masaBerlakuPaspor: "",
  tempatDikeluarkan: "",
  namaKeluarga: "",
  hubunganKeluarga: "",
  teleponKeluarga: "",
  paketId: "",
  status: "pendaftar",
  catatanKhusus: "",
  fotoUrl: "",
};

function getStatusStyle(status: Jamaah["status"]) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return opt ? { background: `${opt.color}20`, color: opt.color } : {};
}

export default function JamaahPage() {
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [paketList, setPaketList] = useState<PaketUmroh[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const reload = () => {
    setJamaahList(jamaahStore.getAll());
    setPaketList(paketStore.getAll());
  };

  useEffect(() => {
    reload();
  }, []);

  // Filtered list
  const filtered = jamaahList.filter((j) => {
    const matchSearch =
      j.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      j.nik.includes(search) ||
      j.telepon.includes(search) ||
      j.noPaspor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getPaketName = (paketId: string) => {
    const p = paketList.find((pk) => pk.id === paketId);
    return p ? p.namaPaket : "-";
  };

  const getPaketHarga = (paketId: string) => {
    const p = paketList.find((pk) => pk.id === paketId);
    return p ? formatRupiah(p.harga) : "-";
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (j: Jamaah) => {
    setEditingId(j.id);
    const { id, createdAt, updatedAt, ...rest } = j;
    setForm(rest);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.namaLengkap.trim()) return;
    if (editingId) {
      jamaahStore.update(editingId, form);
    } else {
      jamaahStore.create(form);
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = (id: string) => {
    jamaahStore.delete(id);
    setDeleteConfirm(null);
    reload();
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---- Render helpers ----

  const inputStyle: React.CSSProperties = {
    background: "#0A0A0A",
    border: "1px solid #242424",
    color: "#fff",
  };

  const labelClass = "block text-xs text-gray-400 mb-1";
  const inputClass = "w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#C9A84C] placeholder-gray-600";

  const renderInput = (label: string, field: string, type = "text", placeholder = "") => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        className={inputClass}
        style={inputStyle}
        placeholder={placeholder}
        value={(form as Record<string, string>)[field] || ""}
        onChange={(e) => updateField(field, e.target.value)}
      />
    </div>
  );

  const renderSelect = (label: string, field: string, options: { value: string; label: string }[]) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        className={inputClass}
        style={inputStyle}
        value={(form as Record<string, string>)[field] || ""}
        onChange={(e) => updateField(field, e.target.value)}
      >
        <option value="">-- Pilih --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  const sectionTitle = (title: string) => (
    <div className="col-span-full mt-2 mb-1">
      <h4 className="text-sm font-bold" style={{ color: "#C9A84C" }}>
        {title}
      </h4>
      <div className="h-px mt-1" style={{ background: "#242424" }} />
    </div>
  );

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Data Jamaah</h1>
          <p className="text-xs text-gray-500">Kelola data jamaah umroh Arbani Tour</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 self-start"
          style={{ background: "linear-gradient(135deg, #C9A84C, #B8963F)" }}
        >
          + Tambah Jamaah
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari nama, NIK, telepon, paspor..."
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#C9A84C] placeholder-gray-600"
            style={{ background: "#141414", border: "1px solid #1e1e1e", color: "#fff" }}
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
          <button
            onClick={() => setFilterStatus("semua")}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filterStatus === "semua" ? "#C9A84C" : "#141414",
              color: filterStatus === "semua" ? "#000" : "#999",
              border: filterStatus === "semua" ? "1px solid #C9A84C" : "1px solid #1e1e1e",
            }}
          >
            Semua ({jamaahList.length})
          </button>
          {STATUS_OPTIONS.map((s) => {
            const count = jamaahList.filter((j) => j.status === s.value).length;
            const active = filterStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setFilterStatus(s.value)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: active ? `${s.color}30` : "#141414",
                  color: active ? s.color : "#999",
                  border: active ? `1px solid ${s.color}50` : "1px solid #1e1e1e",
                }}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
        <span className="text-xs text-gray-400">
          Menampilkan <span className="text-white font-semibold">{filtered.length}</span> dari{" "}
          <span className="text-white font-semibold">{jamaahList.length}</span> jamaah
        </span>
      </div>

      {/* Jamaah List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-gray-400">
            {jamaahList.length === 0 ? "Belum ada data jamaah. Klik \"+ Tambah Jamaah\" untuk memulai." : "Tidak ada jamaah yang cocok dengan pencarian."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((j) => (
            <div
              key={j.id}
              className="rounded-xl p-4 transition-all hover:border-gray-600"
              style={{ background: "#141414", border: "1px solid #1e1e1e" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "#C9A84C20", color: "#C9A84C" }}
                >
                  {j.namaLengkap.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white truncate">{j.namaLengkap}</h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                      style={getStatusStyle(j.status)}
                    >
                      {j.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-xs text-gray-500">NIK: {j.nik || "-"}</span>
                    <span className="text-xs text-gray-500">Telp: {j.telepon || "-"}</span>
                    <span className="text-xs text-gray-500">Paspor: {j.noPaspor || "-"}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs" style={{ color: "#C9A84C" }}>
                      Paket: {getPaketName(j.paketId)}
                    </span>
                    {j.paketId && (
                      <span className="text-xs text-gray-500 ml-2">({getPaketHarga(j.paketId)})</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(j)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: "#1e1e1e", color: "#C9A84C", border: "1px solid #242424" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(j.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: "#1e1e1e", color: "#f44336", border: "1px solid #242424" }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="rounded-2xl p-6 max-w-sm w-full" style={{ background: "#141414", border: "1px solid #242424" }}>
            <h3 className="text-base font-bold text-white mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-400 mb-4">
              Apakah Anda yakin ingin menghapus data jamaah{" "}
              <span className="text-white font-semibold">
                {jamaahList.find((j) => j.id === deleteConfirm)?.namaLengkap}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: "#1e1e1e", color: "#999", border: "1px solid #242424" }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#f44336" }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-8" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div
            className="rounded-2xl w-full max-w-2xl my-auto"
            style={{ background: "#0A0A0A", border: "1px solid #242424" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "#242424" }}>
              <h3 className="text-base font-bold text-white">
                {editingId ? "Edit Data Jamaah" : "Tambah Jamaah Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-1 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Data Pribadi */}
                {sectionTitle("Data Pribadi")}
                <div className="sm:col-span-2">
                  {renderInput("Nama Lengkap *", "namaLengkap", "text", "Sesuai paspor")}
                </div>
                {renderInput("NIK", "nik", "text", "16 digit")}
                {renderInput("Tempat Lahir", "tempatLahir")}
                {renderInput("Tanggal Lahir", "tanggalLahir", "date")}
                {renderSelect("Jenis Kelamin", "jenisKelamin", [
                  { value: "L", label: "Laki-laki" },
                  { value: "P", label: "Perempuan" },
                ])}
                {renderSelect(
                  "Golongan Darah",
                  "golonganDarah",
                  GOLDAR_OPTIONS.map((g) => ({ value: g, label: g }))
                )}
                {renderSelect(
                  "Status Perkawinan",
                  "statusPerkawinan",
                  STATUS_KAWIN_OPTIONS.map((s) => ({ value: s, label: s }))
                )}
                {renderInput("Pekerjaan", "pekerjaan")}
                {renderSelect(
                  "Pendidikan",
                  "pendidikan",
                  PENDIDIKAN_OPTIONS.map((p) => ({ value: p, label: p }))
                )}

                {/* Alamat */}
                {sectionTitle("Alamat")}
                <div className="sm:col-span-2">
                  {renderInput("Alamat Lengkap", "alamat", "text", "Jalan, RT/RW, No.")}
                </div>
                {renderInput("Kelurahan", "kelurahan")}
                {renderInput("Kecamatan", "kecamatan")}
                {renderInput("Kota/Kabupaten", "kota")}
                {renderInput("Provinsi", "provinsi")}
                {renderInput("Kode Pos", "kodePos")}

                {/* Kontak */}
                {sectionTitle("Kontak")}
                {renderInput("No. Telepon / WA", "telepon", "tel", "08xxx")}
                {renderInput("Email", "email", "email", "email@contoh.com")}

                {/* Dokumen */}
                {sectionTitle("Dokumen Perjalanan")}
                {renderInput("No. Paspor", "noPaspor")}
                {renderInput("Masa Berlaku Paspor", "masaBerlakuPaspor", "date")}
                {renderInput("Tempat Dikeluarkan", "tempatDikeluarkan")}

                {/* Kedaruratan */}
                {sectionTitle("Kontak Kedaruratan")}
                {renderInput("Nama Keluarga", "namaKeluarga")}
                {renderInput("Hubungan", "hubunganKeluarga", "text", "Suami/Istri/Anak/dll")}
                {renderInput("Telepon Keluarga", "teleponKeluarga", "tel")}

                {/* Paket & Status */}
                {sectionTitle("Paket & Status")}
                {renderSelect(
                  "Paket Umroh",
                  "paketId",
                  paketList.map((p) => ({
                    value: p.id,
                    label: `${p.namaPaket} - ${formatRupiah(p.harga)}`,
                  }))
                )}
                {renderSelect(
                  "Status",
                  "status",
                  STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))
                )}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Catatan Khusus</label>
                  <textarea
                    className={inputClass + " resize-none"}
                    style={inputStyle}
                    rows={3}
                    placeholder="Alergi, kondisi kesehatan, permintaan khusus..."
                    value={form.catatanKhusus}
                    onChange={(e) => updateField("catatanKhusus", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end p-5 border-t" style={{ borderColor: "#242424" }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-sm"
                style={{ background: "#1e1e1e", color: "#999", border: "1px solid #242424" }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8963F)" }}
              >
                {editingId ? "Simpan Perubahan" : "Tambah Jamaah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

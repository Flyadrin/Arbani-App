"use client";

import { useState, useEffect } from "react";
import { paketStore, jamaahStore, formatRupiah } from "@/lib/store";
import { PaketUmroh, Jamaah } from "@/lib/types";

const emptyForm: Omit<PaketUmroh, "id" | "createdAt"> = {
  namaPaket: "",
  harga: 0,
  durasi: "",
  tanggalBerangkat: "",
  tanggalPulang: "",
  maskapai: "",
  flightNumberBerangkat: "",
  flightNumberPulang: "",
  hotelMekkah: "",
  bintangHotelMekkah: 5,
  durasiMekkah: "",
  hotelMadinah: "",
  bintangHotelMadinah: 5,
  durasiMadinah: "",
  jamPindahHotel: "",
  transportLokal: "",
  makan: "",
  ziarah: "",
  mutawif: "",
  handling: "",
  perlengkapan: "",
  catatan: "",
  status: "draft",
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "rgba(158,158,158,0.15)", text: "#9E9E9E", label: "Draft" },
  aktif: { bg: "rgba(76,175,80,0.15)", text: "#4CAF50", label: "Aktif" },
  selesai: { bg: "rgba(96,125,139,0.15)", text: "#607D8B", label: "Selesai" },
};

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < value ? "#C9A84C" : "#333" }}>
          &#9733;
        </span>
      ))}
    </span>
  );
}

export default function PaketPage() {
  const [paketList, setPaketList] = useState<PaketUmroh[]>([]);
  const [jamaahMap, setJamaahMap] = useState<Record<string, Jamaah[]>>({});
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = () => {
    const allPaket = paketStore.getAll();
    setPaketList(allPaket);
    const map: Record<string, Jamaah[]> = {};
    allPaket.forEach((p) => {
      map[p.id] = jamaahStore.getByPaket(p.id);
    });
    setJamaahMap(map);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    filterStatus === "semua"
      ? paketList
      : paketList.filter((p) => p.status === filterStatus);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (p: PaketUmroh) => {
    setEditId(p.id);
    const { id, createdAt, ...rest } = p;
    setForm(rest);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.namaPaket.trim()) return;
    if (editId) {
      paketStore.update(editId, form);
    } else {
      paketStore.create(form);
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    paketStore.delete(id);
    setDeleteConfirm(null);
    loadData();
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    "w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-[#C9A84C]/50 transition";
  const inputStyle = { background: "#1a1a1a", border: "1px solid #2a2a2a" };
  const labelClass = "block text-xs text-gray-400 mb-1.5";

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-white">Paket Umroh</h1>
          <p className="text-xs text-gray-500">
            Kelola paket perjalanan umroh Arbani
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition hover:opacity-90 self-start"
          style={{ background: "#C9A84C" }}
        >
          + Tambah Paket
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["semua", "draft", "aktif", "selesai"].map((s) => {
          const active = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition"
              style={{
                background: active ? "rgba(201,168,76,0.2)" : "#141414",
                color: active ? "#C9A84C" : "#888",
                border: `1px solid ${active ? "rgba(201,168,76,0.3)" : "#1e1e1e"}`,
              }}
            >
              {s === "semua" ? "Semua" : statusColors[s]?.label || s}
              {s !== "semua" && (
                <span className="ml-1.5 opacity-70">
                  ({paketList.filter((p) => p.status === s).length})
                </span>
              )}
              {s === "semua" && (
                <span className="ml-1.5 opacity-70">({paketList.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "#141414", border: "1px solid #1e1e1e" }}
        >
          <p className="text-3xl mb-3">&#128230;</p>
          <p className="text-sm text-gray-400">Belum ada paket umroh</p>
          <p className="text-xs text-gray-600 mt-1">
            Klik &quot;Tambah Paket&quot; untuk membuat paket baru
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const jamaahCount = jamaahMap[p.id]?.length || 0;
            const sc = statusColors[p.status];
            const isExpanded = expandedId === p.id;

            return (
              <div
                key={p.id}
                className="rounded-xl overflow-hidden"
                style={{ background: "#141414", border: "1px solid #1e1e1e" }}
              >
                {/* Card Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {p.namaPaket}
                      </h3>
                      <p
                        className="text-lg font-bold mt-0.5"
                        style={{ color: "#C9A84C" }}
                      >
                        {formatRupiah(p.harga)}
                      </p>
                    </div>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {sc.label}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-500">Durasi</span>
                      <p className="text-gray-300">{p.durasi || "-"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Jamaah</span>
                      <p className="text-gray-300 font-semibold">
                        {jamaahCount} orang
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Berangkat</span>
                      <p className="text-gray-300">
                        {p.tanggalBerangkat
                          ? new Date(p.tanggalBerangkat).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "short", year: "numeric" }
                            )
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pulang</span>
                      <p className="text-gray-300">
                        {p.tanggalPulang
                          ? new Date(p.tanggalPulang).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "short", year: "numeric" }
                            )
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Maskapai</span>
                      <p className="text-gray-300">{p.maskapai || "-"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Hotel Mekkah</span>
                      <p className="text-gray-300 flex items-center gap-1">
                        {p.hotelMekkah || "-"}
                        {p.bintangHotelMekkah > 0 && (
                          <span
                            className="text-[10px]"
                            style={{ color: "#C9A84C" }}
                          >
                            ({p.bintangHotelMekkah}&#9733;)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Land Arrangement Toggle */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : p.id)
                    }
                    className="mt-3 text-xs font-medium transition flex items-center gap-1"
                    style={{ color: "#C9A84C" }}
                  >
                    {isExpanded ? "Sembunyikan" : "Lihat"} Land Arrangement
                    <span
                      className="transition-transform inline-block"
                      style={{
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      &#9660;
                    </span>
                  </button>
                </div>

                {/* Expanded Land Arrangement */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 pt-2 space-y-2 text-xs"
                    style={{
                      borderTop: "1px solid #1e1e1e",
                      background: "#111",
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { label: "Hotel Madinah", value: `${p.hotelMadinah || "-"} (${p.bintangHotelMadinah}★, ${p.durasiMadinah || "-"})` },
                        { label: "Hotel Mekkah", value: `${p.hotelMekkah || "-"} (${p.bintangHotelMekkah}★, ${p.durasiMekkah || "-"})` },
                        { label: "Jam Pindah Hotel", value: p.jamPindahHotel },
                        { label: "Transport Lokal", value: p.transportLokal },
                        { label: "Makan", value: p.makan },
                        { label: "Ziarah", value: p.ziarah },
                        { label: "Mutawif", value: p.mutawif },
                        { label: "Handling", value: p.handling },
                        { label: "Perlengkapan", value: p.perlengkapan },
                      ].map((item) => (
                        <div key={item.label}>
                          <span className="text-gray-500">{item.label}</span>
                          <p className="text-gray-300">{item.value || "-"}</p>
                        </div>
                      ))}
                    </div>
                    {p.catatan && (
                      <div className="mt-2">
                        <span className="text-gray-500">Catatan</span>
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {p.catatan}
                        </p>
                      </div>
                    )}
                    <div className="mt-1">
                      <span className="text-gray-500">Flight Berangkat</span>
                      <p className="text-gray-300">
                        {p.flightNumberBerangkat || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Flight Pulang</span>
                      <p className="text-gray-300">
                        {p.flightNumberPulang || "-"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div
                  className="flex gap-2 px-4 py-3"
                  style={{ borderTop: "1px solid #1e1e1e" }}
                >
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition hover:opacity-80"
                    style={{
                      background: "rgba(201,168,76,0.1)",
                      color: "#C9A84C",
                      border: "1px solid rgba(201,168,76,0.2)",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition hover:opacity-80"
                    style={{
                      background: "rgba(244,67,54,0.1)",
                      color: "#f44336",
                      border: "1px solid rgba(244,67,54,0.2)",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm"
            style={{ background: "#141414", border: "1px solid #1e1e1e" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-bold text-white mb-2">Hapus Paket?</p>
            <p className="text-xs text-gray-400 mb-1">
              Paket &quot;
              {paketList.find((p) => p.id === deleteConfirm)?.namaPaket}
              &quot; akan dihapus secara permanen.
            </p>
            {(jamaahMap[deleteConfirm]?.length || 0) > 0 && (
              <p className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,152,0,0.1)", color: "#FF9800" }}>
                Paket ini memiliki {jamaahMap[deleteConfirm]?.length} jamaah terdaftar.
              </p>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium"
                style={{ background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a" }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium"
                style={{ background: "rgba(244,67,54,0.2)", color: "#f44336", border: "1px solid rgba(244,67,54,0.3)" }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-8"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-xl w-full max-w-2xl"
            style={{ background: "#0A0A0A", border: "1px solid #1e1e1e" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid #1e1e1e" }}
            >
              <h2 className="text-sm font-bold text-white">
                {editId ? "Edit Paket" : "Tambah Paket Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white text-lg transition"
              >
                &#10005;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section: Info Paket */}
              <div>
                <p
                  className="text-xs font-bold mb-3 pb-2"
                  style={{ color: "#C9A84C", borderBottom: "1px solid #1e1e1e" }}
                >
                  Info Paket
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Nama Paket *</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Paket Umroh Reguler 9 Hari"
                      value={form.namaPaket}
                      onChange={(e) => updateField("namaPaket", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Harga (Rp)</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      type="number"
                      placeholder="0"
                      value={form.harga || ""}
                      onChange={(e) =>
                        updateField("harga", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Durasi</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: 9 Hari"
                      value={form.durasi}
                      onChange={(e) => updateField("durasi", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tanggal Berangkat</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      type="date"
                      value={form.tanggalBerangkat}
                      onChange={(e) =>
                        updateField("tanggalBerangkat", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tanggal Pulang</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      type="date"
                      value={form.tanggalPulang}
                      onChange={(e) =>
                        updateField("tanggalPulang", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      className={inputClass}
                      style={inputStyle}
                      value={form.status}
                      onChange={(e) =>
                        updateField(
                          "status",
                          e.target.value as "draft" | "aktif" | "selesai"
                        )
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="aktif">Aktif</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Penerbangan */}
              <div>
                <p
                  className="text-xs font-bold mb-3 pb-2"
                  style={{ color: "#C9A84C", borderBottom: "1px solid #1e1e1e" }}
                >
                  Penerbangan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Maskapai</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Saudi Airlines"
                      value={form.maskapai}
                      onChange={(e) => updateField("maskapai", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Flight No. Berangkat</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: SV-816"
                      value={form.flightNumberBerangkat}
                      onChange={(e) =>
                        updateField("flightNumberBerangkat", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Flight No. Pulang</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: SV-817"
                      value={form.flightNumberPulang}
                      onChange={(e) =>
                        updateField("flightNumberPulang", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Section: Hotel Mekkah */}
              <div>
                <p
                  className="text-xs font-bold mb-3 pb-2"
                  style={{ color: "#C9A84C", borderBottom: "1px solid #1e1e1e" }}
                >
                  Hotel Mekkah
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Hotel</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Pullman ZamZam"
                      value={form.hotelMekkah}
                      onChange={(e) =>
                        updateField("hotelMekkah", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bintang Hotel</label>
                    <select
                      className={inputClass}
                      style={inputStyle}
                      value={form.bintangHotelMekkah}
                      onChange={(e) =>
                        updateField("bintangHotelMekkah", Number(e.target.value))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} Bintang
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Durasi di Mekkah</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: 4 Malam"
                      value={form.durasiMekkah}
                      onChange={(e) =>
                        updateField("durasiMekkah", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Section: Hotel Madinah */}
              <div>
                <p
                  className="text-xs font-bold mb-3 pb-2"
                  style={{ color: "#C9A84C", borderBottom: "1px solid #1e1e1e" }}
                >
                  Hotel Madinah
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Hotel</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Movenpick Madinah"
                      value={form.hotelMadinah}
                      onChange={(e) =>
                        updateField("hotelMadinah", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bintang Hotel</label>
                    <select
                      className={inputClass}
                      style={inputStyle}
                      value={form.bintangHotelMadinah}
                      onChange={(e) =>
                        updateField(
                          "bintangHotelMadinah",
                          Number(e.target.value)
                        )
                      }
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} Bintang
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Durasi di Madinah</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: 3 Malam"
                      value={form.durasiMadinah}
                      onChange={(e) =>
                        updateField("durasiMadinah", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Section: Land Arrangement */}
              <div>
                <p
                  className="text-xs font-bold mb-3 pb-2"
                  style={{ color: "#C9A84C", borderBottom: "1px solid #1e1e1e" }}
                >
                  Land Arrangement
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jam Pindah Hotel</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Setelah Subuh"
                      value={form.jamPindahHotel}
                      onChange={(e) =>
                        updateField("jamPindahHotel", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Transport Lokal</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Bus AC Full"
                      value={form.transportLokal}
                      onChange={(e) =>
                        updateField("transportLokal", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Makan</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: 3x Sehari (Menu Indonesia)"
                      value={form.makan}
                      onChange={(e) => updateField("makan", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Ziarah</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: City Tour Mekkah & Madinah"
                      value={form.ziarah}
                      onChange={(e) => updateField("ziarah", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Mutawif</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Mutawif Berpengalaman"
                      value={form.mutawif}
                      onChange={(e) => updateField("mutawif", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Handling</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Airport Handling"
                      value={form.handling}
                      onChange={(e) => updateField("handling", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Perlengkapan</label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Contoh: Koper, Tas Jinjing, Buku Doa"
                      value={form.perlengkapan}
                      onChange={(e) =>
                        updateField("perlengkapan", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Catatan</label>
                    <textarea
                      className={inputClass + " resize-none"}
                      style={inputStyle}
                      rows={3}
                      placeholder="Catatan tambahan..."
                      value={form.catatan}
                      onChange={(e) => updateField("catatan", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex gap-3 px-5 py-4"
              style={{ borderTop: "1px solid #1e1e1e" }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition"
                style={{
                  background: "#1a1a1a",
                  color: "#888",
                  border: "1px solid #2a2a2a",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black transition hover:opacity-90"
                style={{ background: "#C9A84C" }}
              >
                {editId ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

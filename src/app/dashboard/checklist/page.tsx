"use client";

import { useState, useEffect } from "react";
import { jamaahStore, checklistStore } from "@/lib/store";
import { Jamaah, ChecklistItem } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function ChecklistPage() {
  const router = useRouter();
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [selectedJamaahId, setSelectedJamaahId] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setJamaahList(jamaahStore.getAll());
  }, []);

  useEffect(() => {
    if (selectedJamaahId) {
      setItems(checklistStore.getByJamaah(selectedJamaahId));
    } else {
      setItems([]);
    }
  }, [selectedJamaahId]);

  const handleToggle = (id: string) => {
    checklistStore.toggle(id);
    setItems(checklistStore.getByJamaah(selectedJamaahId));
  };

  const berkasItems = items.filter((i) => i.kategori === "berkas");
  const perlengkapanItems = items.filter((i) => i.kategori === "perlengkapan");

  const totalItems = items.length;
  const completedItems = items.filter((i) => i.selesai).length;
  const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const berkasCompleted = berkasItems.filter((i) => i.selesai).length;
  const berkasPct = berkasItems.length > 0 ? Math.round((berkasCompleted / berkasItems.length) * 100) : 0;

  const perlengkapanCompleted = perlengkapanItems.filter((i) => i.selesai).length;
  const perlengkapanPct = perlengkapanItems.length > 0 ? Math.round((perlengkapanCompleted / perlengkapanItems.length) * 100) : 0;

  const selectedJamaah = jamaahList.find((j) => j.id === selectedJamaahId);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1a1200, #0d0d00)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <h1 className="text-lg font-bold text-white">Checklist Berkas & Perlengkapan</h1>
        <p className="text-xs text-gray-400 mt-1">Kelola kelengkapan dokumen dan perlengkapan jamaah</p>
      </div>

      {/* Jamaah Selector */}
      <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
        <label className="text-xs text-gray-400 block mb-2">Pilih Jamaah</label>
        <select
          value={selectedJamaahId}
          onChange={(e) => setSelectedJamaahId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          <option value="">-- Pilih Jamaah --</option>
          {jamaahList.map((j) => (
            <option key={j.id} value={j.id}>
              {j.namaLengkap}
            </option>
          ))}
        </select>
      </div>

      {selectedJamaahId && items.length > 0 && (
        <>
          {/* Overall Progress */}
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-white">
                Progress Keseluruhan - {selectedJamaah?.namaLengkap}
              </p>
              <span className="text-sm font-bold" style={{ color: "#C9A84C" }}>
                {completionPct}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: "#1e1e1e" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPct}%`,
                  background: completionPct === 100 ? "#4CAF50" : "linear-gradient(90deg, #C9A84C, #e0c068)",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completedItems} dari {totalItems} item selesai
            </p>
          </div>

          {/* Berkas Section */}
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white">Berkas / Dokumen</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {berkasCompleted}/{berkasItems.length} selesai ({berkasPct}%)
                </p>
              </div>
              <button
                onClick={() => router.push(`/dashboard/scanner?jamaahId=${selectedJamaahId}`)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                Scan Dokumen
              </button>
            </div>
            {/* Berkas progress bar */}
            <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "#1e1e1e" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${berkasPct}%`, background: "#C9A84C" }}
              />
            </div>
            <div className="space-y-2">
              {berkasItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "#1a1a1a", border: "1px solid #222" }}
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      background: item.selesai ? "#C9A84C" : "transparent",
                      border: item.selesai ? "none" : "2px solid #444",
                    }}
                  >
                    {item.selesai && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.selesai ? "text-gray-500 line-through" : "text-white"}`}>
                      {item.nama}
                    </p>
                    {item.tanggalSelesai && (
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        Selesai: {new Date(item.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  {item.scanUrl && (
                    <button
                      onClick={() => setPreviewUrl(item.scanUrl)}
                      className="text-[10px] px-2 py-1 rounded flex-shrink-0"
                      style={{ background: "rgba(33,150,243,0.1)", color: "#2196F3" }}
                    >
                      Lihat Scan
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Perlengkapan Section */}
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white">Perlengkapan</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {perlengkapanCompleted}/{perlengkapanItems.length} selesai ({perlengkapanPct}%)
                </p>
              </div>
            </div>
            {/* Perlengkapan progress bar */}
            <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "#1e1e1e" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${perlengkapanPct}%`, background: "#4CAF50" }}
              />
            </div>
            <div className="space-y-2">
              {perlengkapanItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "#1a1a1a", border: "1px solid #222" }}
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      background: item.selesai ? "#4CAF50" : "transparent",
                      border: item.selesai ? "none" : "2px solid #444",
                    }}
                  >
                    {item.selesai && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.selesai ? "text-gray-500 line-through" : "text-white"}`}>
                      {item.nama}
                    </p>
                    {item.tanggalSelesai && (
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        Selesai: {new Date(item.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty states */}
      {selectedJamaahId && items.length === 0 && (
        <div className="text-center py-12 rounded-xl" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-sm text-gray-400">Belum ada checklist untuk jamaah ini.</p>
          <p className="text-xs text-gray-600 mt-1">Checklist otomatis dibuat saat jamaah didaftarkan.</p>
        </div>
      )}

      {!selectedJamaahId && (
        <div className="text-center py-12 rounded-xl" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-sm text-gray-400">Pilih jamaah untuk melihat checklist.</p>
        </div>
      )}

      {/* Scan Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="rounded-xl p-4 max-w-lg w-full max-h-[80vh] overflow-auto"
            style={{ background: "#141414", border: "1px solid #1e1e1e" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white">Preview Scan Dokumen</p>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-gray-500 hover:text-white text-lg"
              >
                x
              </button>
            </div>
            <img
              src={previewUrl}
              alt="Scan dokumen"
              className="w-full rounded-lg"
              style={{ border: "1px solid #2a2a2a" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { transaksiStore, jamaahStore, paketStore, formatRupiah, terbilang, generateNomorKwitansi } from "@/lib/store";
import { Transaksi, Jamaah, PaketUmroh } from "@/lib/types";

const SYARAT_KETENTUAN = [
  "Pembayaran DP minimal 30% dari total biaya paket.",
  "Pelunasan selambat-lambatnya 1 bulan sebelum keberangkatan.",
  "Pembatalan setelah pelunasan dikenakan biaya administrasi.",
  "Biaya tidak termasuk: pengurusan paspor, vaksin, dan keperluan pribadi.",
  "Jadwal dapat berubah sesuai kebijakan maskapai dan otoritas terkait.",
];

export default function KeuanganPage() {
  const { user, isAdmin } = useAuth();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showKwitansi, setShowKwitansi] = useState<Transaksi | null>(null);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("semua");
  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    jamaahId: "",
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "dp" as Transaksi["jenis"],
    jumlah: 0,
    metodePembayaran: "Transfer Bank",
    keterangan: "",
  });

  useEffect(() => {
    setTransaksi(transaksiStore.getAll());
    setJamaahList(jamaahStore.getAll());
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-3xl mb-3">🔒</p>
          <p className="text-sm text-gray-400">Akses terbatas untuk Administrator</p>
        </div>
      </div>
    );
  }

  const reload = () => {
    setTransaksi(transaksiStore.getAll());
    setJamaahList(jamaahStore.getAll());
  };

  const totalPemasukan = transaksi.filter(t => t.jenis !== "refund").reduce((s, t) => s + t.jumlah, 0);
  const totalRefund = transaksi.filter(t => t.jenis === "refund").reduce((s, t) => s + t.jumlah, 0);
  const totalDP = transaksi.filter(t => t.jenis === "dp").reduce((s, t) => s + t.jumlah, 0);
  const totalCicilan = transaksi.filter(t => t.jenis === "cicilan").reduce((s, t) => s + t.jumlah, 0);
  const totalPelunasan = transaksi.filter(t => t.jenis === "pelunasan").reduce((s, t) => s + t.jumlah, 0);

  const filtered = transaksi.filter(t => {
    if (filterJenis !== "semua" && t.jenis !== filterJenis) return false;
    if (search) {
      const j = jamaahList.find(jm => jm.id === t.jamaahId);
      const name = j?.namaLengkap?.toLowerCase() || "";
      if (!name.includes(search.toLowerCase()) && !t.keterangan.toLowerCase().includes(search.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const handleSubmit = () => {
    if (!form.jamaahId || form.jumlah <= 0) return;
    transaksiStore.create({ ...form, createdBy: user?.id || "" });
    setShowForm(false);
    setForm({ jamaahId: "", tanggal: new Date().toISOString().split("T")[0], jenis: "dp", jumlah: 0, metodePembayaran: "Transfer Bank", keterangan: "" });
    reload();
  };

  const getJamaahName = (id: string) => jamaahList.find(j => j.id === id)?.namaLengkap || "-";
  const getJamaahPaketHarga = (id: string) => {
    const j = jamaahList.find(jm => jm.id === id);
    if (!j?.paketId) return 0;
    return paketStore.getById(j.paketId)?.harga || 0;
  };

  const jenisLabel: Record<string, string> = { dp: "DP", cicilan: "Cicilan", pelunasan: "Pelunasan", refund: "Refund" };
  const jenisColor: Record<string, string> = { dp: "#FF9800", cicilan: "#2196F3", pelunasan: "#4CAF50", refund: "#f44336" };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Kwitansi Arbani Tour</title>
      <style>
        body { font-family: 'Georgia', serif; padding: 40px; color: #000; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 22px; margin: 0; letter-spacing: 2px; }
        .header p { font-size: 11px; color: #555; margin: 4px 0 0; }
        .info-grid { display: grid; grid-template-columns: 140px 1fr; gap: 6px 12px; margin-bottom: 20px; font-size: 13px; }
        .info-grid .label { font-weight: bold; }
        .amount-box { background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0; }
        .amount-box .big { font-size: 24px; font-weight: bold; }
        .amount-box .words { font-size: 11px; font-style: italic; color: #555; margin-top: 4px; }
        .terms { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; }
        .terms h3 { font-size: 12px; font-weight: bold; margin-bottom: 8px; }
        .terms ol { font-size: 11px; color: #555; padding-left: 20px; line-height: 1.8; }
        .footer { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; font-size: 12px; }
        .footer .sig { width: 200px; }
        .footer .sig .line { border-top: 1px solid #000; margin-top: 60px; padding-top: 4px; }
      </style></head><body>${printContent.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Pemasukan", value: formatRupiah(totalPemasukan), color: "#4CAF50" },
          { label: "Total DP", value: formatRupiah(totalDP), color: "#FF9800" },
          { label: "Total Cicilan", value: formatRupiah(totalCicilan), color: "#2196F3" },
          { label: "Total Pelunasan", value: formatRupiah(totalPelunasan), color: "#4CAF50" },
          { label: "Total Refund", value: formatRupiah(totalRefund), color: "#f44336" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-[10px] text-gray-500">{s.label}</p>
            <p className="text-sm font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari jamaah / keterangan..."
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-sm text-white"
          style={{ background: "#141414", border: "1px solid #1e1e1e" }} />
        <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm text-white"
          style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <option value="semua">Semua Jenis</option>
          <option value="dp">DP</option>
          <option value="cicilan">Cicilan</option>
          <option value="pelunasan">Pelunasan</option>
          <option value="refund">Refund</option>
        </select>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
          + Transaksi
        </button>
      </div>

      {/* Transaction list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-xl" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-gray-500 text-sm">Belum ada transaksi</p>
          </div>
        )}
        {filtered.map(t => {
          const harga = getJamaahPaketHarga(t.jamaahId);
          const totalBayar = transaksiStore.getTotalByJamaah(t.jamaahId);
          return (
            <div key={t.id} className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${jenisColor[t.jenis]}15`, color: jenisColor[t.jenis] }}>
                {t.jenis === "dp" ? "D" : t.jenis === "cicilan" ? "C" : t.jenis === "pelunasan" ? "P" : "R"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{getJamaahName(t.jamaahId)}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${jenisColor[t.jenis]}20`, color: jenisColor[t.jenis] }}>
                    {jenisLabel[t.jenis]}
                  </span>
                  <span className="text-[10px] text-gray-500">{t.tanggal}</span>
                  {t.keterangan && <span className="text-[10px] text-gray-600 truncate">• {t.keterangan}</span>}
                </div>
                {harga > 0 && (
                  <div className="mt-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1e1e1e" }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (totalBayar / harga) * 100)}%`, background: totalBayar >= harga ? "#4CAF50" : "#C9A84C" }} />
                      </div>
                      <span className="text-[10px] text-gray-500">{Math.round((totalBayar / harga) * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold" style={{ color: t.jenis === "refund" ? "#f44336" : "#4CAF50" }}>
                  {t.jenis === "refund" ? "-" : "+"}{formatRupiah(t.jumlah)}
                </p>
                <button onClick={() => setShowKwitansi(t)} className="text-[10px] mt-1 underline" style={{ color: "#C9A84C" }}>
                  Kwitansi
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #242424" }}>
              <h2 className="text-sm font-bold text-white">Tambah Transaksi</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jamaah</label>
                <select value={form.jamaahId} onChange={e => setForm({ ...form, jamaahId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                  style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                  <option value="">Pilih Jamaah</option>
                  {jamaahList.map(j => <option key={j.id} value={j.id}>{j.namaLengkap}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                    style={{ background: "#1a1a1a", border: "1px solid #242424" }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Jenis</label>
                  <select value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value as Transaksi["jenis"] })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                    style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                    <option value="dp">DP</option>
                    <option value="cicilan">Cicilan</option>
                    <option value="pelunasan">Pelunasan</option>
                    <option value="refund">Refund</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jumlah (Rp)</label>
                <input type="number" value={form.jumlah || ""} onChange={e => setForm({ ...form, jumlah: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                  style={{ background: "#1a1a1a", border: "1px solid #242424" }}
                  placeholder="0" />
                {form.jumlah > 0 && <p className="text-[10px] text-gray-500 mt-1">Terbilang: {terbilang(form.jumlah)} Rupiah</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Metode Pembayaran</label>
                <select value={form.metodePembayaran} onChange={e => setForm({ ...form, metodePembayaran: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white"
                  style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                  <option>Transfer Bank</option>
                  <option>Tunai</option>
                  <option>QRIS</option>
                  <option>Kartu Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Keterangan</label>
                <textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white resize-none"
                  style={{ background: "#1a1a1a", border: "1px solid #242424" }} rows={2} />
              </div>
              {form.jamaahId && (
                <div className="p-3 rounded-lg" style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                  <p className="text-[10px] text-gray-500 mb-1">Info Pembayaran Jamaah</p>
                  <p className="text-xs text-gray-400">Harga Paket: {formatRupiah(getJamaahPaketHarga(form.jamaahId))}</p>
                  <p className="text-xs text-gray-400">Sudah Dibayar: {formatRupiah(transaksiStore.getTotalByJamaah(form.jamaahId))}</p>
                  <p className="text-xs font-bold" style={{ color: "#C9A84C" }}>
                    Sisa: {formatRupiah(Math.max(0, getJamaahPaketHarga(form.jamaahId) - transaksiStore.getTotalByJamaah(form.jamaahId)))}
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 flex gap-2" style={{ borderTop: "1px solid #242424" }}>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 border" style={{ borderColor: "#242424" }}>Batal</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg text-sm font-bold" style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Kwitansi Modal */}
      {showKwitansi && (
        <div className="modal-overlay" onClick={() => setShowKwitansi(null)}>
          <div className="modal-content" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #242424" }}>
              <h2 className="text-sm font-bold text-white">Kwitansi</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}>
                  Cetak
                </button>
                <button onClick={() => setShowKwitansi(null)} className="text-gray-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>
              {/* Preview */}
              <div className="rounded-xl p-6" style={{ background: "#1a1a1a", border: "1px solid #242424" }}>
                <div ref={printRef}>
                  <div className="header" style={{ textAlign: "center", borderBottom: "3px double #555", paddingBottom: 16, marginBottom: 20 }}>
                    <h1 style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 2 }}>PT. ARBANI MADINAH WISATA</h1>
                    <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Jl. Pamularsih Raya No. 104, Semarang | Telp: (024) 7601577</p>
                    <p style={{ fontSize: 14, fontWeight: "bold", marginTop: 12, letterSpacing: 3 }}>KWITANSI PEMBAYARAN</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "6px 12px", fontSize: 13, marginBottom: 16 }}>
                    <span style={{ color: "#888" }}>No. Kwitansi</span><span style={{ fontWeight: "bold" }}>: {generateNomorKwitansi()}</span>
                    <span style={{ color: "#888" }}>Tanggal</span><span>: {new Date(showKwitansi.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span style={{ color: "#888" }}>Nama Jamaah</span><span>: {getJamaahName(showKwitansi.jamaahId)}</span>
                    <span style={{ color: "#888" }}>Jenis Bayar</span><span>: {jenisLabel[showKwitansi.jenis]}</span>
                    <span style={{ color: "#888" }}>Metode</span><span>: {showKwitansi.metodePembayaran}</span>
                    {showKwitansi.keterangan && <><span style={{ color: "#888" }}>Keterangan</span><span>: {showKwitansi.keterangan}</span></>}
                  </div>
                  <div style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: 16, textAlign: "center", margin: "16px 0" }}>
                    <p style={{ fontSize: 22, fontWeight: "bold", color: "#C9A84C" }}>{formatRupiah(showKwitansi.jumlah)}</p>
                    <p style={{ fontSize: 11, fontStyle: "italic", color: "#888", marginTop: 4 }}>Terbilang: {terbilang(showKwitansi.jumlah)} Rupiah</p>
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #333" }}>
                    <p style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>Syarat & Ketentuan:</p>
                    <ol style={{ fontSize: 11, color: "#888", paddingLeft: 20, lineHeight: 1.8 }}>
                      {SYARAT_KETENTUAN.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, textAlign: "center", fontSize: 12 }}>
                    <div>
                      <p style={{ color: "#888" }}>Penerima</p>
                      <div style={{ borderTop: "1px solid #555", marginTop: 60, paddingTop: 4, width: 150 }}>
                        <p>{getJamaahName(showKwitansi.jamaahId)}</p>
                      </div>
                    </div>
                    <div>
                      <p style={{ color: "#888" }}>Semarang, {new Date(showKwitansi.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <p style={{ color: "#888" }}>Hormat Kami,</p>
                      <div style={{ borderTop: "1px solid #555", marginTop: 48, paddingTop: 4, width: 150 }}>
                        <p>PT. Arbani Madinah Wisata</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

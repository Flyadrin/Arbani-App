"use client";

import { useState, useEffect, useRef } from "react";
import { jamaahStore, paketStore } from "@/lib/store";
import { Jamaah, PaketUmroh, SiskopatuhData } from "@/lib/types";

const EMPTY_FORM: SiskopatuhData = {
  jamaahId: "",
  namaLengkap: "",
  noPaspor: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  kewarganegaraan: "Indonesia",
  alamat: "",
  nomorKTP: "",
  namaAhliWaris: "",
  hubunganAhliWaris: "",
  teleponAhliWaris: "",
  namaBiroPerjalanan: "PT. Arbani Madinah Wisata",
  nomorIzinBiro: "No. 123/2024",
  tanggalKeberangkatan: "",
  tanggalKepulangan: "",
};

const FIELD_LABELS: Record<keyof Omit<SiskopatuhData, "jamaahId">, string> = {
  namaLengkap: "Nama Lengkap",
  noPaspor: "No. Paspor",
  tempatLahir: "Tempat Lahir",
  tanggalLahir: "Tanggal Lahir",
  jenisKelamin: "Jenis Kelamin",
  kewarganegaraan: "Kewarganegaraan",
  alamat: "Alamat",
  nomorKTP: "Nomor KTP (NIK)",
  namaAhliWaris: "Nama Ahli Waris",
  hubunganAhliWaris: "Hubungan dengan Ahli Waris",
  teleponAhliWaris: "Telepon Ahli Waris",
  namaBiroPerjalanan: "Nama Biro Perjalanan",
  nomorIzinBiro: "Nomor Izin Biro",
  tanggalKeberangkatan: "Tanggal Keberangkatan",
  tanggalKepulangan: "Tanggal Kepulangan",
};

export default function SiskopatuhPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [selectedJamaahId, setSelectedJamaahId] = useState("");
  const [formData, setFormData] = useState<SiskopatuhData>({ ...EMPTY_FORM });
  const [isPrintView, setIsPrintView] = useState(false);

  useEffect(() => {
    setJamaahList(jamaahStore.getAll());
  }, []);

  useEffect(() => {
    if (!selectedJamaahId) {
      setFormData({ ...EMPTY_FORM });
      return;
    }

    const jamaah = jamaahStore.getById(selectedJamaahId);
    if (!jamaah) return;

    let tanggalBerangkat = "";
    let tanggalPulang = "";
    if (jamaah.paketId) {
      const paket = paketStore.getById(jamaah.paketId);
      if (paket) {
        tanggalBerangkat = paket.tanggalBerangkat;
        tanggalPulang = paket.tanggalPulang;
      }
    }

    setFormData({
      jamaahId: jamaah.id,
      namaLengkap: jamaah.namaLengkap,
      noPaspor: jamaah.noPaspor,
      tempatLahir: jamaah.tempatLahir,
      tanggalLahir: jamaah.tanggalLahir,
      jenisKelamin: jamaah.jenisKelamin === "L" ? "Laki-laki" : "Perempuan",
      kewarganegaraan: "Indonesia",
      alamat: [jamaah.alamat, jamaah.kota].filter(Boolean).join(", "),
      nomorKTP: jamaah.nik,
      namaAhliWaris: jamaah.namaKeluarga,
      hubunganAhliWaris: jamaah.hubunganKeluarga,
      teleponAhliWaris: jamaah.teleponKeluarga,
      namaBiroPerjalanan: "PT. Arbani Madinah Wisata",
      nomorIzinBiro: "No. 123/2024",
      tanggalKeberangkatan: tanggalBerangkat,
      tanggalKepulangan: tanggalPulang,
    });
  }, [selectedJamaahId]);

  const handleChange = (field: keyof SiskopatuhData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    setIsPrintView(true);
    setTimeout(() => {
      window.print();
      setIsPrintView(false);
    }, 300);
  };

  const formatTanggal = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formFields = Object.keys(FIELD_LABELS) as Array<keyof Omit<SiskopatuhData, "jamaahId">>;

  // Print view
  if (isPrintView) {
    return (
      <div
        ref={printRef}
        className="fixed inset-0 z-50 overflow-auto"
        style={{ background: "#fff", color: "#000" }}
      >
        <div className="max-w-2xl mx-auto p-8" style={{ fontFamily: "serif" }}>
          {/* Header */}
          <div className="text-center mb-8 pb-4" style={{ borderBottom: "2px solid #000" }}>
            <h1 className="text-xl font-bold uppercase tracking-wide">SISKOPATUH</h1>
            <p className="text-sm mt-1">Sistem Komputerisasi Pengendalian Umroh Terpadu Haji</p>
            <p className="text-sm">Formulir Pendaftaran Jamaah Umroh</p>
          </div>

          {/* Biro Info */}
          <div className="mb-6 p-3" style={{ border: "1px solid #ccc", background: "#f9f9f9" }}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-bold">Biro Perjalanan:</span>{" "}
                {formData.namaBiroPerjalanan}
              </div>
              <div>
                <span className="font-bold">No. Izin:</span>{" "}
                {formData.nomorIzinBiro}
              </div>
            </div>
          </div>

          {/* Data Jamaah */}
          <h2 className="font-bold text-base mb-3 uppercase">Data Jamaah</h2>
          <table className="w-full text-sm mb-6" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {formFields.slice(0, 8).map((field) => (
                <tr key={field} style={{ borderBottom: "1px solid #ddd" }}>
                  <td className="py-2 pr-4 font-semibold w-48 align-top">{FIELD_LABELS[field]}</td>
                  <td className="py-2 pl-2">
                    : {field.includes("tanggal") ? formatTanggal(formData[field]) : formData[field] || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Data Ahli Waris */}
          <h2 className="font-bold text-base mb-3 uppercase">Data Ahli Waris / Keluarga</h2>
          <table className="w-full text-sm mb-6" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {formFields.slice(8, 11).map((field) => (
                <tr key={field} style={{ borderBottom: "1px solid #ddd" }}>
                  <td className="py-2 pr-4 font-semibold w-48 align-top">{FIELD_LABELS[field]}</td>
                  <td className="py-2 pl-2">: {formData[field] || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Jadwal */}
          <h2 className="font-bold text-base mb-3 uppercase">Jadwal Perjalanan</h2>
          <table className="w-full text-sm mb-8" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {formFields.slice(13).map((field) => (
                <tr key={field} style={{ borderBottom: "1px solid #ddd" }}>
                  <td className="py-2 pr-4 font-semibold w-48 align-top">{FIELD_LABELS[field]}</td>
                  <td className="py-2 pl-2">: {formatTanggal(formData[field])}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-12 text-sm text-center">
            <div>
              <p>Jamaah,</p>
              <div className="h-20" />
              <p className="font-bold" style={{ borderTop: "1px solid #000", paddingTop: "4px", display: "inline-block", minWidth: "180px" }}>
                {formData.namaLengkap}
              </p>
            </div>
            <div>
              <p>Biro Perjalanan,</p>
              <div className="h-20" />
              <p className="font-bold" style={{ borderTop: "1px solid #000", paddingTop: "4px", display: "inline-block", minWidth: "180px" }}>
                {formData.namaBiroPerjalanan}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1a1200, #0d0d00)", border: "1px solid rgba(201,168,76,0.2)" }}>
        <h1 className="text-lg font-bold text-white">Siskopatuh</h1>
        <p className="text-xs text-gray-400 mt-1">
          Formulir pendaftaran jamaah umroh untuk Sistem Komputerisasi Pengendalian Umroh Terpadu Haji
        </p>
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

      {selectedJamaahId && (
        <>
          {/* Form: Data Pribadi */}
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-sm font-bold text-white mb-4">Data Pribadi</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formFields.slice(0, 8).map((field) => (
                <div key={field} className={field === "alamat" ? "md:col-span-2" : ""}>
                  <label className="text-xs text-gray-400 block mb-1">{FIELD_LABELS[field]}</label>
                  {field === "alamat" ? (
                    <textarea
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none"
                      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                    />
                  ) : field === "jenisKelamin" ? (
                    <select
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                    >
                      <option value="">-- Pilih --</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  ) : (
                    <input
                      type={field.includes("tanggal") ? "date" : "text"}
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form: Data Ahli Waris */}
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-sm font-bold text-white mb-4">Data Ahli Waris / Keluarga</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formFields.slice(8, 11).map((field) => (
                <div key={field}>
                  <label className="text-xs text-gray-400 block mb-1">{FIELD_LABELS[field]}</label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form: Data Biro & Jadwal */}
          <div className="rounded-xl p-4" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
            <p className="text-sm font-bold text-white mb-4">Data Biro Perjalanan & Jadwal</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formFields.slice(11).map((field) => (
                <div key={field}>
                  <label className="text-xs text-gray-400 block mb-1">{FIELD_LABELS[field]}</label>
                  <input
                    type={field.includes("tanggal") ? "date" : "text"}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-colors"
              style={{ background: "#C9A84C", color: "#000" }}
            >
              Export / Cetak
            </button>
            <button
              onClick={() => {
                setSelectedJamaahId("");
                setFormData({ ...EMPTY_FORM });
              }}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "#1a1a1a", color: "#999", border: "1px solid #2a2a2a" }}
            >
              Reset
            </button>
          </div>
        </>
      )}

      {!selectedJamaahId && (
        <div className="text-center py-12 rounded-xl" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
          <p className="text-sm text-gray-400">Pilih jamaah untuk mengisi formulir Siskopatuh.</p>
          <p className="text-xs text-gray-600 mt-1">Data akan otomatis terisi dari data jamaah yang tersimpan.</p>
        </div>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed {
            visibility: visible !important;
            position: absolute;
            left: 0;
            top: 0;
          }
          .fixed * {
            visibility: visible !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}

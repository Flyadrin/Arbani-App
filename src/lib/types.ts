// ============================================
// Arbani Tour - Management System Types
// ============================================

// === AUTH & USER ===
export type Role = 'admin' | 'karyawan';

export interface User {
  id: string;
  nama: string;
  email: string;
  password: string; // hashed in real app
  role: Role;
  telepon: string;
  jabatan: string;
  aktif: boolean;
  createdAt: string;
}

// === JAMAAH ===
export interface Jamaah {
  id: string;
  // Data Pribadi
  namaLengkap: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  golonganDarah: string;
  statusPerkawinan: string;
  pekerjaan: string;
  pendidikan: string;
  // Alamat
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  // Kontak
  telepon: string;
  email: string;
  // Dokumen
  noPaspor: string;
  masaBerlakuPaspor: string;
  tempatDikeluarkan: string;
  // Kedaruratan
  namaKeluarga: string;
  hubunganKeluarga: string;
  teleponKeluarga: string;
  // Paket & Status
  paketId: string;
  status: 'pendaftar' | 'proses' | 'lunas' | 'berangkat' | 'selesai';
  catatanKhusus: string;
  fotoUrl: string;
  createdAt: string;
  updatedAt: string;
}

// === CHECKLIST BERKAS ===
export interface ChecklistItem {
  id: string;
  jamaahId: string;
  nama: string;
  kategori: 'berkas' | 'perlengkapan';
  selesai: boolean;
  scanUrl: string; // base64 data URL from camera scan
  tanggalSelesai: string;
}

export const DEFAULT_BERKAS = [
  'KTP',
  'Kartu Keluarga',
  'Paspor',
  'Foto 4x6 (latar putih)',
  'Foto 4x6 (latar merah)',
  'Buku Nikah',
  'Akta Kelahiran',
  'Surat Mahram',
  'Bukti Vaksin Meningitis',
  'Bukti Vaksin COVID-19',
  'Surat Keterangan Sehat',
];

export const DEFAULT_PERLENGKAPAN = [
  'Koper',
  'Tas Jinjing/Cabin',
  'Ihram (Pria) / Mukena (Wanita)',
  'Sajadah',
  'Al-Quran',
  'Buku Doa & Manasik',
  'Obat-obatan Pribadi',
  'Sandal & Sepatu',
  'Perlengkapan Mandi',
];

// === KEUANGAN ===
export interface Transaksi {
  id: string;
  jamaahId: string;
  tanggal: string;
  jenis: 'dp' | 'cicilan' | 'pelunasan' | 'refund';
  jumlah: number;
  metodePembayaran: string;
  keterangan: string;
  createdBy: string; // user id
  createdAt: string;
}

export interface Kwitansi {
  id: string;
  transaksiId: string;
  nomorKwitansi: string;
  tanggal: string;
  jamaahNama: string;
  jumlah: number;
  terbilang: string;
  keterangan: string;
  syaratKetentuan: string[];
}

// === PAKET UMROH ===
export interface PaketUmroh {
  id: string;
  namaPaket: string;
  harga: number;
  durasi: string; // e.g., "9 Hari"
  tanggalBerangkat: string;
  tanggalPulang: string;
  maskapai: string;
  flightNumberBerangkat: string;
  flightNumberPulang: string;
  // Hotel
  hotelMekkah: string;
  bintangHotelMekkah: number;
  durasiMekkah: string;
  hotelMadinah: string;
  bintangHotelMadinah: number;
  durasiMadinah: string;
  // Land Arrangement
  jamPindahHotel: string;
  transportLokal: string;
  makan: string;
  ziarah: string;
  mutawif: string;
  handling: string;
  perlengkapan: string;
  catatan: string;
  status: 'draft' | 'aktif' | 'selesai';
  createdAt: string;
}

// === KALENDER & TASK ===
export interface Task {
  id: string;
  judul: string;
  deskripsi: string;
  assignedTo: string; // user/karyawan id
  deadline: string;
  prioritas: 'rendah' | 'sedang' | 'tinggi' | 'urgent';
  status: 'belum' | 'proses' | 'selesai';
  createdBy: string;
  createdAt: string;
}

// === SISKOPATUH ===
export interface SiskopatuhData {
  jamaahId: string;
  // Fields sesuai template Siskopatuh
  namaLengkap: string;
  noPaspor: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  kewarganegaraan: string;
  alamat: string;
  nomorKTP: string;
  namaAhliWaris: string;
  hubunganAhliWaris: string;
  teleponAhliWaris: string;
  namaBiroPerjalanan: string;
  nomorIzinBiro: string;
  tanggalKeberangkatan: string;
  tanggalKepulangan: string;
}

// === DOCUMENT ARCHIVE ===
export interface DocumentArchive {
  id: string;
  jamaahId: string;
  checklistItemId: string;
  namaFile: string;
  dataUrl: string; // base64 image
  tanggalScan: string;
}

// ============================================
// Arbani Tour - LocalStorage Data Store
// ============================================

import {
  User, Jamaah, ChecklistItem, Transaksi, PaketUmroh, Task,
  DocumentArchive, DEFAULT_BERKAS, DEFAULT_PERLENGKAPAN
} from './types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// === SEED DATA ===
export function seedInitialData() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('arbani_seeded')) return;

  const adminUser: User = {
    id: 'admin-001',
    nama: 'Admin Arbani',
    email: 'admin@arbani.com',
    password: 'admin123',
    role: 'admin',
    telepon: '081129064120',
    jabatan: 'Administrator',
    aktif: true,
    createdAt: new Date().toISOString(),
  };

  const karyawan: User = {
    id: 'karyawan-001',
    nama: 'Ahmad Fauzi',
    email: 'fauzi@arbani.com',
    password: 'karyawan123',
    role: 'karyawan',
    telepon: '081234567890',
    jabatan: 'Staff Operasional',
    aktif: true,
    createdAt: new Date().toISOString(),
  };

  setItem('arbani_users', [adminUser, karyawan]);
  localStorage.setItem('arbani_seeded', 'true');
}

// === USERS / KARYAWAN ===
export const userStore = {
  getAll: (): User[] => getItem<User>('arbani_users'),
  getById: (id: string): User | undefined => getItem<User>('arbani_users').find(u => u.id === id),
  getByEmail: (email: string): User | undefined => getItem<User>('arbani_users').find(u => u.email === email),
  create: (data: Omit<User, 'id' | 'createdAt'>): User => {
    const users = getItem<User>('arbani_users');
    const user: User = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    users.push(user);
    setItem('arbani_users', users);
    return user;
  },
  update: (id: string, data: Partial<User>): User | null => {
    const users = getItem<User>('arbani_users');
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    setItem('arbani_users', users);
    return users[idx];
  },
  delete: (id: string): void => {
    const users = getItem<User>('arbani_users').filter(u => u.id !== id);
    setItem('arbani_users', users);
  },
};

// === JAMAAH ===
export const jamaahStore = {
  getAll: (): Jamaah[] => getItem<Jamaah>('arbani_jamaah'),
  getById: (id: string): Jamaah | undefined => getItem<Jamaah>('arbani_jamaah').find(j => j.id === id),
  getByPaket: (paketId: string): Jamaah[] => getItem<Jamaah>('arbani_jamaah').filter(j => j.paketId === paketId),
  create: (data: Omit<Jamaah, 'id' | 'createdAt' | 'updatedAt'>): Jamaah => {
    const items = getItem<Jamaah>('arbani_jamaah');
    const now = new Date().toISOString();
    const jamaah: Jamaah = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    items.push(jamaah);
    setItem('arbani_jamaah', items);
    // Auto-create checklist items
    checklistStore.initForJamaah(jamaah.id);
    return jamaah;
  },
  update: (id: string, data: Partial<Jamaah>): Jamaah | null => {
    const items = getItem<Jamaah>('arbani_jamaah');
    const idx = items.findIndex(j => j.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    setItem('arbani_jamaah', items);
    return items[idx];
  },
  delete: (id: string): void => {
    setItem('arbani_jamaah', getItem<Jamaah>('arbani_jamaah').filter(j => j.id !== id));
    // Clean up related data
    setItem('arbani_checklist', getItem<ChecklistItem>('arbani_checklist').filter(c => c.jamaahId !== id));
    setItem('arbani_transaksi', getItem<Transaksi>('arbani_transaksi').filter(t => t.jamaahId !== id));
    setItem('arbani_documents', getItem<DocumentArchive>('arbani_documents').filter(d => d.jamaahId !== id));
  },
};

// === CHECKLIST ===
export const checklistStore = {
  getByJamaah: (jamaahId: string): ChecklistItem[] =>
    getItem<ChecklistItem>('arbani_checklist').filter(c => c.jamaahId === jamaahId),
  initForJamaah: (jamaahId: string): void => {
    const existing = getItem<ChecklistItem>('arbani_checklist');
    const alreadyExists = existing.some(c => c.jamaahId === jamaahId);
    if (alreadyExists) return;

    const items: ChecklistItem[] = [
      ...DEFAULT_BERKAS.map(nama => ({
        id: generateId(),
        jamaahId,
        nama,
        kategori: 'berkas' as const,
        selesai: false,
        scanUrl: '',
        tanggalSelesai: '',
      })),
      ...DEFAULT_PERLENGKAPAN.map(nama => ({
        id: generateId(),
        jamaahId,
        nama,
        kategori: 'perlengkapan' as const,
        selesai: false,
        scanUrl: '',
        tanggalSelesai: '',
      })),
    ];
    setItem('arbani_checklist', [...existing, ...items]);
  },
  toggle: (id: string, scanUrl?: string): ChecklistItem | null => {
    const items = getItem<ChecklistItem>('arbani_checklist');
    const idx = items.findIndex(c => c.id === id);
    if (idx === -1) return null;
    items[idx].selesai = !items[idx].selesai;
    items[idx].tanggalSelesai = items[idx].selesai ? new Date().toISOString() : '';
    if (scanUrl) items[idx].scanUrl = scanUrl;
    setItem('arbani_checklist', items);
    return items[idx];
  },
  update: (id: string, data: Partial<ChecklistItem>): void => {
    const items = getItem<ChecklistItem>('arbani_checklist');
    const idx = items.findIndex(c => c.id === id);
    if (idx === -1) return;
    items[idx] = { ...items[idx], ...data };
    setItem('arbani_checklist', items);
  },
};

// === TRANSAKSI / KEUANGAN ===
export const transaksiStore = {
  getAll: (): Transaksi[] => getItem<Transaksi>('arbani_transaksi'),
  getByJamaah: (jamaahId: string): Transaksi[] =>
    getItem<Transaksi>('arbani_transaksi').filter(t => t.jamaahId === jamaahId),
  create: (data: Omit<Transaksi, 'id' | 'createdAt'>): Transaksi => {
    const items = getItem<Transaksi>('arbani_transaksi');
    const trx: Transaksi = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    items.push(trx);
    setItem('arbani_transaksi', items);
    return trx;
  },
  delete: (id: string): void => {
    setItem('arbani_transaksi', getItem<Transaksi>('arbani_transaksi').filter(t => t.id !== id));
  },
  getTotalByJamaah: (jamaahId: string): number => {
    return getItem<Transaksi>('arbani_transaksi')
      .filter(t => t.jamaahId === jamaahId)
      .reduce((sum, t) => t.jenis === 'refund' ? sum - t.jumlah : sum + t.jumlah, 0);
  },
};

// === PAKET UMROH ===
export const paketStore = {
  getAll: (): PaketUmroh[] => getItem<PaketUmroh>('arbani_paket'),
  getById: (id: string): PaketUmroh | undefined => getItem<PaketUmroh>('arbani_paket').find(p => p.id === id),
  create: (data: Omit<PaketUmroh, 'id' | 'createdAt'>): PaketUmroh => {
    const items = getItem<PaketUmroh>('arbani_paket');
    const paket: PaketUmroh = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    items.push(paket);
    setItem('arbani_paket', items);
    return paket;
  },
  update: (id: string, data: Partial<PaketUmroh>): PaketUmroh | null => {
    const items = getItem<PaketUmroh>('arbani_paket');
    const idx = items.findIndex(p => p.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    setItem('arbani_paket', items);
    return items[idx];
  },
  delete: (id: string): void => {
    setItem('arbani_paket', getItem<PaketUmroh>('arbani_paket').filter(p => p.id !== id));
  },
};

// === TASK / KALENDER ===
export const taskStore = {
  getAll: (): Task[] => getItem<Task>('arbani_tasks'),
  getByUser: (userId: string): Task[] =>
    getItem<Task>('arbani_tasks').filter(t => t.assignedTo === userId),
  getByDate: (date: string): Task[] =>
    getItem<Task>('arbani_tasks').filter(t => t.deadline.startsWith(date)),
  create: (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    const items = getItem<Task>('arbani_tasks');
    const task: Task = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    items.push(task);
    setItem('arbani_tasks', items);
    return task;
  },
  update: (id: string, data: Partial<Task>): Task | null => {
    const items = getItem<Task>('arbani_tasks');
    const idx = items.findIndex(t => t.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    setItem('arbani_tasks', items);
    return items[idx];
  },
  delete: (id: string): void => {
    setItem('arbani_tasks', getItem<Task>('arbani_tasks').filter(t => t.id !== id));
  },
};

// === DOCUMENT ARCHIVE ===
export const documentStore = {
  getByJamaah: (jamaahId: string): DocumentArchive[] =>
    getItem<DocumentArchive>('arbani_documents').filter(d => d.jamaahId === jamaahId),
  create: (data: Omit<DocumentArchive, 'id' | 'tanggalScan'>): DocumentArchive => {
    const items = getItem<DocumentArchive>('arbani_documents');
    const doc: DocumentArchive = { ...data, id: generateId(), tanggalScan: new Date().toISOString() };
    items.push(doc);
    setItem('arbani_documents', items);
    return doc;
  },
  delete: (id: string): void => {
    setItem('arbani_documents', getItem<DocumentArchive>('arbani_documents').filter(d => d.id !== id));
  },
};

// === UTILITY ===
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function terbilang(n: number): string {
  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (n < 12) return satuan[n];
  if (n < 20) return satuan[n - 10] + ' Belas';
  if (n < 100) return satuan[Math.floor(n / 10)] + ' Puluh' + (n % 10 ? ' ' + satuan[n % 10] : '');
  if (n < 200) return 'Seratus' + (n % 100 ? ' ' + terbilang(n % 100) : '');
  if (n < 1000) return satuan[Math.floor(n / 100)] + ' Ratus' + (n % 100 ? ' ' + terbilang(n % 100) : '');
  if (n < 2000) return 'Seribu' + (n % 1000 ? ' ' + terbilang(n % 1000) : '');
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + ' Ribu' + (n % 1000 ? ' ' + terbilang(n % 1000) : '');
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + ' Juta' + (n % 1000000 ? ' ' + terbilang(n % 1000000) : '');
  return terbilang(Math.floor(n / 1000000000)) + ' Miliar' + (n % 1000000000 ? ' ' + terbilang(n % 1000000000) : '');
}

export function generateNomorKwitansi(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(getItem<Transaksi>('arbani_transaksi').length + 1).padStart(4, '0');
  return `ARB/${y}${m}/${seq}`;
}

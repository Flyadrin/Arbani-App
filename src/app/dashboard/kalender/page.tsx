"use client";

import { useState, useEffect } from "react";
import { taskStore, userStore } from "@/lib/store";
import { Task, User } from "@/lib/types";
import { useAuth } from "@/lib/auth";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const PRIORITAS_COLORS: Record<string, string> = {
  rendah: "#607D8B",
  sedang: "#FF9800",
  tinggi: "#f44336",
  urgent: "#d32f2f",
};

const STATUS_COLORS: Record<string, string> = {
  belum: "#FF9800",
  proses: "#2196F3",
  selesai: "#4CAF50",
};

function formatDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const days: { date: string; day: number; current: boolean }[] = [];

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    days.push({ date: formatDateStr(py, pm, d), day: d, current: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: formatDateStr(year, month, d), day: d, current: true });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    days.push({ date: formatDateStr(ny, nm, d), day: d, current: false });
  }

  return days;
}

const emptyForm = {
  judul: "",
  deskripsi: "",
  assignedTo: "",
  deadline: "",
  prioritas: "sedang" as Task["prioritas"],
  status: "belum" as Task["status"],
};

export default function KalenderPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterUser, setFilterUser] = useState("");
  const [filterPrioritas, setFilterPrioritas] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const reload = () => {
    setTasks(taskStore.getAll());
    setUsers(userStore.getAll().filter((u) => u.aktif));
  };

  useEffect(() => {
    reload();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterUser && t.assignedTo !== filterUser) return false;
    if (filterPrioritas && t.prioritas !== filterPrioritas) return false;
    return true;
  });

  // Tasks grouped by date for calendar dots
  const tasksByDate: Record<string, Task[]> = {};
  filteredTasks.forEach((t) => {
    if (!tasksByDate[t.deadline]) tasksByDate[t.deadline] = [];
    tasksByDate[t.deadline].push(t);
  });

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const selectedTasks = filteredTasks
    .filter((t) => t.deadline === selectedDate)
    .sort((a, b) => {
      const pOrder = { urgent: 0, tinggi: 1, sedang: 2, rendah: 3 };
      return pOrder[a.prioritas] - pOrder[b.prioritas];
    });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(now.toISOString().split("T")[0]);
  };

  const openAdd = (date?: string) => {
    setEditingTask(null);
    setForm({ ...emptyForm, deadline: date || selectedDate });
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      judul: task.judul,
      deskripsi: task.deskripsi,
      assignedTo: task.assignedTo,
      deadline: task.deadline,
      prioritas: task.prioritas,
      status: task.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.judul.trim() || !form.deadline || !user) return;
    if (editingTask) {
      taskStore.update(editingTask.id, form);
    } else {
      taskStore.create({ ...form, createdBy: user.id });
    }
    reload();
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    taskStore.delete(id);
    reload();
    setDeleteConfirm(null);
  };

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.nama || "\u2014";

  const isOverdue = (t: Task) => t.deadline < today && t.status !== "selesai";

  // Unique priority dots for a date (max 4)
  const getDotsForDate = (date: string) => {
    const dateTasks = tasksByDate[date] || [];
    const priorities = [...new Set(dateTasks.map((t) => t.prioritas))];
    return priorities.slice(0, 4);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Kalender & Tugas</h2>
          <p className="text-xs text-gray-500">
            Kelola jadwal dan tugas karyawan
          </p>
        </div>
        <button
          onClick={() => openAdd()}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 self-start"
          style={{
            background: "linear-gradient(135deg, #A07830, #C9A84C)",
            color: "#0A0A0A",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Tugas
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg outline-none"
          style={{
            background: "#141414",
            border: "1px solid #242424",
            color: "#ccc",
          }}
        >
          <option value="">Semua Karyawan</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nama}
            </option>
          ))}
        </select>
        <select
          value={filterPrioritas}
          onChange={(e) => setFilterPrioritas(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg outline-none"
          style={{
            background: "#141414",
            border: "1px solid #242424",
            color: "#ccc",
          }}
        >
          <option value="">Semua Prioritas</option>
          <option value="rendah">Rendah</option>
          <option value="sedang">Sedang</option>
          <option value="tinggi">Tinggi</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          onClick={goToday}
          className="text-xs px-3 py-2 rounded-lg transition-colors"
          style={{
            background: "rgba(201,168,76,0.1)",
            color: "#C9A84C",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          Hari Ini
        </button>
      </div>

      {/* Calendar */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#141414", border: "1px solid #1e1e1e" }}
      >
        {/* Month nav */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h3 className="text-sm font-bold text-white">
            {BULAN[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 px-2">
          {HARI.map((h) => (
            <div
              key={h}
              className="text-center text-[10px] font-semibold py-1"
              style={{ color: "#666" }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 px-2 pb-2">
          {calendarDays.map((d, i) => {
            const isToday = d.date === today;
            const isSelected = d.date === selectedDate;
            const dots = getDotsForDate(d.date);
            const hasOverdue = (tasksByDate[d.date] || []).some((t) =>
              isOverdue(t)
            );

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(d.date)}
                className="relative flex flex-col items-center py-1.5 rounded-lg transition-colors"
                style={{
                  background: isSelected
                    ? "rgba(201,168,76,0.15)"
                    : "transparent",
                  opacity: d.current ? 1 : 0.3,
                }}
              >
                <span
                  className="text-xs font-medium w-7 h-7 flex items-center justify-center rounded-full"
                  style={{
                    background: isToday
                      ? "linear-gradient(135deg, #A07830, #C9A84C)"
                      : "transparent",
                    color: isToday
                      ? "#0A0A0A"
                      : isSelected
                      ? "#C9A84C"
                      : "#aaa",
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {d.day}
                </span>
                {/* Priority dots */}
                {dots.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dots.map((p, j) => (
                      <div
                        key={j}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: PRIORITAS_COLORS[p] }}
                      />
                    ))}
                  </div>
                )}
                {/* Overdue indicator */}
                {hasOverdue && d.current && (
                  <div
                    className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: "#f44336" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(PRIORITAS_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
            />
            <span className="text-[10px] text-gray-500 capitalize">{key}</span>
          </div>
        ))}
      </div>

      {/* Selected date tasks */}
      <div
        className="rounded-xl p-4"
        style={{ background: "#141414", border: "1px solid #1e1e1e" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-white">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-[10px] text-gray-500">
              {selectedTasks.length} tugas
            </p>
          </div>
          <button
            onClick={() => openAdd(selectedDate)}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: "rgba(201,168,76,0.1)",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            + Tugas
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-xs">
              Tidak ada tugas pada tanggal ini
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg transition-colors"
                style={{
                  background: isOverdue(t) ? "rgba(244,67,54,0.06)" : "#1a1a1a",
                  border: isOverdue(t)
                    ? "1px solid rgba(244,67,54,0.2)"
                    : "1px solid #242424",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Priority bar */}
                  <div
                    className="w-1 h-10 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: PRIORITAS_COLORS[t.prioritas] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{
                          color: isOverdue(t) ? "#f44336" : "#fff",
                        }}
                      >
                        {t.judul}
                      </p>
                      {isOverdue(t) && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: "rgba(244,67,54,0.15)",
                            color: "#f44336",
                          }}
                        >
                          Terlambat
                        </span>
                      )}
                    </div>
                    {t.deskripsi && (
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                        {t.deskripsi}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/* Status badge */}
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background: `${STATUS_COLORS[t.status]}20`,
                          color: STATUS_COLORS[t.status],
                        }}
                      >
                        {t.status}
                      </span>
                      {/* Prioritas badge */}
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background: `${PRIORITAS_COLORS[t.prioritas]}20`,
                          color: PRIORITAS_COLORS[t.prioritas],
                        }}
                      >
                        {t.prioritas}
                      </span>
                      {/* Assigned */}
                      <span className="text-[10px] text-gray-500">
                        {getUserName(t.assignedTo)}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-[#C9A84C]"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {deleteConfirm === t.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(t.id)}
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
                        onClick={() => setDeleteConfirm(t.id)}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-red-400"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Tugas",
            value: filteredTasks.length,
            color: "#C9A84C",
          },
          {
            label: "Belum Dikerjakan",
            value: filteredTasks.filter((t) => t.status === "belum").length,
            color: "#FF9800",
          },
          {
            label: "Sedang Proses",
            value: filteredTasks.filter((t) => t.status === "proses").length,
            color: "#2196F3",
          },
          {
            label: "Terlambat",
            value: filteredTasks.filter((t) => isOverdue(t)).length,
            color: "#f44336",
          },
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
                {editingTask ? "Edit Tugas" : "Tambah Tugas Baru"}
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
              {/* Judul */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Judul *
                </label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) =>
                    setForm({ ...form, judul: e.target.value })
                  }
                  placeholder="Judul tugas..."
                  className="w-full text-xs px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #242424",
                    color: "#fff",
                  }}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  placeholder="Deskripsi tugas..."
                  rows={3}
                  className="w-full text-xs px-3 py-2.5 rounded-lg outline-none resize-none focus:ring-1 focus:ring-[#C9A84C]"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #242424",
                    color: "#fff",
                  }}
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Ditugaskan Kepada
                </label>
                <select
                  value={form.assignedTo}
                  onChange={(e) =>
                    setForm({ ...form, assignedTo: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #242424",
                    color: "#fff",
                  }}
                >
                  <option value="">Pilih karyawan...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama} — {u.jabatan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #242424",
                    color: "#fff",
                    colorScheme: "dark",
                  }}
                />
              </div>

              {/* Prioritas & Status row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">
                    Prioritas
                  </label>
                  <select
                    value={form.prioritas}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        prioritas: e.target.value as Task["prioritas"],
                      })
                    }
                    className="w-full text-xs px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#C9A84C]"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #242424",
                      color: "#fff",
                    }}
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as Task["status"],
                      })
                    }
                    className="w-full text-xs px-3 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-[#C9A84C]"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #242424",
                      color: "#fff",
                    }}
                  >
                    <option value="belum">Belum</option>
                    <option value="proses">Proses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
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
                disabled={!form.judul.trim() || !form.deadline}
                className="flex-1 text-xs py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #A07830, #C9A84C)",
                  color: "#0A0A0A",
                }}
              >
                {editingTask ? "Simpan Perubahan" : "Tambah Tugas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

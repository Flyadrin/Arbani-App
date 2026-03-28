"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { jamaahStore, checklistStore, documentStore } from "@/lib/store";
import { Jamaah, ChecklistItem, DocumentArchive } from "@/lib/types";

type ScanStep = "select" | "camera" | "preview" | "success";

export default function ScannerPage() {
  // === State ===
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [selectedJamaahId, setSelectedJamaahId] = useState("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [documents, setDocuments] = useState<DocumentArchive[]>([]);
  const [step, setStep] = useState<ScanStep>("select");
  const [capturedImage, setCapturedImage] = useState("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);

  // === Refs ===
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // === Load jamaah list ===
  useEffect(() => {
    setJamaahList(jamaahStore.getAll());
  }, []);

  // === Load checklist & documents when jamaah selected ===
  useEffect(() => {
    if (!selectedJamaahId) {
      setChecklistItems([]);
      setDocuments([]);
      setSelectedItemId("");
      return;
    }
    const items = checklistStore.getByJamaah(selectedJamaahId);
    setChecklistItems(items);
    setDocuments(documentStore.getByJamaah(selectedJamaahId));
    setSelectedItemId("");
  }, [selectedJamaahId]);

  // === Derived data ===
  const uncheckedBerkas = checklistItems.filter(
    (item) => item.kategori === "berkas" && !item.selesai
  );
  const scannedBerkas = checklistItems.filter(
    (item) => item.kategori === "berkas" && item.selesai && item.scanUrl
  );
  const selectedJamaah = jamaahList.find((j) => j.id === selectedJamaahId);
  const selectedItem = checklistItems.find((item) => item.id === selectedItemId);

  // === Camera management ===
  const startCamera = useCallback(async () => {
    setCameraError("");
    setIsCameraReady(false);

    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setCameraError("Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.");
        } else if (err.name === "NotFoundError") {
          setCameraError("Kamera tidak ditemukan pada perangkat ini.");
        } else {
          setCameraError(`Gagal mengakses kamera: ${err.message}`);
        }
      } else {
        setCameraError("Gagal mengakses kamera. Pastikan perangkat memiliki kamera.");
      }
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  // Start camera when entering camera step
  useEffect(() => {
    if (step === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step, startCamera, stopCamera]);

  // Restart camera when facing mode changes (only if already in camera step)
  useEffect(() => {
    if (step === "camera") {
      startCamera();
    }
  }, [facingMode, startCamera, step]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // === Capture photo ===
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    setCapturedImage(dataUrl);
    setStep("preview");
  }, []);

  // === Save scanned document ===
  const handleSave = useCallback(() => {
    if (!selectedItemId || !capturedImage || !selectedJamaahId) return;

    // Mark checklist item as done with scan URL
    checklistStore.toggle(selectedItemId, capturedImage);

    // Create document archive entry
    const item = checklistItems.find((c) => c.id === selectedItemId);
    documentStore.create({
      jamaahId: selectedJamaahId,
      checklistItemId: selectedItemId,
      namaFile: item ? `${item.nama} - ${selectedJamaah?.namaLengkap || ""}` : "Scan",
      dataUrl: capturedImage,
    });

    // Refresh data
    const updatedChecklist = checklistStore.getByJamaah(selectedJamaahId);
    setChecklistItems(updatedChecklist);
    setDocuments(documentStore.getByJamaah(selectedJamaahId));

    setSuccessMessage(`Dokumen "${item?.nama}" berhasil disimpan!`);
    setCapturedImage("");
    setSelectedItemId("");
    setStep("success");

    // Auto dismiss success after 2 seconds
    setTimeout(() => {
      setSuccessMessage("");
      setStep("select");
    }, 2000);
  }, [selectedItemId, capturedImage, selectedJamaahId, checklistItems, selectedJamaah]);

  // === Retake photo ===
  const handleRetake = useCallback(() => {
    setCapturedImage("");
    setStep("camera");
  }, []);

  // === Switch camera ===
  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }, []);

  // === Start scanning ===
  const handleStartScan = () => {
    if (!selectedItemId) return;
    setStep("camera");
  };

  // === Cancel and go back ===
  const handleCancel = () => {
    setCapturedImage("");
    setCameraError("");
    setStep("select");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Scanner Dokumen</h1>
          <p className="text-xs text-neutral-400">Scan & arsip berkas jamaah</p>
        </div>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="bg-green-900/40 border border-green-700/50 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-300 text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* === STEP: SELECT === */}
      {step === "select" && (
        <div className="space-y-4">
          {/* Select Jamaah */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium text-neutral-300">Pilih Jamaah</label>
            <select
              value={selectedJamaahId}
              onChange={(e) => setSelectedJamaahId(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
            >
              <option value="">-- Pilih Jamaah --</option>
              {jamaahList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.namaLengkap}
                </option>
              ))}
            </select>
          </div>

          {/* Select Document to Scan */}
          {selectedJamaahId && (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4 space-y-3">
              <label className="text-sm font-medium text-neutral-300">
                Berkas Belum Discan ({uncheckedBerkas.length})
              </label>
              {uncheckedBerkas.length === 0 ? (
                <p className="text-xs text-neutral-500 py-2">
                  Semua berkas sudah discan.
                </p>
              ) : (
                <div className="space-y-2">
                  {uncheckedBerkas.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        selectedItemId === item.id
                          ? "bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]"
                          : "bg-[#0A0A0A] border-[#1e1e1e] text-neutral-300 hover:border-[#C9A84C]/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {item.nama}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Start Scan Button */}
              {selectedItemId && (
                <button
                  onClick={handleStartScan}
                  className="w-full mt-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Scan &quot;{selectedItem?.nama}&quot;
                </button>
              )}
            </div>
          )}

          {/* Already Scanned Documents */}
          {selectedJamaahId && scannedBerkas.length > 0 && (
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4 space-y-3">
              <label className="text-sm font-medium text-neutral-300">
                Dokumen Terscan ({scannedBerkas.length})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {scannedBerkas.map((item) => {
                  const doc = documents.find((d) => d.checklistItemId === item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#0A0A0A] border border-[#1e1e1e] rounded-lg overflow-hidden"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-neutral-900 relative">
                        {(doc?.dataUrl || item.scanUrl) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={doc?.dataUrl || item.scanUrl}
                            alt={item.nama}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-1 right-1 bg-green-600/80 rounded-full p-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-neutral-300 font-medium truncate">{item.nama}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {item.tanggalSelesai
                            ? new Date(item.tanggalSelesai).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === STEP: CAMERA === */}
      {step === "camera" && (
        <div className="space-y-3">
          {/* Scanning target info */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Scanning untuk</p>
              <p className="text-sm font-semibold text-[#C9A84C]">{selectedItem?.nama}</p>
              <p className="text-xs text-neutral-500">{selectedJamaah?.namaLengkap}</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-neutral-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Camera Viewfinder */}
          {cameraError ? (
            <div className="bg-[#141414] border border-red-900/50 rounded-xl p-6 text-center space-y-3">
              <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <p className="text-sm text-red-300">{cameraError}</p>
              <button
                onClick={() => startCamera()}
                className="text-sm text-[#C9A84C] hover:underline"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-black">
              {/* Video element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[3/4] object-cover"
              />

              {/* Scan frame overlay */}
              {isCameraReady && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner markers */}
                  <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#C9A84C] rounded-tl-lg" />
                  <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[#C9A84C] rounded-tr-lg" />
                  <div className="absolute bottom-20 left-6 w-10 h-10 border-b-2 border-l-2 border-[#C9A84C] rounded-bl-lg" />
                  <div className="absolute bottom-20 right-6 w-10 h-10 border-b-2 border-r-2 border-[#C9A84C] rounded-br-lg" />
                  {/* Hint */}
                  <div className="absolute top-3 inset-x-0 text-center">
                    <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      Posisikan dokumen dalam bingkai
                    </span>
                  </div>
                </div>
              )}

              {/* Loading overlay */}
              {!isCameraReady && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-neutral-400">Memuat kamera...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Camera Controls */}
          <div className="flex items-center justify-center gap-6 py-2">
            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="w-12 h-12 rounded-full bg-[#141414] border border-[#1e1e1e] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Capture */}
            <button
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className="w-16 h-16 rounded-full bg-[#C9A84C] hover:bg-[#b8963f] disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg shadow-[#C9A84C]/20"
            >
              <div className="w-12 h-12 rounded-full border-2 border-black/30" />
            </button>

            {/* Switch Camera */}
            <button
              onClick={toggleCamera}
              className="w-12 h-12 rounded-full bg-[#141414] border border-[#1e1e1e] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* === STEP: PREVIEW === */}
      {step === "preview" && (
        <div className="space-y-3">
          {/* Preview info */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl px-4 py-3">
            <p className="text-xs text-neutral-400">Preview Scan</p>
            <p className="text-sm font-semibold text-[#C9A84C]">{selectedItem?.nama}</p>
            <p className="text-xs text-neutral-500">{selectedJamaah?.namaLengkap}</p>
          </div>

          {/* Image Preview */}
          <div className="rounded-xl overflow-hidden bg-black">
            {capturedImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={capturedImage}
                alt="Hasil scan"
                className="w-full aspect-[3/4] object-cover"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRetake}
              className="bg-[#141414] border border-[#1e1e1e] hover:border-neutral-600 text-neutral-300 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Ulang
            </button>
            <button
              onClick={handleSave}
              className="bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* === STEP: SUCCESS === */}
      {step === "success" && (
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold">Berhasil Disimpan!</p>
            <p className="text-sm text-neutral-400 mt-1">{successMessage}</p>
          </div>
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500">Kembali ke halaman scan...</p>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

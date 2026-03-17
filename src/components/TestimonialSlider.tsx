"use client";

const testimonials = [
  {
    name: "Siti Rahayu",
    rating: 5,
    date: "3 bulan lalu",
    text: "Alhamdulillah, perjalanan umroh bersama Arbani Tour sangat memuaskan. Pembimbing ibadah yang berpengalaman, hotel dekat Masjidil Haram, dan pelayanan yang sangat ramah. Highly recommended!",
    avatar: "SR",
  },
  {
    name: "Ahmad Fauzi",
    rating: 5,
    date: "5 bulan lalu",
    text: "Masya Allah, Arbani Tour benar-benar amanah. Semua fasilitas sesuai yang dijanjikan. Proses pendaftaran mudah dan tim sangat responsif menjawab pertanyaan kami. Jazakumullahu khairan.",
    avatar: "AF",
  },
  {
    name: "Dewi Kurniasari",
    rating: 5,
    date: "1 bulan lalu",
    text: "Alhamdulillah sudah 2x umroh bersama Arbani Tour dan selalu puas. Manasik umroh yang komprehensif, pembimbing sabar, dan akomodasi bintang 5. Insya Allah akan umroh lagi bersama Arbani!",
    avatar: "DK",
  },
  {
    name: "Haji Mahmud",
    rating: 5,
    date: "2 bulan lalu",
    text: "Pak Bayu dan tim Arbani Tour sangat profesional. Dari berangkat sampai pulang, semua terorganisir dengan baik. Tidak ada kendala sama sekali. Terima kasih Arbani Tour!",
    avatar: "HM",
  },
  {
    name: "Fatimah Azzahra",
    rating: 5,
    date: "4 bulan lalu",
    text: "Paket umroh plus yang ditawarkan Arbani Tour sangat worth it. Hotel strategis, makanan halal terjamin, dan guide sangat berpengetahuan tentang sejarah Islam. Pengalaman spiritual yang luar biasa!",
    avatar: "FA",
  },
  {
    name: "Budi Santoso",
    rating: 5,
    date: "6 bulan lalu",
    text: "Untuk keluarga kami yang pertama kali umroh, Arbani Tour adalah pilihan terbaik. Mereka sangat sabar menjelaskan semua prosedur. Anak-anak kami pun merasa nyaman sepanjang perjalanan.",
    avatar: "BS",
  },
  {
    name: "Nur Hidayah",
    rating: 5,
    date: "2 minggu lalu",
    text: "Baru pulang umroh bersama Arbani Tour. Subhanallah, pengalaman yang tak terlupakan! Terima kasih pak Bayu dan seluruh tim yang sudah membimbing kami dengan penuh keikhlasan.",
    avatar: "NH",
  },
  {
    name: "Suprapto Wijaya",
    rating: 5,
    date: "7 bulan lalu",
    text: "Arbani Tour sudah terpercaya sejak lama di Semarang. Kami sekeluarga sangat puas dengan pelayanan mereka. Harga terjangkau namun fasilitas premium. Semoga Arbani Tour terus berkembang!",
    avatar: "SW",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-[#C9A84C]" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialSlider() {
  // Duplicate for seamless loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className="py-5 overflow-hidden" style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #111108 100%)" }}>
      <div className="px-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Testimoni Jamaah</p>
          <p className="text-[10px] text-gray-500 mt-0.5">⭐ 4.9/5 dari Google Maps</p>
        </div>
        <span
          className="text-[10px] px-2 py-1 rounded-full font-semibold"
          style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          {testimonials.length} ulasan
        </span>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0A0A0A, transparent)" }}
        />

        <div className="testimonial-track">
          {doubled.map((t, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-72 mx-3 rounded-2xl p-5"
              style={{
                background: "#141414",
                border: "1px solid #242424",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0A0A0A" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.date}</p>
                </div>
                <div className="ml-auto">
                  <svg viewBox="0 0 48 48" className="w-6 h-6">
                    <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                    <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/>
                    <path fill="#FBBC05" d="M24 46c5.8 0 10.8-1.9 14.8-5.2l-6.8-5.6C29.9 36.7 27.1 38 24 38c-6.1 0-10.7-3.1-11.8-7.6L5 35.9C8.6 42.4 15.7 46 24 46z"/>
                    <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1.1 3-3.7 5.4-7 6.7l6.8 5.6C40.5 37.3 44 31.1 44 24c0-1.3-.2-2.7-.5-4z"/>
                  </svg>
                </div>
              </div>
              <StarRating rating={t.rating} />
              <p className="text-sm text-gray-300 mt-3 leading-relaxed line-clamp-4">
                &quot;{t.text}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

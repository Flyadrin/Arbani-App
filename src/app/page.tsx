import Image from "next/image";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import TestimonialSlider from "@/components/TestimonialSlider";

const menuItems = [
  {
    href: "/paket-umroh",
    title: "Paket Umroh",
    subtitle: "Pilih paket terbaik\nuntuk ibadah umroh",
    emoji: "🕌",
    badge: "4 Paket",
    bg: "linear-gradient(135deg, #1a1400 0%, #0f0f00 100%)",
  },
  {
    href: "/paket-haji",
    title: "Paket Haji",
    subtitle: "Haji khusus &\nfuroda tersedia",
    emoji: "🌙",
    badge: "3 Paket",
    bg: "linear-gradient(135deg, #1a1000 0%, #100e00 100%)",
  },
  {
    href: "/doa-umroh",
    title: "Doa Umroh",
    subtitle: "Panduan doa\nlengkap & terjemah",
    emoji: "📖",
    badge: "7 Kategori",
    bg: "linear-gradient(135deg, #0f1600 0%, #0a1000 100%)",
  },
];

const stats = [
  { value: "15+", label: "Tahun" },
  { value: "5000+", label: "Jamaah" },
  { value: "4.9★", label: "Google" },
  { value: "100%", label: "On Time" },
];

export default function Home() {
  return (
    <AppShell>
      {/* Hero */}
      <div className="relative px-4 md:px-8 lg:px-12 pt-5 pb-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.13) 0%, transparent 70%)",
          }}
        />
        {/* Profile row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs md:text-sm text-gray-500 mb-0.5">Selamat datang di</p>
            <h1
              className="text-xl md:text-3xl font-black tracking-wide"
              style={{
                fontFamily: "var(--font-cinzel)",
                background: "linear-gradient(135deg, #A07830, #C9A84C, #E8C96D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ARBANI TOUR
            </h1>
            <p className="text-xs md:text-sm text-gray-500 tracking-widest">Biro Terpercaya Zona Nyaman</p>
          </div>
          <Link href="/login" className="tap-target">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #A07830, #C9A84C)",
                boxShadow: "0 4px 12px rgba(201,168,76,0.3)",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A0A0A">
                <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4 0-6 2-6 3v1h12v-1c0-1-2-3-6-3z" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Hero banner */}
        <div
          className="rounded-3xl p-5 md:p-8 mb-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1200 0%, #0d0d00 100%)",
            border: "1px solid rgba(201,168,76,0.25)",
            boxShadow: "0 8px 32px rgba(201,168,76,0.1)",
          }}
        >
          <div
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 opacity-20"
            style={{ fontSize: "80px", lineHeight: 1 }}
          >
            🕌
          </div>
          <p className="text-xs md:text-sm tracking-widest uppercase mb-1.5" style={{ color: "#C9A84C" }}>
            Bismillahirrahmanirrahim
          </p>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-1.5 leading-snug">
            Wujudkan Perjalanan<br />
            <span style={{ color: "#C9A84C" }}>Ibadah Impian Anda</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 max-w-[300px]">
            Umroh & haji nyaman, amanah, dan berkesan bersama Arbani Tour.
          </p>
          <div className="flex gap-2">
            <Link
              href="/paket-umroh"
              className="tap-target px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #A07830, #C9A84C)",
                color: "#0A0A0A",
              }}
            >
              Lihat Paket
            </Link>
            <a
              href="https://wa.me/6281129064120"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold border"
              style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C" }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-5">
          {stats.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl py-3 md:py-4 text-center"
              style={{ background: "#141414", border: "1px solid #1e1e1e" }}
            >
              <p
                className="text-sm md:text-lg font-black"
                style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
              >
                {s.value}
              </p>
              <p className="text-[9px] md:text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu section */}
      <div className="px-4 md:px-8 lg:px-12 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm md:text-base font-bold text-white">Layanan Kami</p>
          <span className="text-xs text-gray-500">Pilih kategori</span>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-hover flex items-center gap-4 rounded-2xl px-4 py-4 md:flex-1"
              style={{ background: item.bg, border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(201,168,76,0.1)" }}
              >
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm md:text-base text-white">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed whitespace-pre-line">
                  {item.subtitle}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: "rgba(201,168,76,0.15)",
                    color: "#C9A84C",
                  }}
                >
                  {item.badge}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="#555" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div className="px-4 md:px-8 lg:px-12 mb-4">
        <p className="text-sm md:text-base font-bold text-white mb-3">Mengapa Arbani Tour?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {[
            { icon: "🤝", title: "Amanah & Resmi", desc: "Terdaftar Kemenag RI" },
            { icon: "✈️", title: "Tepat Waktu", desc: "Keberangkatan terjamin" },
            { icon: "🏨", title: "Hotel Premium", desc: "Dekat Masjidil Haram" },
            { icon: "📚", title: "Bimbingan Ibadah", desc: "Ustadz bersertifikat" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl px-3 py-3.5 flex items-center gap-3"
              style={{ background: "#141414", border: "1px solid #1e1e1e" }}
            >
              <span className="text-xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{f.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialSlider />

      {/* Contact CTA */}
      <div className="px-4 md:px-8 lg:px-12 pb-6">
        <div
          className="rounded-3xl p-5 md:p-8"
          style={{
            background: "linear-gradient(135deg, #1a1200, #141414)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <p className="text-sm md:text-lg font-bold text-white mb-1">Siap Berangkat? 🤲</p>
          <p className="text-xs md:text-sm text-gray-400 mb-4 leading-relaxed">
            Konsultasi gratis dengan tim kami. Tersedia setiap hari.
          </p>
          <div className="flex gap-2 md:max-w-md">
            <a
              href="https://wa.me/6281129064120"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target flex-1 py-3 rounded-2xl text-xs md:text-sm font-bold text-center flex items-center justify-center gap-1.5"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:0247601577"
              className="tap-target flex-1 py-3 rounded-2xl text-xs md:text-sm font-bold text-center border"
              style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C" }}
            >
              📞 Telepon
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-8 pb-4 text-center">
        <Image src="/logo.jpg" alt="Arbani Tour" width={32} height={32} className="rounded-full mx-auto mb-2 opacity-40" />
        <p className="text-[10px] md:text-xs text-gray-600">
          PT. Arbani Madinah Wisata · Jl. Pamularsih Raya No. 104, Semarang
        </p>
        <p className="text-[10px] md:text-xs text-gray-700 mt-1">© 2025 Arbani Tour</p>
      </div>
    </AppShell>
  );
}

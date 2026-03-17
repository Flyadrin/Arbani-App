import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TestimonialSlider from "@/components/TestimonialSlider";

const menuItems = [
  {
    href: "/paket-umroh",
    title: "Paket Umroh",
    subtitle: "Wujudkan impian ibadah umroh Anda bersama kami",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#C9A84C" strokeWidth="2" />
        {/* Kaaba */}
        <rect x="22" y="26" width="20" height="18" fill="#C9A84C" rx="1" />
        <rect x="26" y="34" width="12" height="10" fill="#0A0A0A" rx="1" />
        {/* Crescent */}
        <path
          d="M32 14 C28 14 25 17 25 21 C28 19 31 19 34 21 C34 17 35 14 32 14 Z"
          fill="#C9A84C"
        />
        <polygon points="32,10 33,13 36,13 34,15 35,18 32,16 29,18 30,15 28,13 31,13" fill="#C9A84C" />
      </svg>
    ),
    badge: "Tersedia",
    color: "from-[#1a1500] to-[#141414]",
  },
  {
    href: "/paket-haji",
    title: "Paket Haji",
    subtitle: "Perjalanan haji khusus dengan fasilitas premium",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#C9A84C" strokeWidth="2" />
        {/* Masjidil Haram dome */}
        <rect x="14" y="36" width="36" height="14" fill="#C9A84C" rx="1" />
        <ellipse cx="32" cy="36" rx="14" ry="8" fill="#C9A84C" />
        <ellipse cx="32" cy="36" rx="10" ry="5" fill="#0A0A0A" />
        <ellipse cx="32" cy="36" rx="6" ry="3" fill="#C9A84C" />
        {/* Minarets */}
        <rect x="14" y="22" width="4" height="18" fill="#C9A84C" rx="1" />
        <rect x="46" y="22" width="4" height="18" fill="#C9A84C" rx="1" />
        <polygon points="16,22 18,16 20,22" fill="#C9A84C" />
        <polygon points="48,22 50,16 52,22" fill="#C9A84C" />
      </svg>
    ),
    badge: "Khusus",
    color: "from-[#1a1500] to-[#141414]",
  },
  {
    href: "/doa-umroh",
    title: "Doa-doa Umroh",
    subtitle: "Panduan lengkap doa dan bacaan selama ibadah umroh",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#C9A84C" strokeWidth="2" />
        {/* Book */}
        <rect x="16" y="18" width="14" height="28" fill="#C9A84C" rx="1" />
        <rect x="30" y="18" width="14" height="28" fill="#A07830" rx="1" />
        <rect x="29" y="16" width="2" height="32" fill="#E8C96D" rx="1" />
        {/* Lines on book */}
        <line x1="19" y1="24" x2="27" y2="24" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="19" y1="28" x2="27" y2="28" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="19" y1="32" x2="27" y2="32" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="33" y1="24" x2="41" y2="24" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="33" y1="28" x2="41" y2="28" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="33" y1="32" x2="41" y2="32" stroke="#0A0A0A" strokeWidth="1.5" />
      </svg>
    ),
    badge: "Gratis",
    color: "from-[#1a1500] to-[#141414]",
  },
];

const stats = [
  { value: "15+", label: "Tahun Pengalaman" },
  { value: "5000+", label: "Jamaah Berangkat" },
  { value: "4.9★", label: "Rating Google" },
  { value: "100%", label: "Keberangkatan Tepat" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 text-center">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="relative rounded-full p-1"
            style={{
              background: "linear-gradient(135deg, #A07830, #C9A84C, #E8C96D)",
              boxShadow: "0 0 40px rgba(201,168,76,0.4)",
            }}
          >
            <Image
              src="/logo.jpg"
              alt="Arbani Tour Logo"
              width={120}
              height={120}
              className="rounded-full"
              priority
            />
          </div>
        </div>

        <p
          className="text-xs tracking-[0.3em] uppercase mb-2"
          style={{ color: "#C9A84C" }}
        >
          Bismillahirrahmanirrahim
        </p>
        <h1
          className="text-3xl md:text-5xl font-black mb-2 tracking-wide"
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
        <p
          className="text-sm tracking-[0.2em] uppercase mb-4"
          style={{ color: "#8a7a5a" }}
        >
          Biro Terpercaya Zona Nyaman
        </p>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed mb-8">
          Kami hadir untuk mewujudkan perjalanan ibadah Anda yang nyaman, amanah,
          dan berkesan. Berangkat bersama kami, pulang dengan kenangan indah.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/paket-umroh"
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #A07830, #C9A84C)",
              color: "#0A0A0A",
              boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
            }}
          >
            Lihat Paket Umroh
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full font-semibold text-sm border transition-all hover:scale-105"
            style={{
              borderColor: "#C9A84C",
              color: "#C9A84C",
            }}
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="mx-4 rounded-2xl mb-10 py-6"
        style={{
          background: "#141414",
          border: "1px solid #242424",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <p
                className="text-2xl font-black"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: "#C9A84C",
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Menu Cards */}
      <section className="px-4 mb-10">
        <div className="text-center mb-8">
          <p
            className="text-xs tracking-widest uppercase mb-1"
            style={{ color: "#C9A84C" }}
          >
            Layanan Kami
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-cinzel)", color: "#ffffff" }}
          >
            Pilih Layanan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`card-hover group relative rounded-2xl p-6 flex flex-col items-center text-center bg-gradient-to-b ${item.color}`}
              style={{
                border: "1px solid #242424",
              }}
            >
              {/* Top badge */}
              <span
                className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgba(201,168,76,0.15)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                {item.badge}
              </span>

              {/* Icon */}
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {item.subtitle}
              </p>

              {/* Arrow */}
              <div
                className="mt-auto flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                style={{ color: "#C9A84C" }}
              >
                Selengkapnya
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="px-4 mb-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p
            className="text-xs tracking-widest uppercase mb-1"
            style={{ color: "#C9A84C" }}
          >
            Keunggulan
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-cinzel)", color: "#ffffff" }}
          >
            Mengapa Arbani Tour?
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🕌", title: "Pembimbing Berpengalaman", desc: "Ustadz bersertifikat & berpengalaman memimpin jamaah" },
            { icon: "🏨", title: "Hotel Bintang 5", desc: "Akomodasi premium dekat Masjidil Haram & Nabawi" },
            { icon: "✈️", title: "Keberangkatan Tepat", desc: "Jadwal keberangkatan terjamin tanpa penundaan" },
            { icon: "🤝", title: "Amanah & Terpercaya", desc: "Terdaftar resmi Kementerian Agama RI" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-5 text-center"
              style={{
                background: "#141414",
                border: "1px solid #242424",
              }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#C9A84C" }}
              >
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Slider */}
      <TestimonialSlider />

      {/* CTA Section */}
      <section className="px-4 py-12 text-center">
        <div
          className="max-w-2xl mx-auto rounded-3xl px-8 py-10"
          style={{
            background: "linear-gradient(135deg, #1a1300, #141414)",
            border: "1px solid rgba(201,168,76,0.3)",
            boxShadow: "0 0 60px rgba(201,168,76,0.08)",
          }}
        >
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#C9A84C" }}>
            Hubungi Kami
          </p>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
          >
            Siap Berangkat?
          </h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Konsultasikan kebutuhan perjalanan ibadah Anda bersama tim kami.
            Kami siap membantu Anda 7 hari seminggu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/6281129064120"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                background: "#25D366",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Kami
            </a>
            <a
              href="tel:0247601577"
              className="px-6 py-3 rounded-full font-semibold text-sm border transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{
                borderColor: "#C9A84C",
                color: "#C9A84C",
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              (024) 7601577
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-4 py-8 text-center border-t"
        style={{ borderColor: "#1a1a1a" }}
      >
        <Image
          src="/logo.jpg"
          alt="Arbani Tour"
          width={48}
          height={48}
          className="rounded-full mx-auto mb-3"
        />
        <p
          className="text-sm font-bold tracking-wider"
          style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}
        >
          ARBANI TOUR
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PT. Arbani Madinah Wisata
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Jl. Pamularsih Raya No. 104, Semarang, Jawa Tengah
        </p>
        <p className="text-xs text-gray-600 mt-4">
          © 2025 Arbani Tour. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

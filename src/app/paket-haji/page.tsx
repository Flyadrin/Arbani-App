import Link from "next/link";
import AppShell from "@/components/AppShell";

const hajiPackages = [
  {
    name: "Haji Khusus ONH Plus",
    duration: "30 Hari",
    price: "Rp 180.000.000",
    highlight: true,
    badge: "Terpopuler",
    description: "Paket haji khusus resmi terdaftar Kementerian Agama RI dengan fasilitas bintang 5 dan bimbingan intensif.",
    hotels: [
      "Hotel Bintang 5 Mekkah (200m dari Masjidil Haram)",
      "Hotel Bintang 5 Madinah (300m dari Masjid Nabawi)",
      "Hotel Bintang 4 Mina & Arafah",
    ],
    includes: [
      "Visa haji resmi Kementerian Agama RI",
      "Tiket pesawat PP (Garuda Indonesia / Saudi Airlines)",
      "Hotel bintang 5 Mekkah & Madinah",
      "Makan 3x sehari full catering",
      "Transportasi AC eksklusif bus haji",
      "Bimbingan manasik haji lengkap (10 pertemuan)",
      "Pembimbing haji bersertifikat KBIHU",
      "Tenda AC di Mina & Arafah",
      "Perlengkapan haji lengkap (koper, ihram, sajadah, dll)",
      "Ziarah Makkah, Madinah & sekitarnya",
      "Handling bandara VIP",
      "Asuransi jiwa & perjalanan",
      "Kartu elektronik jamaah (e-Hajj)",
      "Pendampingan 24/7 dari tim Arbani",
    ],
    waitingTime: "3-5 tahun",
    quota: "Terbatas",
  },
  {
    name: "Haji Furoda (Mujamalah)",
    duration: "25 Hari",
    price: "Rp 350.000.000",
    highlight: false,
    badge: "Tanpa Antrian",
    description: "Haji dengan visa undangan resmi dari pemerintah Arab Saudi. Tidak perlu menunggu antrian bertahun-tahun.",
    hotels: [
      "Hotel Bintang 5 Mekkah (100m dari Masjidil Haram)",
      "Hotel Bintang 5 Madinah (walking distance Nabawi)",
      "Hotel premium di Mina",
    ],
    includes: [
      "Visa haji furoda (undangan resmi Kerajaan Saudi Arabia)",
      "Tiket pesawat PP business class",
      "Hotel bintang 5 premium Mekkah & Madinah",
      "Makan 3x sehari fine dining",
      "Transportasi VIP private",
      "Manasik haji intensif (12 pertemuan)",
      "Pembimbing haji senior (Ustadz berpengalaman)",
      "Tenda VIP AC di Mina & Arafah",
      "Perlengkapan haji premium",
      "Ziarah eksklusif Makkah, Madinah, Thaif, Jeddah",
      "Concierge service 24/7",
      "Asuransi jiwa & perjalanan premium",
    ],
    waitingTime: "Langsung berangkat",
    quota: "Sangat terbatas",
  },
  {
    name: "Haji Reguler Subsidi",
    duration: "40 Hari",
    price: "Rp 95.000.000",
    highlight: false,
    badge: "Terjangkau",
    description: "Paket haji regular dengan pendampingan penuh dari tim Arbani Tour. Cocok untuk jamaah yang ingin pengalaman ibadah haji yang khusyuk.",
    hotels: [
      "Hotel Bintang 3-4 Mekkah",
      "Hotel Bintang 3-4 Madinah",
      "Tenda standar di Mina & Arafah",
    ],
    includes: [
      "Visa haji regular",
      "Tiket pesawat PP",
      "Hotel bintang 3-4 Mekkah & Madinah",
      "Makan 3x sehari",
      "Transportasi AC bus haji",
      "Manasik haji lengkap (8 pertemuan)",
      "Pembimbing haji bersertifikat",
      "Tenda di Mina & Arafah",
      "Perlengkapan haji standar",
      "Ziarah Makkah & Madinah",
      "Handling bandara",
      "Asuransi perjalanan",
    ],
    waitingTime: "5-10 tahun",
    quota: "Sesuai kuota",
  },
];

const hajiProcess = [
  { step: "01", title: "Konsultasi & Pendaftaran", desc: "Hubungi tim kami untuk konsultasi paket yang sesuai. Daftar dengan melengkapi dokumen persyaratan." },
  { step: "02", title: "Manasik Haji", desc: "Ikuti bimbingan manasik haji intensif bersama ustadz berpengalaman kami selama beberapa pertemuan." },
  { step: "03", title: "Persiapan Keberangkatan", desc: "Tim kami membantu seluruh proses visa, tiket, dan kelengkapan dokumen perjalanan Anda." },
  { step: "04", title: "Ibadah Haji", desc: "Laksanakan ibadah haji dengan khusyuk didampingi pembimbing profesional kami selama di Tanah Suci." },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#C9A84C" }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function PaketHajiPage() {
  return (
    <AppShell>
      {/* Page header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <Link href="/" className="tap-target w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#141414" }}>
          <svg className="w-5 h-5" fill="none" stroke="#C9A84C" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-wide" style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}>
            PAKET HAJI
          </h1>
          <p className="text-[10px] text-gray-500">Haji khusus, furoda & reguler</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>
          ✓ Kemenag RI
        </span>
      </div>

      {/* How it works */}
      <div className="px-4 mb-6 mt-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-cinzel)", color: "#ffffff" }}>
            Proses Pendaftaran
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hajiProcess.map((p) => (
            <div
              key={p.step}
              className="rounded-2xl p-4 text-center"
              style={{ background: "#141414", border: "1px solid #242424" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3"
                style={{
                  background: "linear-gradient(135deg, #A07830, #C9A84C)",
                  color: "#0A0A0A",
                  fontFamily: "var(--font-cinzel)",
                }}
              >
                {p.step}
              </div>
              <h3 className="text-xs font-bold mb-1" style={{ color: "#C9A84C" }}>{p.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hajiPackages.map((pkg) => (
            <div
              key={pkg.name}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{
                background: pkg.highlight ? "linear-gradient(135deg, #1a1200, #1a1a00)" : "#141414",
                border: pkg.highlight ? "1px solid rgba(201,168,76,0.5)" : "1px solid #242424",
                boxShadow: pkg.highlight ? "0 0 40px rgba(201,168,76,0.15)" : "none",
              }}
            >
              {pkg.highlight && (
                <div
                  className="h-1 w-full"
                  style={{ background: "linear-gradient(90deg, #A07830, #C9A84C, #E8C96D)" }}
                />
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: "rgba(201,168,76,0.15)",
                        color: "#C9A84C",
                        border: "1px solid rgba(201,168,76,0.3)",
                      }}
                    >
                      {pkg.badge}
                    </span>
                    <h2
                      className="text-base font-bold mt-2"
                      style={{ fontFamily: "var(--font-cinzel)", color: pkg.highlight ? "#C9A84C" : "#ffffff" }}
                    >
                      {pkg.name}
                    </h2>
                  </div>
                </div>

                <p className="text-xl font-black mb-1" style={{ color: "#C9A84C" }}>
                  {pkg.price}
                </p>
                <p className="text-xs text-gray-400 mb-3">{pkg.duration}</p>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{pkg.description}</p>

                {/* Waiting time */}
                <div
                  className="rounded-xl p-3 mb-4 flex items-center justify-between"
                  style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
                >
                  <div>
                    <p className="text-xs text-gray-400">Estimasi Keberangkatan</p>
                    <p className="text-sm font-semibold" style={{ color: "#C9A84C" }}>{pkg.waitingTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 text-right">Kuota</p>
                    <p className="text-sm font-semibold text-right" style={{ color: "#C9A84C" }}>{pkg.quota}</p>
                  </div>
                </div>

                {/* Hotels */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">Hotel:</p>
                  {pkg.hotels.map((h) => (
                    <p key={h} className="text-xs text-gray-300 flex items-start gap-1.5 mb-1">
                      <span style={{ color: "#C9A84C" }} className="mt-0.5">🏨</span> {h}
                    </p>
                  ))}
                </div>

                {/* Includes */}
                <div className="mb-5 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-400">Termasuk:</p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/6281129064120?text=Assalamualaikum, saya tertarik dengan ${encodeURIComponent(pkg.name)} - ${pkg.duration}. Mohon info lebih lanjut mengenai pendaftaran.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: pkg.highlight ? "linear-gradient(135deg, #A07830, #C9A84C)" : "transparent",
                    color: pkg.highlight ? "#0A0A0A" : "#C9A84C",
                    border: pkg.highlight ? "none" : "1px solid #C9A84C",
                    boxShadow: pkg.highlight ? "0 4px 20px rgba(201,168,76,0.3)" : "none",
                  }}
                >
                  Daftar via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Important note */}
        <div
          className="mt-8 rounded-2xl p-6"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#C9A84C" }}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#C9A84C" }}>Informasi Penting</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Harga sewaktu-waktu dapat berubah sesuai kebijakan pemerintah Arab Saudi dan nilai tukar mata uang.
                Quota haji terbatas dan diatur oleh pemerintah. Segera hubungi kami untuk informasi ketersediaan kursi terkini.
                Arbani Tour terdaftar resmi di Kementerian Agama Republik Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

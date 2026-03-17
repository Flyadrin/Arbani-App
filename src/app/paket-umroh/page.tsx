import Link from "next/link";
import AppShell from "@/components/AppShell";

const packages = [
  {
    name: "Umroh Reguler",
    duration: "9 Hari",
    price: "Rp 28.500.000",
    highlight: false,
    badge: "Populer",
    description: "Paket umroh terjangkau dengan fasilitas lengkap dan nyaman untuk semua kalangan.",
    hotels: ["Hotel Bintang 4 Mekkah (500m dari Haram)", "Hotel Bintang 4 Madinah"],
    includes: [
      "Tiket pesawat PP (Saudi Airlines / Garuda)",
      "Hotel bintang 4 Mekkah & Madinah",
      "Makan 3x sehari (menu Indonesia & Arab)",
      "Transportasi full AC",
      "Visa umroh",
      "Manasik umroh (2 pertemuan)",
      "Pembimbing ibadah bersertifikat",
      "Perlengkapan umroh (koper, ihram, buku doa)",
      "Handling bandara",
      "Asuransi perjalanan",
    ],
    seats: 20,
    departures: ["Maret 2025", "April 2025", "Mei 2025", "Juni 2025"],
  },
  {
    name: "Umroh Plus",
    duration: "12 Hari",
    price: "Rp 38.000.000",
    highlight: true,
    badge: "Terbaik",
    description: "Paket premium dengan hotel bintang 5 dan program ziarah kota Thaif & Jeddah.",
    hotels: ["Hotel Bintang 5 Mekkah (100m dari Haram)", "Hotel Bintang 5 Madinah"],
    includes: [
      "Tiket pesawat PP (Garuda Indonesia)",
      "Hotel bintang 5 Mekkah & Madinah",
      "Makan 3x sehari (buffet hotel)",
      "Transportasi VIP full AC",
      "Visa umroh",
      "Manasik umroh (3 pertemuan + simulasi)",
      "Pembimbing ibadah senior",
      "Perlengkapan umroh premium",
      "Ziarah Thaif & Jeddah",
      "City tour Jeddah",
      "Handling bandara VIP",
      "Asuransi perjalanan premium",
    ],
    seats: 15,
    departures: ["Maret 2025", "April 2025", "Mei 2025"],
  },
  {
    name: "Umroh Ramadhan",
    duration: "15 Hari",
    price: "Rp 55.000.000",
    highlight: false,
    badge: "Spesial",
    description: "Rasakan keistimewaan ibadah umroh di bulan suci Ramadhan dengan pahala berlipat.",
    hotels: ["Hotel Bintang 5 Mekkah (walking distance)", "Hotel Bintang 5 Madinah"],
    includes: [
      "Tiket pesawat PP (Saudi Airlines)",
      "Hotel bintang 5 Mekkah & Madinah",
      "Makan 3x + Sahur & Buka puasa di hotel",
      "Transportasi full AC eksklusif",
      "Visa umroh",
      "Manasik umroh komprehensif (4 pertemuan)",
      "Pembimbing ibadah senior & ustadz khusus",
      "Perlengkapan umroh lengkap",
      "Itikaf 10 malam terakhir (opsional)",
      "Ziarah Madinah & Makkah",
      "Program tadarus Al-Quran",
      "Handling bandara VIP",
      "Asuransi perjalanan premium",
    ],
    seats: 10,
    departures: ["Ramadhan 2025 (Maret)"],
  },
  {
    name: "Umroh Keluarga",
    duration: "10 Hari",
    price: "Mulai Rp 25.000.000 / orang",
    highlight: false,
    badge: "Keluarga",
    description: "Paket khusus keluarga dengan harga spesial. Minimum 4 orang, satu kamar keluarga.",
    hotels: ["Hotel Bintang 4-5 Mekkah (350m dari Haram)", "Hotel Bintang 4-5 Madinah"],
    includes: [
      "Tiket pesawat PP",
      "Hotel bintang 4-5 (kamar keluarga tersedia)",
      "Makan 3x sehari",
      "Transportasi full AC",
      "Visa umroh",
      "Manasik umroh keluarga",
      "Pembimbing ibadah berpengalaman",
      "Perlengkapan umroh untuk semua anggota",
      "Handling bandara",
      "Asuransi perjalanan keluarga",
      "Diskon khusus anak di bawah 12 tahun",
    ],
    seats: 8,
    departures: ["Setiap bulan (request)"],
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#C9A84C" }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function PaketUmrohPage() {
  return (
    <AppShell>
      {/* Page header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <Link href="/" className="tap-target w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#141414" }}>
          <svg className="w-5 h-5" fill="none" stroke="#C9A84C" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-base font-black tracking-wide" style={{ fontFamily: "var(--font-cinzel)", color: "#C9A84C" }}>
            PAKET UMROH
          </h1>
          <p className="text-[10px] text-gray-500">Pilih paket terbaik untuk Anda</p>
        </div>
      </div>

      {/* Packages */}
      <div className="px-4 py-4">
        <div className="flex flex-col gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{
                background: pkg.highlight
                  ? "linear-gradient(135deg, #1a1200, #1a1a00)"
                  : "#141414",
                border: pkg.highlight
                  ? "1px solid rgba(201,168,76,0.5)"
                  : "1px solid #242424",
                boxShadow: pkg.highlight
                  ? "0 0 40px rgba(201,168,76,0.15)"
                  : "none",
              }}
            >
              {/* Top stripe */}
              {pkg.highlight && (
                <div
                  className="h-1 w-full"
                  style={{
                    background: "linear-gradient(90deg, #A07830, #C9A84C, #E8C96D)",
                  }}
                />
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Badge + name */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: pkg.highlight
                          ? "rgba(201,168,76,0.25)"
                          : "rgba(201,168,76,0.1)",
                        color: "#C9A84C",
                        border: "1px solid rgba(201,168,76,0.3)",
                      }}
                    >
                      {pkg.badge}
                    </span>
                    <h2
                      className="text-lg font-bold mt-2"
                      style={{ fontFamily: "var(--font-cinzel)", color: pkg.highlight ? "#C9A84C" : "#ffffff" }}
                    >
                      {pkg.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black" style={{ color: "#C9A84C" }}>
                      {pkg.price}
                    </p>
                    <p className="text-xs text-gray-400">{pkg.duration}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Hotel info */}
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#C9A84C" }}>
                    Hotel
                  </p>
                  {pkg.hotels.map((h) => (
                    <p key={h} className="text-xs text-gray-300 flex items-center gap-1.5 mb-1">
                      <span style={{ color: "#C9A84C" }}>🏨</span> {h}
                    </p>
                  ))}
                </div>

                {/* Includes */}
                <div className="mb-4 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-400">
                    Termasuk:
                  </p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Departures */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                    Jadwal Keberangkatan:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.departures.map((d) => (
                      <span
                        key={d}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: "#1a1a1a", border: "1px solid #333", color: "#aaa" }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Seat info */}
                <p className="text-xs text-gray-500 mb-4">
                  Sisa kursi: <span style={{ color: "#C9A84C" }} className="font-semibold">{pkg.seats} kursi</span>
                </p>

                {/* CTA */}
                <a
                  href={`https://wa.me/6281129064120?text=Assalamualaikum, saya tertarik dengan ${encodeURIComponent(pkg.name)} - ${pkg.duration} seharga ${pkg.price}. Mohon info lebih lanjut.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: pkg.highlight
                      ? "linear-gradient(135deg, #A07830, #C9A84C)"
                      : "transparent",
                    color: pkg.highlight ? "#0A0A0A" : "#C9A84C",
                    border: pkg.highlight ? "none" : "1px solid #C9A84C",
                    boxShadow: pkg.highlight ? "0 4px 20px rgba(201,168,76,0.3)" : "none",
                  }}
                >
                  Daftar Sekarang via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Custom package note */}
        <div
          className="mt-8 rounded-2xl p-6 text-center"
          style={{
            background: "#141414",
            border: "1px solid #242424",
          }}
        >
          <p className="text-gray-300 text-sm mb-3">
            Tidak menemukan paket yang sesuai? Kami menyediakan paket <strong style={{ color: "#C9A84C" }}>custom / group</strong> sesuai kebutuhan Anda.
          </p>
          <a
            href="https://wa.me/6281129064120?text=Assalamualaikum, saya ingin konsultasi paket umroh custom untuk group."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: "#25D366",
              color: "#ffffff",
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Konsultasi Paket Custom
          </a>
        </div>
      </div>
    </AppShell>
  );
}

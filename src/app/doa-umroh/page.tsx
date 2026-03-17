"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const doaCategories = [
  {
    id: "niat",
    category: "Niat & Talbiyah",
    icon: "🤲",
    duas: [
      {
        title: "Niat Umroh",
        arabic: "لَبَّيْكَ اللّهُمَّ عُمْرَةً",
        latin: "Labbaikallahumma 'umratan",
        meaning: "Aku sambut panggilan-Mu ya Allah untuk melaksanakan umroh.",
        note: "Dibaca saat memakai ihram di miqat",
      },
      {
        title: "Talbiyah",
        arabic: "لَبَّيْكَ اللّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيْكَ لَكَ",
        latin: "Labbaikallahumma labbaik, labbaika laa syariika laka labbaik, innal hamda wan ni'mata laka wal mulk, laa syariika lak",
        meaning: "Aku penuhi panggilan-Mu ya Allah, aku penuhi. Aku penuhi panggilan-Mu, tidak ada sekutu bagi-Mu, aku penuhi. Sesungguhnya segala puji, nikmat dan kerajaan adalah milik-Mu, tidak ada sekutu bagi-Mu.",
        note: "Dibaca berulang-ulang sejak ihram hingga memulai thawaf",
      },
    ],
  },
  {
    id: "thawaf",
    category: "Doa Thawaf",
    icon: "🕌",
    duas: [
      {
        title: "Doa Memulai Thawaf",
        arabic: "بِسْمِ اللهِ وَاللهُ أَكْبَرُ، اللّهُمَّ إِيْمَاناً بِكَ وَتَصْدِيْقاً بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعاً لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ",
        latin: "Bismillaahi wallaahu akbar, allahumma iimaanan bika wa tashdiiqan bikitaabika wa wafaa-an bi'ahdika wattibaa'an lisunnati nabiyyika muhammadin shallallaahu 'alaihi wasallam",
        meaning: "Dengan nama Allah dan Allah Maha Besar. Ya Allah, dengan keimanan kepada-Mu, membenarkan kitab-Mu, menepati janji-Mu dan mengikuti sunnah Nabi-Mu Muhammad SAW.",
        note: "Dibaca saat memulai putaran thawaf pertama sambil menghadap Hajar Aswad",
      },
      {
        title: "Doa di Antara Rukun Yamani dan Hajar Aswad",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        latin: "Rabbana aatina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adzaaban-nar",
        meaning: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa api neraka.",
        note: "Dibaca di antara Rukun Yamani dan Hajar Aswad pada setiap putaran",
      },
      {
        title: "Doa Shalat Sunnat Setelah Thawaf",
        arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
        latin: "Rabbana taqabbal minna innaka antas samii'ul 'aliim",
        meaning: "Ya Tuhan kami, terimalah (ibadah) dari kami. Sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui.",
        note: "Dibaca setelah shalat 2 rakaat di belakang Maqam Ibrahim",
      },
    ],
  },
  {
    id: "sa'i",
    category: "Doa Sa'i",
    icon: "🏃",
    duas: [
      {
        title: "Doa di Bukit Shafa",
        arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللهِ، أَبْدَأُ بِمَا بَدَأَ اللهُ بِهِ، اَللّهُ أَكْبَرُ، اَللّهُ أَكْبَرُ، اَللّهُ أَكْبَرُ، لاَ إِلهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Innash-shafaa wal marwata min sya'aa-irillah. Ab-da-u bimaa bada-allahu bih. Allahu akbar, allahu akbar, allahu akbar. Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa 'alaa kulli syai-in qadiir.",
        meaning: "Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar Allah. Aku mulai dengan apa yang dimulai oleh Allah. Allah Maha Besar (3x). Tidak ada Tuhan selain Allah yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan pujian. Dia yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.",
        note: "Dibaca saat berada di atas Bukit Shafa menghadap Ka'bah",
      },
      {
        title: "Doa Saat Sa'i",
        arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ الأَعَزُّ الأَكْرَمُ",
        latin: "Rabbighfir warham wa antal a'azzul akram",
        meaning: "Ya Tuhanku, ampunilah dan rahmatilah, dan Engkaulah Yang Maha Mulia lagi Maha Dermawan.",
        note: "Dibaca selama perjalanan sa'i antara Shafa dan Marwah",
      },
    ],
  },
  {
    id: "masuk-masjid",
    category: "Masuk & Keluar Masjid",
    icon: "🚶",
    duas: [
      {
        title: "Doa Masuk Masjid",
        arabic: "اَللّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        latin: "Allahummaftah lii abwaaba rahmatik",
        meaning: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
        note: "Dibaca ketika memasuki masjid dengan kaki kanan terlebih dahulu",
      },
      {
        title: "Doa Keluar Masjid",
        arabic: "اَللّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        latin: "Allahumma inni as-aluka min fadhlika",
        meaning: "Ya Allah, sesungguhnya aku memohon kepada-Mu dari karunia-Mu.",
        note: "Dibaca ketika keluar dari masjid dengan kaki kiri terlebih dahulu",
      },
    ],
  },
  {
    id: "melihat-kabah",
    category: "Melihat Ka'bah",
    icon: "✨",
    duas: [
      {
        title: "Doa Pertama Melihat Ka'bah",
        arabic: "اَللّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفاً وَتَعْظِيماً وَتَكْرِيماً وَمَهَابَةً وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفاً وَتَعْظِيماً وَتَكْرِيماً وَبِرّاً",
        latin: "Allahumma zid haadzal baita tasyriifan wa ta'zhiiman wa tasyriifan wa mahaabatan, wa zid man syarrafahu wa karramahu mimman hajjahu awi'tamarahu tasyriifan wa ta'zhiiman wa birraa.",
        meaning: "Ya Allah, tambahkanlah kehormatan, keagungan, kemuliaan dan kewibawaan bagi Baitullah ini. Dan tambahkanlah juga bagi orang-orang yang memuliakan dan menghormatinya dari kalangan orang yang berhaji atau berumroh, kehormatan, keagungan, dan kebaikan.",
        note: "Dibaca pertama kali saat melihat Ka'bah",
      },
    ],
  },
  {
    id: "tahallul",
    category: "Tahallul & Selesai Umroh",
    icon: "✂️",
    duas: [
      {
        title: "Doa Mencukur / Memotong Rambut (Tahallul)",
        arabic: "اَللّهُمَّ هَذِهِ نَاصِيَتِي بِيَدِكَ فَاجْعَلْ لِكُلِّ شَعْرَةٍ نُورًا يَوْمَ الْقِيَامَةِ",
        latin: "Allahumma hadzihi naashiyatii biyadika faj'al likulli sya'ratin nuuran yaumal qiyaamah",
        meaning: "Ya Allah, ubun-ubunku ada di tangan-Mu, jadikanlah untuk setiap helai rambut ini cahaya pada hari kiamat.",
        note: "Dibaca saat akan mencukur atau memotong rambut sebagai tanda berakhirnya ihram",
      },
      {
        title: "Doa Selesai Umroh",
        arabic: "اَللّهُمَّ إِنَّكَ قُلْتَ وَقَوْلُكَ الْحَقُّ (وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلّهِ) وَقَدِ اعْتَمَرْتُ كَمَا أَمَرْتَ فَتَقَبَّلْ مِنِّي",
        latin: "Allahumma innaka qulta wa qaulukal haqqu (wa atimmul hajja wal 'umrata lillahi) wa qadi'tamartu kamaa amarta fataqabbal minni",
        meaning: "Ya Allah, sesungguhnya Engkau berfirman dan firman-Mu adalah benar (sempurnakanlah haji dan umroh karena Allah). Dan aku telah berumroh sebagaimana Engkau perintahkan, maka terimalah dariku.",
        note: "Dibaca setelah selesai melaksanakan seluruh rangkaian ibadah umroh",
      },
    ],
  },
  {
    id: "ziarah",
    category: "Doa Ziarah Nabawi",
    icon: "🌹",
    duas: [
      {
        title: "Salam kepada Nabi SAW",
        arabic: "اَلسَّلاَمُ عَلَيْكَ يَا رَسُولَ اللهِ، اَلسَّلاَمُ عَلَيْكَ يَا نَبِيَّ اللهِ، اَلسَّلاَمُ عَلَيْكَ يَا حَبِيبَ اللهِ",
        latin: "Assalaamu 'alaika yaa rasuulallaah, assalaamu 'alaika yaa nabiyallaah, assalaamu 'alaika yaa habiballaah",
        meaning: "Semoga keselamatan terlimpah atasmu wahai Rasulullah. Semoga keselamatan terlimpah atasmu wahai Nabi Allah. Semoga keselamatan terlimpah atasmu wahai Kekasih Allah.",
        note: "Dibaca saat berziarah ke makam Rasulullah SAW di Masjid Nabawi",
      },
      {
        title: "Doa di Raudhah",
        arabic: "اَللّهُمَّ اغْفِرْلِي وَلِوَالِدَيَّ وَلِجَمِيعِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ",
        latin: "Allahummagh-firlii wa liwaalidayya wa lijamii'il mu'miniina wal mu'minaati wal muslimina wal muslimaati al-ahyaa-i minhum wal amwaat",
        meaning: "Ya Allah, ampunilah aku, kedua orang tuaku, dan seluruh orang-orang mukmin laki-laki dan perempuan, muslim laki-laki dan perempuan, yang masih hidup maupun yang telah meninggal.",
        note: "Dibaca saat berada di Raudhah (taman surga di dalam Masjid Nabawi)",
      },
    ],
  },
];

export default function DoaUmrohPage() {
  const [activeCategory, setActiveCategory] = useState<string>("niat");
  const [expandedDua, setExpandedDua] = useState<string | null>(null);

  const selectedCategory = doaCategories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative px-4 pt-12 pb-8 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 70%)",
          }}
        />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#C9A84C" }}>
          Arbani Tour
        </p>
        <h1
          className="text-3xl md:text-4xl font-black mb-3 tracking-wide"
          style={{
            fontFamily: "var(--font-cinzel)",
            background: "linear-gradient(135deg, #A07830, #C9A84C, #E8C96D)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          DOA-DOA UMROH
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Panduan lengkap doa dan bacaan selama ibadah umroh. Lengkap dengan
          tulisan Arab, latin, dan terjemahan.
        </p>
      </section>

      {/* Category tabs - horizontal scroll */}
      <div className="px-4 mb-6 overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {doaCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setExpandedDua(null); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                background: activeCategory === cat.id
                  ? "linear-gradient(135deg, #A07830, #C9A84C)"
                  : "#141414",
                color: activeCategory === cat.id ? "#0A0A0A" : "#888",
                border: activeCategory === cat.id ? "none" : "1px solid #242424",
              }}
            >
              <span>{cat.icon}</span>
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* Duas */}
      <section className="px-4 pb-12 max-w-3xl mx-auto">
        {selectedCategory && (
          <div>
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: "#C9A84C" }}
            >
              <span>{selectedCategory.icon}</span>
              {selectedCategory.category}
            </h2>

            <div className="space-y-4">
              {selectedCategory.duas.map((dua) => {
                const isExpanded = expandedDua === dua.title;
                return (
                  <div
                    key={dua.title}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "#141414",
                      border: isExpanded ? "1px solid rgba(201,168,76,0.4)" : "1px solid #242424",
                    }}
                  >
                    {/* Header */}
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between text-left"
                      onClick={() => setExpandedDua(isExpanded ? null : dua.title)}
                    >
                      <span className="font-semibold text-sm text-white">{dua.title}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "#C9A84C", flexShrink: 0 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t" style={{ borderColor: "#242424" }}>
                        {/* Arabic text */}
                        <div
                          className="mt-4 p-4 rounded-xl text-center"
                          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
                        >
                          <p
                            className="text-xl leading-loose text-right"
                            style={{
                              fontFamily: "serif",
                              color: "#E8C96D",
                              direction: "rtl",
                              lineHeight: "2.5",
                            }}
                          >
                            {dua.arabic}
                          </p>
                        </div>

                        {/* Latin */}
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">
                            Latin
                          </p>
                          <p className="text-sm italic text-gray-300 leading-relaxed">
                            {dua.latin}
                          </p>
                        </div>

                        {/* Meaning */}
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-500">
                            Artinya
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            &ldquo;{dua.meaning}&rdquo;
                          </p>
                        </div>

                        {/* Note */}
                        {dua.note && (
                          <div
                            className="mt-3 px-3 py-2 rounded-lg flex items-start gap-2"
                            style={{ background: "rgba(201,168,76,0.08)" }}
                          >
                            <span className="text-xs" style={{ color: "#C9A84C" }}>💡</span>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              <span className="font-semibold" style={{ color: "#C9A84C" }}>Keterangan: </span>
                              {dua.note}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">📚</span>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#C9A84C" }}>
                Panduan Manasik Lengkap
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Untuk panduan manasik umroh yang lebih lengkap dan bimbingan langsung dari ustadz kami,
                daftarkan diri Anda dalam program manasik Arbani Tour. Kami menyediakan buku panduan
                lengkap beserta CD/video bimbingan untuk setiap jamaah.
              </p>
              <a
                href="https://wa.me/6281129064120?text=Assalamualaikum, saya ingin mendaftar program manasik umroh Arbani Tour."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold transition-colors hover:text-[#E8C96D]"
                style={{ color: "#C9A84C" }}
              >
                Daftar Manasik
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

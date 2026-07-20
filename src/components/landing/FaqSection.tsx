import { useState } from "react";

const faqList = [
  {
    q: (
      <>
        Apa itu <span className="text-[#557235]">Kasandra</span>?
      </>
    ),
    a: (
      <>
        <span className="text-[#557235]">Kasandra</span> adalah <em>digital twin</em> keuangan
        untuk membantu usaha kecil memproyeksikan kondisi kas dan stok 30 hari ke depan
        berdasarkan transaksi harian dan memberikan peringatan dini.
      </>
    ),
  },
  {
    q: (
      <>
        Bagaimana cara <span className="text-[#557235]">Kasandra</span> menghitung proyeksinya?
      </>
    ),
    a: "Proyeksi dihitung dari data transaksi dan stok harian yang dicatat setiap hari. Semakin lengkap data yang diberikan, semakin akurat juga hasilnya.",
  },
  {
    q: "Apakah data usaha saya aman?",
    a: "Data transaksi dan stok yang kamu catat hanya dapat diakses melalui akunmu sendiri, dan tidak dibagikan ke pihak lain tanpa persetujuanmu.",
  },
];

export function FaqSection() {
  const [terbuka, setTerbuka] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-6xl px-6 py-8 md:py-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">FAQs</h2>

      <div className="space-y-4">
        {faqList.map((item, idx) => {
          const aktif = terbuka === idx;
          return (
            <div
              key={idx}
              onClick={() => setTerbuka(aktif ? null : idx)}
              className={`cursor-pointer rounded-xl border-2 bg-white p-5 transition-colors ${
                aktif ? "border-blue-400" : "border-[#557235]/40"
              }`}
            >
              <div className="flex w-full items-center justify-between text-left">
                <span className="font-semibold text-gray-800">{item.q}</span>
                <span className="text-gray-400">{aktif ? "−" : "+"}</span>
              </div>
              
              {aktif && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="cursor-auto mt-2 text-sm text-gray-600"
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
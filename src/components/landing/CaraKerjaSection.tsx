const langkahKerja = [
  {
    nomor: "01",
    title: "Catat Transaksi & Stok",
    desc: "Catat pemasukan, pengeluaran, dan stok harianmu dengan mudah.",
  },
  {
    nomor: "02",
    title: "Lihat Proyeksi 30 Hari",
    desc: "Dashboard menampilkan tren, proyeksi 30 hari, dan status stok.",
  },
  {
    nomor: "03",
    title: "Dapatkan Peringatan Dini",
    desc: "Notifikasi otomatis saat stok kritis atau kas berpotensi defisit.",
  },
];

export function CaraKerjaSection() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-6 py-8 md:py-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Cara <span className="text-[#557235]">Kasandra</span> Bekerja
      </h2>

      <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-3">
        {langkahKerja.map((langkah) => (
          <div
            key={langkah.nomor}
            className="relative rounded-xl bg-[#e8b93d] p-5 pt-7"
          >
            <div className="absolute -top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#557235] text-xs font-bold text-white shadow-md">
              {langkah.nomor}
            </div>
            <h3 className="mb-1 font-semibold text-[#557235]">{langkah.title}</h3>
            <p className="text-sm text-white">{langkah.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

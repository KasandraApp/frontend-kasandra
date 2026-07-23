interface FiturItem {
  iconSrc: string; // path ke gambar icon custom, taro filenya di src/assets/icons/
  title: string;
  desc: string;
}

const fiturList: FiturItem[] = [
  {
    iconSrc: "/assets/icons/input-harian.png",
    title: "Input Data Harian",
    desc: "Catat transaksi dan stok harian sebagai dasar analisis dan proyeksi bisnis.",
  },
  {
    iconSrc: "/assets/icons/dashboard-visual.png",
    title: "Dashboard Visual",
    desc: "Visualisasi proyeksi arus kas dan estimasi ketahanan stok yang diperbarui real-time.",
  },
  {
    iconSrc: "/assets/icons/whatif.png",
    title: "Simulasi What-If",
    desc: "Uji skenario bisnis dan lihat proyeksi dampaknya secara instan.",
  },
  {
    iconSrc: "/assets/icons/alert.png",
    title: "Banner Alert",
    desc: "Dapatkan peringatan dini saat stok atau kas berisiko.",
  },
];

export function FiturSection() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fiturList.map((fitur) => (
          <div
            key={fitur.title}
            className="rounded-xl border border-[#557235]/30 bg-white p-5"
          >
            <div className="flex gap-3">
              {/* Slot gambar custom — ganti src di atas dengan file asset asli */}
              <img
                src={fitur.iconSrc}
                alt={fitur.title}
                className="h-6 w-6 shrink-0 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <h3 className="mb-1 font-semibold text-[#557235]">{fitur.title}</h3>
                <p className="text-sm text-gray-500">{fitur.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

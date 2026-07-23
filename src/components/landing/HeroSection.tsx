interface HeroSectionProps {
  onMulaiClick: () => void;
}

export function HeroSection({ onMulaiClick }: HeroSectionProps) {
  return (
    <section id="utama" className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-10 md:gap-10 md:py-16 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
          Ketahui kondisi kas usahamu{" "}
          <span className="text-[#e8b93d]">sebelum </span>
          masalah muncul
        </h1>
        <p className="mt-5 max-w-md text-gray-500">
          Catat transaksi dan stok harian usahamu. <strong>Kasandra</strong> akan
          memproyeksikan kondisi kas untuk 30 hari ke depan, dan memberi peringatan
          lebih awal jika ada terdeteksi potensi risiko.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={onMulaiClick}
            className="rounded-lg bg-[#557235] px-6 py-3 text-sm font-semibold text-white hover:bg-[#44601f]"
          >
            Mulai Sekarang
          </button>
          <a
            href="#cara-kerja"
            className="rounded-lg border border-[#e8b93d] px-6 py-3 text-sm font-semibold text-[#557235] hover:bg-yellow-50"
          >
            Lihat Cara Kerja
          </a>
        </div>
      </div>

      <div className="hidden justify-center md:flex">
        <img
          src="/assets/icons/hero-illustration.png"
          alt="Ilustrasi Dashboard"
          className="h-full w-full object-contain"
        />
      </div>
    </section>
  );
}
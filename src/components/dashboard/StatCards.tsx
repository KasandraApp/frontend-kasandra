import { formatRupiah } from "../../utils/formatRupiah";

interface StatCardsProps {
  kasSaatIni: number;
  perubahanMingguLalu: number;
  proyeksi30Hari: number;
  hariDefisit?: number;
}

function IconBadge({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-4 w-4"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

export function StatCards({
  kasSaatIni,
  perubahanMingguLalu,
  proyeksi30Hari,
  hariDefisit,
}: StatCardsProps) {
  const adaData = kasSaatIni !== 0 || proyeksi30Hari !== 0;
  const proyeksiNegatif = proyeksi30Hari < 0;

  return (
    <div className="flex h-full flex-col justify-between gap-4 sm:flex-row lg:flex-col">
      <div className="flex flex-1 flex-col justify-between rounded-xl bg-[#ffebb0] p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#557235]">
          Kas Saat Ini
          <IconBadge src="/src/assets/icons/kas.png" alt="Kas" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{formatRupiah(kasSaatIni)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {adaData ? (
              <span className="text-green-700">↗ +{perubahanMingguLalu}% dari minggu lalu</span>
            ) : (
              "Belum ada data tercatat"
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between rounded-xl bg-[#ffebb0] p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#557235]">
          Proyeksi 30 Hari
          <IconBadge src="/src/assets/icons/proyeksi.png" alt="Proyeksi" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{formatRupiah(proyeksi30Hari)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {!adaData ? (
              "Muncul setelah data tercatat"
            ) : proyeksiNegatif && hariDefisit !== undefined ? (
              <span className="text-[#dc2626]">↘ Berpotensi defisit pada H+{hariDefisit}</span>
            ) : (
              <span className="text-green-700">↗ Proyeksi stabil</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

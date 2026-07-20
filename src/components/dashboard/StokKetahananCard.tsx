import { EmptyIcon } from "../shared/EmptyIcon";

interface ItemStok {
  nama: string;
  sisaHari: number;
  maxHari: number; // dipakai buat hitung lebar bar relatif
}

interface StokKetahananCardProps {
  items: ItemStok[];
}

function warnaBar(sisaHari: number) {
  if (sisaHari < 3) return "bg-[#dc2626]";
  if (sisaHari < 7) return "bg-[#e8b93d]";
  return "bg-[#557235]";
}

function warnaTeks(sisaHari: number) {
  if (sisaHari < 3) return "text-[#dc2626]";
  if (sisaHari < 7) return "text-[#b8860b]";
  return "text-[#557235]";
}

export function StokKetahananCard({ items }: StokKetahananCardProps) {
  if (items.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-800">Estimasi Ketahanan Stok</h3>
        <p className="mb-4 text-xs text-gray-400">Estimasi dihitung dari rata-rata penjualan</p>
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <EmptyIcon
            src="/src/assets/icons/stoktercatat-kosong.png"
            alt="Belum ada data stok tercatat"
            fallbackEmoji="📦"
          />
          <p className="font-semibold text-gray-700">Belum ada data stok tercatat</p>
          <p className="text-xs text-gray-400">
            Tambahkan data stok barang melalui menu "Stok"
          </p>
        </div>
      </div>
    );
  }

  // Urutkan item dari sisa hari terkecil (kritis) ke terbesar (aman)
  const sortedItems = [...items].sort((a, b) => a.sisaHari - b.sisaHari);

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-semibold text-gray-800">Estimasi Ketahanan Stok</h3>
      <p className="mb-4 text-xs text-gray-400">Estimasi dihitung dari rata-rata penjualan</p>

      <div className="space-y-3">
        {sortedItems.map((item) => {
          const persentase = Math.min(100, (item.sisaHari / item.maxHari) * 100);
          return (
            <div key={item.nama} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm text-gray-700">{item.nama}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${warnaBar(item.sisaHari)}`}
                  style={{ width: `${persentase}%` }}
                />
              </div>
              <span className={`w-14 shrink-0 text-right text-xs font-medium ${warnaTeks(item.sisaHari)}`}>
                {item.sisaHari} Hari
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
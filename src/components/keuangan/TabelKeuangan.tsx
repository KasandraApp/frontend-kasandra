import type { TransaksiKeuangan } from "../../types/models";
import { formatRupiah } from "../../utils/formatRupiah";

interface TabelKeuanganProps {
  data: TransaksiKeuangan[];
}

export function TabelKeuangan({ data }: TabelKeuanganProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
        Belum ada transaksi. Tambahkan lewat form di atas.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Jenis</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3 text-right">Jumlah</th>
            <th className="px-4 py-3">Catatan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, idx) => (
            <tr key={item.id ?? idx}>
              <td className="px-4 py-3 text-gray-600">{item.tanggal}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.jenis === "pemasukan"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {item.jenis}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{item.kategori}</td>
              <td className="px-4 py-3 text-right font-medium text-gray-800">
                {formatRupiah(item.jumlah)}
              </td>
              <td className="px-4 py-3 text-gray-400">{item.catatan ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

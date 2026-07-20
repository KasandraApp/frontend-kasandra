import type { StokBarang } from "../../types/models";

interface TabelStokProps {
  data: StokBarang[];
}

export function TabelStok({ data }: TabelStokProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
        Belum ada data stok. Tambahkan lewat form di atas.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
          <tr>
            <th className="px-4 py-3">Nama Barang</th>
            <th className="px-4 py-3 text-right">Stok Saat Ini</th>
            <th className="px-4 py-3 text-right">Rata-rata Terjual/Hari</th>
            <th className="px-4 py-3 text-right">Estimasi Habis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, idx) => {
            const sisaHari =
              item.rataRataTerjualPerHari > 0
                ? Math.floor(item.jumlahStok / item.rataRataTerjualPerHari)
                : Infinity;
            const kritis = sisaHari < 3;

            return (
              <tr key={item.id ?? idx}>
                <td className="px-4 py-3 text-gray-800">{item.namaBarang}</td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {item.jumlahStok} {item.satuan}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {item.rataRataTerjualPerHari} {item.satuan}/hari
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      kritis ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {sisaHari === Infinity ? "-" : `${sisaHari} hari lagi`}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

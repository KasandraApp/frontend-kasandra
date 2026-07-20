import { useState } from "react";
import { FormInputKeuangan } from "../components/keuangan/FormInputKeuangan";
import { TabelKeuangan } from "../components/keuangan/TabelKeuangan";
import type { TransaksiKeuangan } from "../types/models";

export default function InputKeuangan() {
  // State lokal dulu — nanti diganti fetch/mutate ke keuanganService.ts pas backend siap
  const [daftarTransaksi, setDaftarTransaksi] = useState<TransaksiKeuangan[]>([]);

  function handleTambahTransaksi(data: TransaksiKeuangan) {
    setDaftarTransaksi((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
    // TODO: ganti ke keuanganService.simpanTransaksi(data) begitu API tersedia
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Input Keuangan</h1>
        <p className="text-sm text-gray-500">Catat pemasukan dan pengeluaran harian UMKM</p>
      </div>

      <FormInputKeuangan onSubmit={handleTambahTransaksi} />
      <TabelKeuangan data={daftarTransaksi} />
    </div>
  );
}

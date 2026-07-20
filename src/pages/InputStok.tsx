import { useState } from "react";
import { FormInputStok } from "../components/stok/FormInputStok";
import { TabelStok } from "../components/stok/TabelStok";
import type { StokBarang } from "../types/models";

export default function InputStok() {
  // State lokal dulu — nanti diganti fetch/mutate ke stokService.ts pas backend siap
  const [daftarStok, setDaftarStok] = useState<StokBarang[]>([]);

  function handleTambahStok(data: StokBarang) {
    setDaftarStok((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
    // TODO: ganti ke stokService.simpanStok(data) begitu API tersedia
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Input Stok Barang</h1>
        <p className="text-sm text-gray-500">Catat stok dan rata-rata penjualan harian</p>
      </div>

      <FormInputStok onSubmit={handleTambahStok} />
      <TabelStok data={daftarStok} />
    </div>
  );
}

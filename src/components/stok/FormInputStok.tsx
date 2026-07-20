import { useState, type FormEvent } from "react";
import type { StokBarang } from "../../types/models";

interface FormInputStokProps {
  onSubmit: (data: StokBarang) => void;
}

export function FormInputStok({ onSubmit }: FormInputStokProps) {
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlahStok, setJumlahStok] = useState("");
  const [rataRataTerjual, setRataRataTerjual] = useState("");
  const [satuan, setSatuan] = useState("pcs");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!namaBarang.trim()) {
      setError("Nama barang wajib diisi");
      return;
    }
    const stokNumerik = Number(jumlahStok);
    const rataRataNumerik = Number(rataRataTerjual);

    if (!jumlahStok || stokNumerik < 0) {
      setError("Jumlah stok tidak valid");
      return;
    }
    if (!rataRataTerjual || rataRataNumerik <= 0) {
      setError("Rata-rata terjual per hari harus lebih dari 0");
      return;
    }

    onSubmit({
      namaBarang: namaBarang.trim(),
      jumlahStok: stokNumerik,
      rataRataTerjualPerHari: rataRataNumerik,
      satuan,
    });

    // reset form
    setNamaBarang("");
    setJumlahStok("");
    setRataRataTerjual("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Input Stok Barang</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Nama Barang</label>
          <input
            type="text"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            placeholder="Contoh: Tepung Terigu"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Jumlah Stok Saat Ini</label>
          <input
            type="number"
            min="0"
            value={jumlahStok}
            onChange={(e) => setJumlahStok(e.target.value)}
            placeholder="Contoh: 100"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Satuan</label>
          <select
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="pcs">pcs</option>
            <option value="kg">kg</option>
            <option value="liter">liter</option>
            <option value="dus">dus</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Rata-rata Terjual per Hari
          </label>
          <input
            type="number"
            min="0"
            value={rataRataTerjual}
            onChange={(e) => setRataRataTerjual(e.target.value)}
            placeholder="Contoh: 5"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Simpan Stok
      </button>
    </form>
  );
}

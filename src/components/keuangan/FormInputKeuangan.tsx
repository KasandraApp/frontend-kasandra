import { useState, type FormEvent } from "react";
import type { TransaksiKeuangan } from "../../types/models";

interface FormInputKeuanganProps {
  onSubmit: (data: TransaksiKeuangan) => void;
}

const KATEGORI_PEMASUKAN = ["Penjualan", "Modal Tambahan", "Lainnya"];
const KATEGORI_PENGELUARAN = ["Bahan Baku", "Operasional", "Gaji", "Sewa", "Lainnya"];

export function FormInputKeuangan({ onSubmit }: FormInputKeuanganProps) {
  const [jenis, setJenis] = useState<"pemasukan" | "pengeluaran">("pemasukan");
  const [kategori, setKategori] = useState(KATEGORI_PEMASUKAN[0]);
  const [jumlah, setJumlah] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");

  const daftarKategori = jenis === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

  function handleJenisChange(jenisBaru: "pemasukan" | "pengeluaran") {
    setJenis(jenisBaru);
    // reset kategori sesuai jenis biar ga nyangkut kategori yang ga relevan
    setKategori(jenisBaru === "pemasukan" ? KATEGORI_PEMASUKAN[0] : KATEGORI_PENGELUARAN[0]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const jumlahNumerik = Number(jumlah);
    if (!jumlah || jumlahNumerik <= 0) {
      setError("Jumlah harus diisi dan lebih dari 0");
      return;
    }
    if (!tanggal) {
      setError("Tanggal wajib diisi");
      return;
    }

    onSubmit({
      tanggal,
      jenis,
      kategori,
      jumlah: jumlahNumerik,
      catatan: catatan || undefined,
    });

    // reset form setelah submit sukses
    setJumlah("");
    setCatatan("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Input Transaksi Keuangan</h3>

      {/* Toggle jenis */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => handleJenisChange("pemasukan")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            jenis === "pemasukan"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => handleJenisChange("pengeluaran")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            jenis === "pengeluaran"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pengeluaran
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {daftarKategori.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Jumlah (Rp)</label>
          <input
            type="number"
            min="0"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            placeholder="Contoh: 150000"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Catatan (opsional)</label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Beli tepung 10kg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Simpan Transaksi
      </button>
    </form>
  );
}

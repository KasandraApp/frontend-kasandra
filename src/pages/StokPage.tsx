import { useState } from "react";
import type { StokBarang } from "../types/models";
import { ConfirmDeleteModal } from "../components/shared/ConfirmDeleteModal";
import { useDataStore } from "../store/DataStore";
import { useUser } from "../store/UserContext";
import { EmptyIcon } from "../components/shared/EmptyIcon";

const ICON_EDIT = "/src/assets/icons/edit.png";
const ICON_HAPUS = "/src/assets/icons/hapus.png";

function IconButton({ src, alt }: { src: string; alt: string }) {
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

export default function StokPage() {
  const { stok, tambahStok, updateStok, hapusStok } = useDataStore();
  const { namaLengkap } = useUser();

  // form stok
  const [namaBarang, setNamaBarang] = useState("");
  const [satuan, setSatuan] = useState("kg");
  const [jumlahStok, setJumlahStok] = useState("");
  const [rataJual, setRataJual] = useState("");

  const [editStokId, setEditStokId] = useState<string | null>(null);
  const [hapusTarget, setHapusTarget] = useState<{ id: string; nama: string } | null>(null);

  const formValid = Boolean(
    namaBarang.trim() && satuan && jumlahStok !== "" && rataJual !== "" && Number(rataJual) > 0
  );

  function handleSubmitStok() {
    if (!formValid) return;
    tambahStok({
      namaBarang,
      satuan,
      jumlahStok: Number(jumlahStok),
      rataRataTerjualPerHari: Number(rataJual),
    });
    setNamaBarang("");
    setJumlahStok("");
    setRataJual("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, <span className="text-[#e8b93d]">{namaLengkap}!</span>
        </h1>
      </div>

      {/* Form input - full width di atas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-800">Input Data Stok</h3>
        <p className="mb-4 text-xs text-gray-400">Catat stok barang</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Nama Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              placeholder="Contoh: Ayam Betutu"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Satuan <span className="text-red-500">*</span>
            </label>
            <select
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="pcs">pcs</option>
              <option value="liter">liter</option>
              <option value="unit">unit</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Jumlah Stok <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={jumlahStok}
              onChange={(e) => setJumlahStok(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Rata-rata Penjualan/Hari <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={rataJual}
              onChange={(e) => setRataJual(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmitStok}
          disabled={!formValid}
          className="mt-4 w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white transition hover:bg-[#44601f] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:px-8"
        >
          + Tambah Stok
        </button>
        {!formValid && (
          <p className="mt-2 text-xs text-gray-400">
            Lengkapi semua kolom bertanda <span className="text-red-500">*</span> untuk menambah stok.
          </p>
        )}
      </div>

      {/* Riwayat - full width di bawah, memanjang */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-gray-700">Daftar Stok ({stok.length})</p>

        {stok.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#e8b93d]/60 py-14 text-center">
            <EmptyIcon
              src="/src/assets/icons/stok-kosong.png"
              alt="Belum ada data stok"
              fallbackEmoji="📦"
            />
            <p className="font-semibold text-gray-700">Belum ada data stok</p>
            <p className="text-xs text-gray-400">Stok yang kamu tambahkan akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stok.map((s) => {
              const sisaHari =
                s.rataRataTerjualPerHari > 0
                  ? Math.floor(s.jumlahStok / s.rataRataTerjualPerHari)
                  : Infinity;
              const kritis = sisaHari < 3;

              return editStokId === s.id ? (
                <BarisEditStok
                  key={s.id}
                  data={s}
                  onSimpan={(data) => {
                    updateStok(s.id!, data);
                    setEditStokId(null);
                  }}
                  onBatal={() => setEditStokId(null)}
                />
              ) : (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-[#e8b93d]/40 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.namaBarang}</p>
                    <p className="text-xs text-gray-400">
                      {s.jumlahStok} {s.satuan} - {s.rataRataTerjualPerHari}/hari
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        kritis ? "bg-red-100 text-[#dc2626]" : "bg-green-100 text-[#557235]"
                      }`}
                    >
                      {sisaHari === Infinity ? "-" : `${sisaHari} hari`}
                    </span>
                    <button
                      onClick={() => setEditStokId(s.id!)}
                      aria-label="Edit"
                      className="text-gray-400 hover:opacity-70"
                    >
                      <IconButton src={ICON_EDIT} alt="Edit" />
                    </button>
                    <button
                      onClick={() => setHapusTarget({ id: s.id!, nama: s.namaBarang })}
                      aria-label="Hapus"
                      className="text-gray-400 hover:opacity-70"
                    >
                      <IconButton src={ICON_HAPUS} alt="Hapus" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hapusTarget && (
        <ConfirmDeleteModal
          namaItem={hapusTarget.nama}
          tipeItem="Stok"
          onBatal={() => setHapusTarget(null)}
          onHapus={() => {
            hapusStok(hapusTarget.id);
            setHapusTarget(null);
          }}
        />
      )}
    </div>
  );
}

function BarisEditStok({
  data,
  onSimpan,
  onBatal,
}: {
  data: StokBarang;
  onSimpan: (data: StokBarang) => void;
  onBatal: () => void;
}) {
  const [namaBarang, setNamaBarang] = useState(data.namaBarang);
  const [satuan, setSatuan] = useState(data.satuan);
  const [jumlahStok, setJumlahStok] = useState(String(data.jumlahStok));
  const [rataJual, setRataJual] = useState(String(data.rataRataTerjualPerHari));

  const formValid = Boolean(
    namaBarang.trim() && satuan && jumlahStok !== "" && rataJual !== "" && Number(rataJual) > 0
  );

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#557235]/40 bg-gray-50 px-3 py-2">
      <input
        type="text"
        value={namaBarang}
        onChange={(e) => setNamaBarang(e.target.value)}
        className="w-28 rounded-md border border-gray-300 px-2 py-1 text-xs"
      />
      <select
        value={satuan}
        onChange={(e) => setSatuan(e.target.value)}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
      >
        <option value="kg">kg</option>
        <option value="pcs">pcs</option>
        <option value="liter">liter</option>
        <option value="unit">unit</option>
      </select>
      <input
        type="number"
        value={jumlahStok}
        onChange={(e) => setJumlahStok(e.target.value)}
        className="w-16 rounded-md border border-gray-300 px-2 py-1 text-xs"
      />
      <input
        type="number"
        value={rataJual}
        onChange={(e) => setRataJual(e.target.value)}
        className="w-16 rounded-md border border-gray-300 px-2 py-1 text-xs"
      />
      <button
        onClick={() =>
          onSimpan({
            namaBarang,
            satuan,
            jumlahStok: Number(jumlahStok),
            rataRataTerjualPerHari: Number(rataJual),
          })
        }
        disabled={!formValid}
        className="text-green-600 hover:text-green-700 disabled:opacity-30"
        aria-label="Simpan"
      >
        ✓
      </button>
      <button onClick={onBatal} className="text-red-500 hover:text-red-600" aria-label="Batal">
        ✕
      </button>
    </div>
  );
}

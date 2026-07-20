import { useState } from "react";
import type { TransaksiKeuangan, StokBarang } from "../types/models";
import { ConfirmDeleteModal } from "../components/shared/ConfirmDeleteModal";
import { formatRupiah } from "../utils/formatRupiah";

type Tab = "keuangan" | "stok";

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

export default function InputDataPage() {
  const [tabAktif, setTabAktif] = useState<Tab>("keuangan");

  const [daftarTransaksi, setDaftarTransaksi] = useState<TransaksiKeuangan[]>([
    { id: "t1", tanggal: "2026-07-13", jenis: "pengeluaran", kategori: "Sewa", jumlah: 677_000 },
    { id: "t2", tanggal: "2026-07-13", jenis: "pemasukan", kategori: "Penjualan", jumlah: 677_000 },
  ]);

  const [daftarStok, setDaftarStok] = useState<StokBarang[]>([
    { id: "s1", namaBarang: "Ayam Penyet", satuan: "kg", jumlahStok: 6, rataRataTerjualPerHari: 3 },
    { id: "s2", namaBarang: "Piring Plastik", satuan: "unit", jumlahStok: 100, rataRataTerjualPerHari: 5 },
  ]);

  // form transaksi
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jenis, setJenis] = useState<"pemasukan" | "pengeluaran">("pengeluaran");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");

  // form stok
  const [namaBarang, setNamaBarang] = useState("");
  const [satuan, setSatuan] = useState("kg");
  const [jumlahStok, setJumlahStok] = useState("");
  const [rataJual, setRataJual] = useState("");

  const [editTransaksiId, setEditTransaksiId] = useState<string | null>(null);
  const [editStokId, setEditStokId] = useState<string | null>(null);
  const [hapusTarget, setHapusTarget] = useState<
    { tipe: "transaksi" | "stok"; id: string; nama: string } | null
  >(null);

  function handleSubmitTransaksi() {
    if (!jumlah || !kategori) return;
    setDaftarTransaksi((prev) => [
      { tanggal, jenis, kategori, jumlah: Number(jumlah), id: crypto.randomUUID() },
      ...prev,
    ]);
    setKategori("");
    setJumlah("");
  }

  function handleSubmitStok() {
    if (!namaBarang || !jumlahStok || !rataJual) return;
    setDaftarStok((prev) => [
      {
        namaBarang,
        satuan,
        jumlahStok: Number(jumlahStok),
        rataRataTerjualPerHari: Number(rataJual),
        id: crypto.randomUUID(),
      },
      ...prev,
    ]);
    setNamaBarang("");
    setJumlahStok("");
    setRataJual("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, <span className="text-[#e8b93d]">Nama User!</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white lg:grid-cols-2">
        {/* Kolom kiri: form */}
        <div className="border-b border-gray-200 p-5 lg:border-b-0 lg:border-r">
          <h3 className="font-semibold text-gray-800">Input Data</h3>
          <p className="mb-4 text-xs text-gray-400">
            Catat transaksi keuangan dan stok barang harian
          </p>

          <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setTabAktif("keuangan")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                tabAktif === "keuangan" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"
              }`}
            >
              Keuangan
            </button>
            <button
              onClick={() => setTabAktif("stok")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                tabAktif === "stok" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"
              }`}
            >
              Stok Barang
            </button>
          </div>

          {tabAktif === "keuangan" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Tanggal</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Jenis</label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as "pemasukan" | "pengeluaran")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
                  >
                    <option value="pemasukan">Pemasukan</option>
                    <option value="pengeluaran">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
                  <input
                    type="text"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    placeholder="Penjualan"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="150000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitTransaksi}
                className="mt-4 w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f]"
              >
                + Tambah Transaksi
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    value={namaBarang}
                    onChange={(e) => setNamaBarang(e.target.value)}
                    placeholder="Contoh: Ayam Betutu 20ton"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Satuan</label>
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
                    Jumlah Stok
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
                    Rata Jual/Hari
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
                className="mt-4 w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f]"
              >
                + Tambah Stok
              </button>
            </>
          )}
        </div>

        {/* Kolom kanan: riwayat/daftar */}
        <div className="p-5">
          {tabAktif === "keuangan" ? (
            <>
              <p className="mb-3 text-sm font-medium text-gray-700">
                Riwayat Transaksi ({daftarTransaksi.length})
              </p>
              <div className="space-y-2">
                {daftarTransaksi.map((t) =>
                  editTransaksiId === t.id ? (
                    <BarisEditTransaksi
                      key={t.id}
                      data={t}
                      onSimpan={(data) => {
                        setDaftarTransaksi((prev) =>
                          prev.map((x) => (x.id === t.id ? { ...data, id: t.id } : x))
                        );
                        setEditTransaksiId(null);
                      }}
                      onBatal={() => setEditTransaksiId(null)}
                    />
                  ) : (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-lg border border-[#e8b93d]/40 bg-white px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{t.kategori}</p>
                        <p className="text-xs text-gray-400">{t.tanggal}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-semibold ${
                            t.jenis === "pemasukan" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.jenis === "pemasukan" ? "+" : "-"}
                          {formatRupiah(t.jumlah)}
                        </span>
                        <button
                          onClick={() => setEditTransaksiId(t.id!)}
                          aria-label="Edit"
                          className="text-gray-400 hover:opacity-70"
                        >
                          <IconButton src={ICON_EDIT} alt="Edit" />
                        </button>
                        <button
                          onClick={() =>
                            setHapusTarget({ tipe: "transaksi", id: t.id!, nama: t.kategori })
                          }
                          aria-label="Hapus"
                          className="text-gray-400 hover:opacity-70"
                        >
                          <IconButton src={ICON_HAPUS} alt="Hapus" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mb-3 text-sm font-medium text-gray-700">
                Daftar Stok ({daftarStok.length})
              </p>
              <div className="space-y-2">
                {daftarStok.map((s) => {
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
                        setDaftarStok((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...data, id: s.id } : x))
                        );
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
                          {s.jumlahStok} {s.satuan} — {s.rataRataTerjualPerHari}/hari
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            kritis ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
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
                          onClick={() =>
                            setHapusTarget({ tipe: "stok", id: s.id!, nama: s.namaBarang })
                          }
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
            </>
          )}
        </div>
      </div>

      {hapusTarget && (
        <ConfirmDeleteModal
          namaItem={hapusTarget.nama}
          tipeItem={hapusTarget.tipe === "transaksi" ? "Transaksi" : "Stok"}
          onBatal={() => setHapusTarget(null)}
          onHapus={() => {
            if (hapusTarget.tipe === "transaksi") {
              setDaftarTransaksi((prev) => prev.filter((t) => t.id !== hapusTarget.id));
            } else {
              setDaftarStok((prev) => prev.filter((s) => s.id !== hapusTarget.id));
            }
            setHapusTarget(null);
          }}
        />
      )}
    </div>
  );
}

function BarisEditTransaksi({
  data,
  onSimpan,
  onBatal,
}: {
  data: TransaksiKeuangan;
  onSimpan: (data: TransaksiKeuangan) => void;
  onBatal: () => void;
}) {
  const [tanggal, setTanggal] = useState(data.tanggal);
  const [jenis, setJenis] = useState(data.jenis);
  const [kategori, setKategori] = useState(data.kategori);
  const [jumlah, setJumlah] = useState(String(data.jumlah));

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#557235]/40 bg-gray-50 px-3 py-2">
      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
      />
      <select
        value={jenis}
        onChange={(e) => setJenis(e.target.value as "pemasukan" | "pengeluaran")}
        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
      >
        <option value="pemasukan">Pemasukan</option>
        <option value="pengeluaran">Pengeluaran</option>
      </select>
      <input
        type="text"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-xs"
      />
      <input
        type="number"
        value={jumlah}
        onChange={(e) => setJumlah(e.target.value)}
        className="w-20 rounded-md border border-gray-300 px-2 py-1 text-xs"
      />
      <button
        onClick={() => onSimpan({ tanggal, jenis, kategori, jumlah: Number(jumlah) })}
        className="text-green-600 hover:text-green-700"
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
        className="text-green-600 hover:text-green-700"
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

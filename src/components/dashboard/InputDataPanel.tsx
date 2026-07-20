import { useState } from "react";
import type { TransaksiKeuangan, StokBarang } from "../../types/models";
import { ConfirmDeleteModal } from "../shared/ConfirmDeleteModal";
import { formatRupiah } from "../../utils/formatRupiah";

type Tab = "keuangan" | "stok";

interface InputDataPanelProps {
  daftarTransaksi: TransaksiKeuangan[];
  daftarStok: StokBarang[];
  onTambahTransaksi: (data: TransaksiKeuangan) => void;
  onUpdateTransaksi: (id: string, data: TransaksiKeuangan) => void;
  onHapusTransaksi: (id: string) => void;
  onTambahStok: (data: StokBarang) => void;
  onUpdateStok: (id: string, data: StokBarang) => void;
  onHapusStok: (id: string) => void;
}

export function InputDataPanel({
  daftarTransaksi,
  daftarStok,
  onTambahTransaksi,
  onUpdateTransaksi,
  onHapusTransaksi,
  onTambahStok,
  onUpdateStok,
  onHapusStok,
}: InputDataPanelProps) {
  const [tabAktif, setTabAktif] = useState<Tab>("keuangan");

  // --- form tambah transaksi ---
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jenis, setJenis] = useState<"pemasukan" | "pengeluaran">("pengeluaran");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");

  // --- form tambah stok ---
  const [namaBarang, setNamaBarang] = useState("");
  const [satuan, setSatuan] = useState("kg");
  const [jumlahStok, setJumlahStok] = useState("");
  const [rataJual, setRataJual] = useState("");

  // --- state edit inline ---
  const [editTransaksiId, setEditTransaksiId] = useState<string | null>(null);
  const [editStokId, setEditStokId] = useState<string | null>(null);

  // --- state konfirmasi hapus ---
  const [hapusTarget, setHapusTarget] = useState<
    { tipe: "transaksi" | "stok"; id: string; nama: string } | null
  >(null);

  function handleSubmitTransaksi() {
    if (!jumlah || !kategori) return;
    onTambahTransaksi({
      tanggal,
      jenis,
      kategori,
      jumlah: Number(jumlah),
    });
    setKategori("");
    setJumlah("");
  }

  function handleSubmitStok() {
    if (!namaBarang || !jumlahStok || !rataJual) return;
    onTambahStok({
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
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-semibold text-gray-800">Input Data</h3>
      <p className="mb-4 text-xs text-gray-400">
        Catat transaksi keuangan dan stok barang harian
      </p>

      {/* Tab switch */}
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
                placeholder="10"
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

          <p className="mb-2 mt-5 text-sm font-medium text-gray-700">
            Riwayat Transaksi ({daftarTransaksi.length})
          </p>
          <div className="space-y-2">
            {daftarTransaksi.map((t) =>
              editTransaksiId === t.id ? (
                <BarisEditTransaksi
                  key={t.id}
                  data={t}
                  onSimpan={(data) => {
                    onUpdateTransaksi(t.id!, data);
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
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() =>
                        setHapusTarget({ tipe: "transaksi", id: t.id!, nama: t.kategori })
                      }
                      aria-label="Hapus"
                      className="text-gray-400 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
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

          <p className="mb-2 mt-5 text-sm font-medium text-gray-700">
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
                    onUpdateStok(s.id!, data);
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
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() =>
                        setHapusTarget({ tipe: "stok", id: s.id!, nama: s.namaBarang })
                      }
                      aria-label="Hapus"
                      className="text-gray-400 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {hapusTarget && (
        <ConfirmDeleteModal
          namaItem={hapusTarget.nama}
          tipeItem={hapusTarget.tipe === "transaksi" ? "Transaksi" : "Stok"}
          onBatal={() => setHapusTarget(null)}
          onHapus={() => {
            if (hapusTarget.tipe === "transaksi") onHapusTransaksi(hapusTarget.id);
            else onHapusStok(hapusTarget.id);
            setHapusTarget(null);
          }}
        />
      )}
    </div>
  );
}

// --- Sub-komponen: baris edit inline transaksi ---
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
        onClick={() =>
          onSimpan({ tanggal, jenis, kategori, jumlah: Number(jumlah) })
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

// --- Sub-komponen: baris edit inline stok ---
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

import { useState } from "react";
import type { TransaksiKeuangan } from "../types/models";
import { ConfirmDeleteModal } from "../components/shared/ConfirmDeleteModal";
import { RupiahInput } from "../components/shared/RupiahInput";
import { formatRupiah } from "../utils/formatRupiah";
import { useDataStore } from "../store/DataStore";
import { useUser } from "../store/UserContext";
import { EmptyIcon } from "../components/shared/EmptyIcon";

const ICON_EDIT = "/assets/icons/edit.png";
const ICON_HAPUS = "/assets/icons/hapus.png";

const KATEGORI_PEMASUKAN = ["Penjualan", "Pinjaman", "Modal Tambahan", "Lainnya"];
const KATEGORI_PENGELUARAN = [
  "Gaji",
  "Maintenance",
  "Operasional",
  "Sewa",
  "Transportasi",
  "Utilitas",
  "Lainnya",
];

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

export default function KeuanganPage() {
  const { transaksi, tambahTransaksi, updateTransaksi, hapusTransaksi } = useDataStore();
  const { namaLengkap } = useUser();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jenis, setJenis] = useState<"pemasukan" | "pengeluaran">("pengeluaran");
  const [kategori, setKategori] = useState("");
  const [kategoriLainnya, setKategoriLainnya] = useState("");
  const [jumlah, setJumlah] = useState(0);

  const [editTransaksiId, setEditTransaksiId] = useState<string | null>(null);
  const [hapusTarget, setHapusTarget] = useState<{ id: string; nama: string } | null>(null);

  const daftarKategori = jenis === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
  const kategoriFinal = kategori === "Lainnya" ? kategoriLainnya.trim() : kategori;

  const formValid = Boolean(tanggal && jenis && kategoriFinal && jumlah > 0);

  function handleJenisChange(jenisBaru: "pemasukan" | "pengeluaran") {
    setJenis(jenisBaru);
    setKategori("");
    setKategoriLainnya("");
  }

  function handleSubmitTransaksi() {
    if (!formValid) return;
    tambahTransaksi({ tanggal, jenis, kategori: kategoriFinal, jumlah });
    setKategori("");
    setKategoriLainnya("");
    setJumlah(0);
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
        <h3 className="font-semibold text-gray-800">Input Data Keuangan</h3>
        <p className="mb-4 text-xs text-gray-400">Catat pemasukan dan pengeluaran harian</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Jenis <span className="text-red-500">*</span>
            </label>
            <select
              value={jenis}
              onChange={(e) => handleJenisChange(e.target.value as "pemasukan" | "pengeluaran")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            >
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {daftarKategori.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Nominal (Rp) <span className="text-red-500">*</span>
            </label>
            <RupiahInput value={jumlah} onChange={setJumlah} placeholder="150.000" />
          </div>

          {/* Field custom, cuma muncul kalau kategori "Lainnya" dipilih */}
          {kategori === "Lainnya" && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Sebutkan Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={kategoriLainnya}
                onChange={(e) => setKategoriLainnya(e.target.value)}
                placeholder="Contoh: Parkir, Donasi, dll"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmitTransaksi}
          disabled={!formValid}
          className="mt-4 w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white transition hover:bg-[#44601f] disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:px-8"
        >
          + Tambah Transaksi
        </button>
        {!formValid && (
          <p className="mt-2 text-xs text-gray-400">
            Lengkapi semua kolom bertanda <span className="text-red-500">*</span> untuk menambah transaksi.
          </p>
        )}
      </div>

      {/* Riwayat - full width di bawah, memanjang */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-gray-700">
          Riwayat Transaksi ({transaksi.length})
        </p>

        {transaksi.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#e8b93d]/60 py-14 text-center">
            <EmptyIcon
              src="/assets/icons/transaksi-kosong.png"
              alt="Belum ada data transaksi"
              fallbackEmoji="🧾"
            />
            <p className="font-semibold text-gray-700">Belum ada data transaksi</p>
            <p className="text-xs text-gray-400">Transaksi yang kamu tambahkan akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transaksi.map((t) =>
              editTransaksiId === t.id ? (
                <BarisEditTransaksi
                  key={t.id}
                  data={t}
                  onSimpan={(data) => {
                    updateTransaksi(t.id!, data);
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
                        t.jenis === "pemasukan" ? "text-[#557235]" : "text-[#dc2626]"
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
                      onClick={() => setHapusTarget({ id: t.id!, nama: t.kategori })}
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
        )}
      </div>

      {hapusTarget && (
        <ConfirmDeleteModal
          namaItem={hapusTarget.nama}
          tipeItem="Transaksi"
          onBatal={() => setHapusTarget(null)}
          onHapus={() => {
            hapusTransaksi(hapusTarget.id);
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
  const [jumlah, setJumlah] = useState(data.jumlah);

  const daftarKategori = jenis === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
  // kategori data lama mungkin custom/"Lainnya" yang gak ada di daftar standar
  const kategoriAdaDiDaftar = daftarKategori.includes(kategori);
  const [pakaiLainnya, setPakaiLainnya] = useState(!kategoriAdaDiDaftar);
  const [kategoriLainnya, setKategoriLainnya] = useState(kategoriAdaDiDaftar ? "" : kategori);

  const kategoriFinal = pakaiLainnya ? kategoriLainnya.trim() : kategori;
  const formValid = Boolean(tanggal && kategoriFinal && jumlah > 0);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#557235]/40 bg-gray-50 px-3 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs"
        />
        <select
          value={jenis}
          onChange={(e) => {
            const j = e.target.value as "pemasukan" | "pengeluaran";
            setJenis(j);
            setKategori("");
            setPakaiLainnya(false);
          }}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs"
        >
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
        <select
          value={pakaiLainnya ? "Lainnya" : kategori}
          onChange={(e) => {
            if (e.target.value === "Lainnya") {
              setPakaiLainnya(true);
            } else {
              setPakaiLainnya(false);
              setKategori(e.target.value);
            }
          }}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs"
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {daftarKategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <div className="w-28">
          <RupiahInput value={jumlah} onChange={setJumlah} className="!py-1 !text-xs" />
        </div>
        <button
          onClick={() => onSimpan({ tanggal, jenis, kategori: kategoriFinal, jumlah })}
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
      {pakaiLainnya && (
        <input
          type="text"
          value={kategoriLainnya}
          onChange={(e) => setKategoriLainnya(e.target.value)}
          placeholder="Sebutkan kategori"
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
        />
      )}
    </div>
  );
}

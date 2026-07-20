import { useMemo } from "react";
import { useUser } from "../store/UserContext";
import { AlertBanners } from "../components/dashboard/AlertBanners";
import { CashProjectionChart } from "../components/dashboard/CashProjectionChart";
import { StatCards } from "../components/dashboard/StatCards";
import { StokKetahananCard } from "../components/dashboard/StokKetahananCard";
import { WhatIfPanel } from "../components/dashboard/WhatIfPanel";
import { useDataStore } from "../store/DataStore";
import type { DataPoin } from "../utils/kalkulasiLinier";

export default function Dashboard() {
  const { transaksi, stok } = useDataStore();
  const { namaLengkap } = useUser();

  const kasSaatIni = useMemo(
    () =>
      transaksi.reduce(
        (total, t) => total + (t.jenis === "pemasukan" ? t.jumlah : -t.jumlah),
        0
      ),
    [transaksi]
  );

  // Rata-rata pemasukan & pengeluaran harian, dihitung dari jumlah hari unik yang tercatat
  const { rataPemasukanHarian, rataPengeluaranHarian } = useMemo(() => {
    if (transaksi.length === 0) return { rataPemasukanHarian: 0, rataPengeluaranHarian: 0 };
    const hariUnik = new Set(transaksi.map((t) => t.tanggal)).size || 1;
    const totalPemasukan = transaksi
      .filter((t) => t.jenis === "pemasukan")
      .reduce((a, t) => a + t.jumlah, 0);
    const totalPengeluaran = transaksi
      .filter((t) => t.jenis === "pengeluaran")
      .reduce((a, t) => a + t.jumlah, 0);
    return {
      rataPemasukanHarian: Math.round(totalPemasukan / hariUnik),
      rataPengeluaranHarian: Math.round(totalPengeluaran / hariUnik),
    };
  }, [transaksi]);

  const dataKas: DataPoin[] = useMemo(() => {
    if (transaksi.length === 0) return [];
    const netHarian = rataPemasukanHarian - rataPengeluaranHarian;
    const data: DataPoin[] = [];
    let saldo = kasSaatIni;
    const hariIni = new Date();
    for (let i = 0; i < 30; i++) {
      const tanggal = new Date(hariIni);
      tanggal.setDate(hariIni.getDate() + i);
      data.push({ tanggal: tanggal.toISOString().split("T")[0], nilai: Math.round(saldo) });
      saldo += netHarian;
    }
    return data;
  }, [transaksi.length, kasSaatIni, rataPemasukanHarian, rataPengeluaranHarian]);

  const proyeksi30Hari = dataKas.length > 0 ? dataKas[dataKas.length - 1].nilai : 0;
  const hariDefisit = dataKas.findIndex((d) => d.nilai < 0);

  const itemStokKetahanan = useMemo(
    () =>
      stok.map((s) => ({
        nama: s.namaBarang,
        sisaHari:
          s.rataRataTerjualPerHari > 0
            ? Math.floor(s.jumlahStok / s.rataRataTerjualPerHari)
            : 99,
        maxHari: 10,
      })),
    [stok]
  );

  const itemStokKritis = itemStokKetahanan.filter((i) => i.sisaHari < 3);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, <span className="text-[#e8b93d]">{namaLengkap}!</span>
        </h1>
        <p className="text-sm text-gray-500">Lihat kondisi usahamu hari ini.</p>
      </div>

      <AlertBanners
        kasWarning={
          proyeksi30Hari < 0 && hariDefisit !== -1
            ? {
                title: `Kas Diperkirakan Menipis dalam ${Math.ceil((hariDefisit + 1) / 7)} Minggu`,
                desc: `Proyeksi defisit di H+${hariDefisit}. Perlu evaluasi biaya operasional.`,
              }
            : null
        }
        stokWarning={
          itemStokKritis.length > 0
            ? {
                title: `${itemStokKritis.length} Item Stok Kritis. Segera Isi Ulang dalam <3 Hari`,
                desc: `${itemStokKritis.length} item (${itemStokKritis
                  .map((i) => i.nama)
                  .join(" & ")}) diperkirakan habis dalam kurang dari 3 hari.`,
              }
            : null
        }
      />

      {/* Kolom kiri (stat cards) & kanan (chart) disamain tingginya biar ga keliatan
          dempet/kosong sebelah - pakai items-stretch di grid-nya. */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StatCards
            kasSaatIni={kasSaatIni}
            perubahanMingguLalu={12.4}
            proyeksi30Hari={proyeksi30Hari}
            hariDefisit={hariDefisit !== -1 ? hariDefisit : undefined}
          />
        </div>
        <div className="lg:col-span-2">
          <CashProjectionChart data={dataKas} />
        </div>
      </div>

      <StokKetahananCard items={itemStokKetahanan} />

      <WhatIfPanel
        kasSaatIni={kasSaatIni}
        rataPemasukanHarian={rataPemasukanHarian}
        rataPengeluaranHarian={rataPengeluaranHarian}
        adaData={transaksi.length > 0}
      />
    </div>
  );
}

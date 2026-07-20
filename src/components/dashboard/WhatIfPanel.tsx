import { useState, useMemo } from "react";
import { formatRupiah } from "../../utils/formatRupiah";
import { SliderDuaArah } from "./SliderDuaArah";

interface WhatIfPanelProps {
  kasSaatIni: number;
  rataPemasukanHarian: number;
  rataPengeluaranHarian: number;
  adaData: boolean;
}

function RataRataSimulasi({
  label,
  basis,
  perubahanPersen,
}: {
  label: string;
  basis: number;
  perubahanPersen: number;
}) {
  const simulasi = basis * (1 + perubahanPersen / 100);
  const naik = perubahanPersen > 0;
  const turun = perubahanPersen < 0;
  const warna = naik ? "text-[#557235]" : turun ? "text-[#dc2626]" : "text-gray-800";

  return (
    <div>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className={`mt-1 text-lg font-bold ${warna}`}>{formatRupiah(Math.round(simulasi))}</p>
      {perubahanPersen !== 0 && (
        <p className={`text-[11px] ${warna}`}>
          {naik ? "Lebih tinggi" : "Lebih rendah"} {Math.abs(perubahanPersen)}% dari sebelumnya
        </p>
      )}
    </div>
  );
}

export function WhatIfPanel({
  kasSaatIni,
  rataPemasukanHarian,
  rataPengeluaranHarian,
  adaData,
}: WhatIfPanelProps) {
  // Kedua slider dua arah: + = naik, - = turun (konsisten buat keduanya)
  const [perubahanPengeluaran, setPerubahanPengeluaran] = useState(0);
  const [perubahanPemasukan, setPerubahanPemasukan] = useState(0);

  const hasilSimulasi = useMemo(() => {
    const pemasukanHarian = rataPemasukanHarian * (1 + perubahanPemasukan / 100);
    const pengeluaranHarian = rataPengeluaranHarian * (1 + perubahanPengeluaran / 100);
    const netHarian = pemasukanHarian - pengeluaranHarian;
    const estimasiKasH30 = kasSaatIni + netHarian * 30;
    const stabil = estimasiKasH30 >= kasSaatIni;
    return { estimasiKasH30, selisih: estimasiKasH30 - kasSaatIni, stabil };
  }, [perubahanPengeluaran, perubahanPemasukan, rataPemasukanHarian, rataPengeluaranHarian, kasSaatIni]);

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="font-semibold text-gray-800">Simulasi What-If</h3>
      <p className="mb-4 text-xs text-gray-400">Coba berbagai skenario dan lihat proyeksinya</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <SliderDuaArah
            label="Perubahan Pengeluaran"
            value={perubahanPengeluaran}
            onChange={setPerubahanPengeluaran}
            jenis="pengeluaran"
          />
          <SliderDuaArah
            label="Perubahan Pemasukan"
            value={perubahanPemasukan}
            onChange={setPerubahanPemasukan}
            jenis="pemasukan"
          />
        </div>

        <div className="space-y-4">
          {adaData ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <RataRataSimulasi
                  label="Rata-rata Pemasukan/Hari (Rp)"
                  basis={rataPemasukanHarian}
                  perubahanPersen={perubahanPemasukan}
                />
                <RataRataSimulasi
                  label="Rata-rata Pengeluaran/Hari (Rp)"
                  basis={rataPengeluaranHarian}
                  perubahanPersen={perubahanPengeluaran}
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Hasil Simulasi{" "}
                    <span className="text-xs text-gray-400">Estimasi Kas H+30</span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      hasilSimulasi.stabil
                        ? "bg-green-100 text-[#557235]"
                        : "bg-red-100 text-[#dc2626]"
                    }`}
                  >
                    {hasilSimulasi.stabil ? "↗ Skenario stabil" : "↘ Skenario berisiko"}
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    hasilSimulasi.estimasiKasH30 < 0 ? "text-[#dc2626]" : "text-[#557235]"
                  }`}
                >
                  {formatRupiah(hasilSimulasi.estimasiKasH30)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {hasilSimulasi.selisih >= 0 ? "Naik" : "Turun"}{" "}
                  {formatRupiah(Math.abs(hasilSimulasi.selisih))} dari proyeksi awal.
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm font-semibold text-gray-600">
                Tes berbagai skenario untuk persiapan lebih baik
              </p>
              <p className="text-xs text-gray-400">
                Hasil simulasi bakal muncul di sini setelah ada data transaksi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

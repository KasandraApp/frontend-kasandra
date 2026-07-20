// Epic 3: Simulasi What-If — Logika Kalkulasi Linier
// Catatan: sesuai arahan PM, TIDAK pakai Machine Learning.
// Cukup kalkulasi matematika linier buat proyeksi grafik.

export interface DataPoin {
  tanggal: string; // format: "2026-07-01"
  nilai: number;
}

/**
 * Menghitung ulang proyeksi berdasarkan persentase perubahan dari slider.
 * @param dataAsli - data historis/proyeksi awal (sebelum simulasi)
 * @param persentaseFaktor - nilai slider, misal 20 artinya naik 20%
 * @param tipe - "pengeluaran" akan MENGURANGI nilai kas, "stok" akan MENGURANGI sisa stok lebih cepat
 */
export function hitungProyeksiLinier(
  dataAsli: DataPoin[],
  persentaseFaktor: number,
  tipe: "kas" | "stok" = "kas"
): DataPoin[] {
  const faktorPengali = 1 + persentaseFaktor / 100;

  return dataAsli.map((titik, index) => {
    if (tipe === "kas") {
      // Simulasi: makin lama makin besar dampak kumulatifnya (linear terhadap waktu)
      const dampakKumulatif = (titik.nilai * (faktorPengali - 1) * index) / dataAsli.length;
      return {
        tanggal: titik.tanggal,
        nilai: Math.round(titik.nilai - dampakKumulatif),
      };
    } else {
      // Simulasi stok: makin cepat abis kalau faktor makin besar
      return {
        tanggal: titik.tanggal,
        nilai: Math.max(0, Math.round(titik.nilai / faktorPengali)),
      };
    }
  });
}

/**
 * Generate dummy data historis 30 hari ke depan buat testing chart
 * sebelum backend/API tersedia.
 */
export function generateDummyDataKas(saldoAwal = 10_000_000, rataRataKeluar = 250_000): DataPoin[] {
  const data: DataPoin[] = [];
  let saldo = saldoAwal;
  const hariIni = new Date();

  for (let i = 0; i < 30; i++) {
    const tanggal = new Date(hariIni);
    tanggal.setDate(hariIni.getDate() + i);
    saldo -= rataRataKeluar + (Math.random() * 50_000 - 25_000); // sedikit noise biar natural
    data.push({
      tanggal: tanggal.toISOString().split("T")[0],
      nilai: Math.round(saldo),
    });
  }
  return data;
}

export function generateDummyDataStok(stokAwal = 100, rataRataTerjual = 4): DataPoin[] {
  const data: DataPoin[] = [];
  let stok = stokAwal;
  const hariIni = new Date();

  for (let i = 0; i < 30; i++) {
    const tanggal = new Date(hariIni);
    tanggal.setDate(hariIni.getDate() + i);
    stok -= rataRataTerjual;
    data.push({
      tanggal: tanggal.toISOString().split("T")[0],
      nilai: Math.max(0, Math.round(stok)),
    });
  }
  return data;
}

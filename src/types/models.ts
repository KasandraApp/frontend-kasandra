// Tipe data dasar — dipakai bareng oleh form, tabel, dan service.
// Struktur ini disesuaikan biar gampang di-mapping ke response FastAPI nanti.

export interface TransaksiKeuangan {
  id?: string; // optional, di-generate backend
  tanggal: string; // ISO format "2026-07-14"
  jenis: "pemasukan" | "pengeluaran";
  kategori: string; // misal: "Penjualan", "Bahan Baku", "Operasional"
  jumlah: number;
  catatan?: string;
}

export interface StokBarang {
  id?: string;
  namaBarang: string;
  jumlahStok: number;
  rataRataTerjualPerHari: number;
  satuan: string; // misal: "pcs", "kg", "liter"
}

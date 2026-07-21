import type { StokBarang, TransaksiKeuangan } from '../types/models';

export function normalizeCashTransaction(raw: Record<string, unknown>): TransaksiKeuangan {
  return {
    id: typeof raw.id === 'string' ? raw.id : undefined,
    tanggal: typeof raw.transaction_date === 'string' ? raw.transaction_date : '',
    jenis: (raw.type === 'pengeluaran' || raw.type === 'expense') ? 'pengeluaran' : 'pemasukan',
    kategori: typeof raw.category === 'string' ? raw.category : '',
    jumlah: Number(raw.amount ?? 0),
    catatan: typeof raw.note === 'string' ? raw.note : undefined,
  };
}

export function normalizeInventoryItem(raw: Record<string, unknown>): StokBarang {
  return {
    id: typeof raw.id === 'string' ? raw.id : undefined,
    namaBarang: typeof raw.item_name === 'string' ? raw.item_name : '',
    jumlahStok: Number(raw.current_stock ?? 0),
    rataRataTerjualPerHari: Number(raw.average_sales_per_day ?? 0),
    satuan: typeof raw.unit === 'string' ? raw.unit : 'pcs',
  };
}

export function toBackendCashPayload(transaction: TransaksiKeuangan) {
  return {
    tanggal: transaction.tanggal,
    jenis: transaction.jenis,
    kategori: transaction.kategori,
    jumlah: transaction.jumlah,
    catatan: transaction.catatan,
  };
}

export function toBackendInventoryPayload(item: StokBarang) {
  return {
    namaBarang: item.namaBarang,
    jumlahStok: item.jumlahStok,
    rataRataTerjualPerHari: item.rataRataTerjualPerHari,
    satuan: item.satuan,
  };
}

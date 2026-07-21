import { describe, expect, it } from 'vitest';
import { normalizeCashTransaction, normalizeInventoryItem } from './dataAdapters';

describe('data adapters', () => {
  it('maps backend cash payload to the frontend transaction shape', () => {
    const backendTransaction = {
      id: 'tx-1',
      transaction_date: '2026-07-21',
      type: 'expense',
      category: 'Operasional',
      amount: '150000',
      note: 'Bensin',
    };

    expect(normalizeCashTransaction(backendTransaction)).toEqual({
      id: 'tx-1',
      tanggal: '2026-07-21',
      jenis: 'pengeluaran',
      kategori: 'Operasional',
      jumlah: 150000,
      catatan: 'Bensin',
    });
  });

  it('maps backend inventory payload to the frontend stock shape', () => {
    const backendItem = {
      id: 'stock-1',
      item_name: 'Ayam',
      current_stock: '12',
      average_sales_per_day: '3',
      unit: 'kg',
      minimum_threshold: '2',
    };

    expect(normalizeInventoryItem(backendItem)).toEqual({
      id: 'stock-1',
      namaBarang: 'Ayam',
      jumlahStok: 12,
      rataRataTerjualPerHari: 3,
      satuan: 'kg',
    });
  });
});

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TransaksiKeuangan, StokBarang } from "../types/models";
import { apiFetch } from "../utils/api";
import { normalizeCashTransaction, normalizeInventoryItem, toBackendCashPayload, toBackendInventoryPayload } from "./dataAdapters";

interface DataStoreValue {
  transaksi: TransaksiKeuangan[];
  stok: StokBarang[];
  isLoading: boolean;
  reloadData: () => Promise<void>;
  tambahTransaksi: (t: TransaksiKeuangan) => Promise<void>;
  updateTransaksi: (id: string, t: TransaksiKeuangan) => Promise<void>;
  hapusTransaksi: (id: string) => Promise<void>;
  tambahStok: (s: StokBarang) => Promise<void>;
  updateStok: (id: string, s: StokBarang) => Promise<void>;
  hapusStok: (id: string) => Promise<void>;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [transaksi, setTransaksi] = useState<TransaksiKeuangan[]>([]);
  const [stok, setStok] = useState<StokBarang[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function muatData() {
    setIsLoading(true);
    try {
      const [resTransaksi, resStok] = await Promise.all([
        apiFetch<{ transactions: Array<Record<string, unknown>> }>("/cash-transactions"),
        apiFetch<{ items: Array<Record<string, unknown>> }>("/inventory-items")
      ]);
      setTransaksi((resTransaksi.transactions || []).map((tx) => normalizeCashTransaction(tx)));
      setStok((resStok.items || []).map((item) => normalizeInventoryItem(item)));
    } catch (error) {
      console.error("Gagal memuat data dari backend:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Initial load
    muatData();
  }, []);

  async function tambahTransaksi(t: TransaksiKeuangan) {
    try {
      const created = await apiFetch<Record<string, unknown>>('/cash-transactions', {
        method: 'POST',
        body: JSON.stringify(toBackendCashPayload(t)),
      });
      const normalized = normalizeCashTransaction(created as Record<string, unknown>);
      setTransaksi((prev) => [normalized, ...prev]);
      await reloadData();
    } catch (e) {
      console.error(e);
      // Fallback update local state for better UX
      setTransaksi((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);
    }
  }

  async function updateTransaksi(id: string, t: TransaksiKeuangan) {
    try {
      await apiFetch(`/cash-transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toBackendCashPayload(t))
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTransaksi((prev) => prev.map((x) => (x.id === id ? { ...t, id } : x)));
      await reloadData();
    }
  }

  async function hapusTransaksi(id: string) {
    try {
      await apiFetch(`/cash-transactions/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    } finally {
      setTransaksi((prev) => prev.filter((x) => x.id !== id));
      await reloadData();
    }
  }

  async function tambahStok(s: StokBarang) {
    try {
      const res = await apiFetch<Record<string, unknown>>('/inventory-items', {
        method: 'POST',
        body: JSON.stringify(toBackendInventoryPayload(s))
      });
      const normalized = normalizeInventoryItem((res as { data?: Record<string, unknown> }).data || res);
      setStok((prev) => [normalized, ...prev]);
      await reloadData();
    } catch (e) {
      console.error(e);
      setStok((prev) => [{ ...s, id: crypto.randomUUID() }, ...prev]);
    }
  }

  async function updateStok(id: string, s: StokBarang) {
    try {
      await apiFetch(`/inventory-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toBackendInventoryPayload(s))
      });
    } catch (e) {
      console.error(e);
    } finally {
      setStok((prev) => prev.map((x) => (x.id === id ? { ...s, id } : x)));
      await reloadData();
    }
  }

  async function hapusStok(id: string) {
    try {
      await apiFetch(`/inventory-items/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    } finally {
      setStok((prev) => prev.filter((x) => x.id !== id));
      await reloadData();
    }
  }

  async function reloadData() {
    await muatData();
  }

  return (
    <DataStoreContext.Provider
      value={{
        transaksi,
        stok,
        isLoading,
        reloadData,
        tambahTransaksi,
        updateTransaksi,
        hapusTransaksi,
        tambahStok,
        updateStok,
        hapusStok,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore harus dipakai di dalam DataStoreProvider");
  return ctx;
}

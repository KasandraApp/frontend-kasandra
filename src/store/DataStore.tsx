import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { TransaksiKeuangan, StokBarang } from "../types/models";

interface DataStoreValue {
  transaksi: TransaksiKeuangan[];
  stok: StokBarang[];
  tambahTransaksi: (t: TransaksiKeuangan) => void;
  updateTransaksi: (id: string, t: TransaksiKeuangan) => void;
  hapusTransaksi: (id: string) => void;
  tambahStok: (s: StokBarang) => void;
  updateStok: (id: string, s: StokBarang) => void;
  hapusStok: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

const KUNCI_TRANSAKSI = "kasandra:transaksi";
const KUNCI_STOK = "kasandra:stok";

function muatDariStorage<T>(kunci: string): T[] {
  try {
    const raw = localStorage.getItem(kunci);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [transaksi, setTransaksi] = useState<TransaksiKeuangan[]>(() =>
    muatDariStorage<TransaksiKeuangan>(KUNCI_TRANSAKSI)
  );
  const [stok, setStok] = useState<StokBarang[]>(() => muatDariStorage<StokBarang>(KUNCI_STOK));

  useEffect(() => {
    localStorage.setItem(KUNCI_TRANSAKSI, JSON.stringify(transaksi));
  }, [transaksi]);

  useEffect(() => {
    localStorage.setItem(KUNCI_STOK, JSON.stringify(stok));
  }, [stok]);

  function tambahTransaksi(t: TransaksiKeuangan) {
    setTransaksi((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }
  function updateTransaksi(id: string, t: TransaksiKeuangan) {
    setTransaksi((prev) => prev.map((x) => (x.id === id ? { ...t, id } : x)));
  }
  function hapusTransaksi(id: string) {
    setTransaksi((prev) => prev.filter((x) => x.id !== id));
  }
  function tambahStok(s: StokBarang) {
    setStok((prev) => [{ ...s, id: crypto.randomUUID() }, ...prev]);
  }
  function updateStok(id: string, s: StokBarang) {
    setStok((prev) => prev.map((x) => (x.id === id ? { ...s, id } : x)));
  }
  function hapusStok(id: string) {
    setStok((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <DataStoreContext.Provider
      value={{
        transaksi,
        stok,
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

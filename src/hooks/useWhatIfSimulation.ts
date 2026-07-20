import { useState, useMemo, useCallback } from "react";
import { hitungProyeksiLinier, type DataPoin } from "../utils/kalkulasiLinier";

export function useWhatIfSimulation(dataAsli: DataPoin[], tipe: "kas" | "stok" = "kas") {
  const [persentaseFaktor, setPersentaseFaktor] = useState(0);

  // useMemo: kalkulasi ulang HANYA kalau dataAsli atau persentaseFaktor berubah.
  // Ini kunci utama biar slider ga lag — ga ngitung ulang tiap render yang ga perlu.
  const dataSimulasi = useMemo(
    () => hitungProyeksiLinier(dataAsli, persentaseFaktor, tipe),
    [dataAsli, persentaseFaktor, tipe]
  );

  const updateFaktor = useCallback((nilai: number) => {
    setPersentaseFaktor(nilai);
  }, []);

  return {
    persentaseFaktor,
    dataSimulasi,
    updateFaktor,
  };
}

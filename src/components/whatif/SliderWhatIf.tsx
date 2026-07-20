import { useState, useCallback } from "react";

interface SliderWhatIfProps {
  label: string;
  min?: number;
  max?: number;
  nilaiAwal?: number;
  onChange: (nilai: number) => void;
}

export function SliderWhatIf({
  label,
  min = 0,
  max = 50,
  nilaiAwal = 0,
  onChange,
}: SliderWhatIfProps) {
  // State lokal biar UI slider responsif duluan sebelum trigger kalkulasi ulang di parent
  const [nilai, setNilai] = useState(nilaiAwal);

  // useCallback: cegah fungsi ini dibuat ulang tiap render, biar child (kalau ada) ga ikut re-render
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nilaiBaru = Number(e.target.value);
      setNilai(nilaiBaru);
      onChange(nilaiBaru);
    },
    [onChange]
  );

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
          {nilai > 0 ? "+" : ""}
          {nilai}%
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={nilai}
        onChange={handleChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-600"
      />

      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}

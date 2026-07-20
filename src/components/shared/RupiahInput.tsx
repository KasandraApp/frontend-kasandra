import { useState, useEffect } from "react";

interface RupiahInputProps {
  value: number; // nilai asli (angka murni)
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

function formatRibuan(n: number): string {
  if (!n) return "";
  return n.toLocaleString("id-ID");
}

export function RupiahInput({
  value,
  onChange,
  placeholder = "0",
  className = "",
}: RupiahInputProps) {
  const [teks, setTeks] = useState(value ? String(value) : "");
  const [fokus, setFokus] = useState(false);

  // Kalau lagi tidak fokus, tampilkan versi terformat (mis. "1.500.000").
  // Kalau lagi fokus/diketik, tampilkan angka mentah biar gampang diedit.
  useEffect(() => {
    if (!fokus) {
      setTeks(value ? formatRibuan(value) : "");
    }
  }, [value, fokus]);

  function handleFocus() {
    setFokus(true);
    setTeks(value ? String(value) : "");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // hanya izinkan digit selagi user mengetik
    const angkaSaja = e.target.value.replace(/[^0-9]/g, "");
    setTeks(angkaSaja);
    onChange(angkaSaja ? Number(angkaSaja) : 0);
  }

  function handleBlur() {
    setFokus(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={teks}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#557235] focus:outline-none ${className}`}
      />
    </div>
  );
}

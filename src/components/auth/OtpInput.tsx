import { useRef, useState } from "react";

interface OtpInputProps {
  panjang?: number;
  onChange: (kode: string) => void;
}

export function OtpInput({ panjang = 6, onChange }: OtpInputProps) {
  const [nilai, setNilai] = useState<string[]>(Array(panjang).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, val: string) {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const nilaiBaru = [...nilai];
    nilaiBaru[idx] = digit;
    setNilai(nilaiBaru);
    onChange(nilaiBaru.join(""));

    if (digit && idx < panjang - 1) {
      refs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !nilai[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const teks = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, panjang);
    const nilaiBaru = Array(panjang).fill("");
    teks.split("").forEach((d, i) => (nilaiBaru[i] = d));
    setNilai(nilaiBaru);
    onChange(nilaiBaru.join(""));
    const idxTerakhir = Math.min(teks.length, panjang - 1);
    refs.current[idxTerakhir]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: panjang }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            refs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={nilai[idx]}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className="h-12 w-11 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:border-[#557235] focus:outline-none"
        />
      ))}
    </div>
  );
}

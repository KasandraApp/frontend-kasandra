import { useState, useRef } from "react";

interface SliderArahWarnaProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** "kanan-merah" = makin kanan makin merah, makin kiri makin ijo.
   *  "kanan-ijo" = makin kanan makin ijo, makin kiri makin merah. */
  arah: "kanan-merah" | "kanan-ijo";
}

// Interpolasi warna dari hijau ke merah (atau sebaliknya), makin ke ujung makin gelap/pekat
function hitungWarna(persen: number, arah: "kanan-merah" | "kanan-ijo") {
  // t = 0 di ujung hijau, t = 1 di ujung merah
  const t = arah === "kanan-merah" ? persen / 100 : 1 - persen / 100;

  // Hijau (#22c55e -> lebih gelap #15803d) menuju Merah (#f87171 -> lebih gelap #b91c1c)
  const hijauMuda = { r: 134, g: 239, b: 172 };
  const hijauGelap = { r: 21, g: 128, b: 61 };
  const merahMuda = { r: 252, g: 165, b: 165 };
  const merahGelap = { r: 185, g: 28, b: 28 };

  // Campur hijau->merah sesuai t, lalu campur muda->gelap sesuai jarak dari tengah (0.5)
  const r = hijauMuda.r + (merahMuda.r - hijauMuda.r) * t;
  const g = hijauMuda.g + (merahMuda.g - hijauMuda.g) * t;
  const b = hijauMuda.b + (merahMuda.b - hijauMuda.b) * t;

  const jarakDariTengah = Math.abs(t - 0.5) * 2; // 0 di tengah, 1 di ujung
  const gelapR = t < 0.5 ? hijauGelap.r : merahGelap.r;
  const gelapG = t < 0.5 ? hijauGelap.g : merahGelap.g;
  const gelapB = t < 0.5 ? hijauGelap.b : merahGelap.b;

  const finalR = Math.round(r + (gelapR - r) * jarakDariTengah);
  const finalG = Math.round(g + (gelapG - g) * jarakDariTengah);
  const finalB = Math.round(b + (gelapB - b) * jarakDariTengah);

  return `rgb(${finalR}, ${finalG}, ${finalB})`;
}

export function SliderArahWarna({ label, value, onChange, arah }: SliderArahWarnaProps) {
  const [sedangDrag, setSedangDrag] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const warna = hitungWarna(value, arah);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
      </div>

      <div className="relative">
        {/* Tooltip persentase — cuma muncul pas lagi di-drag */}
        {sedangDrag && (
          <div
            className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-md transition-all"
            style={{
              left: `${value}%`,
              backgroundColor: warna,
            }}
          >
            {value}%
          </div>
        )}

        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setSedangDrag(true)}
          onMouseUp={() => setSedangDrag(false)}
          onTouchStart={() => setSedangDrag(true)}
          onTouchEnd={() => setSedangDrag(false)}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-full transition-colors"
          style={{
            background: `linear-gradient(to right, ${
              arah === "kanan-merah" ? "#22c55e" : "#dc2626"
            }, ${arah === "kanan-merah" ? "#dc2626" : "#22c55e"})`,
            accentColor: warna,
          }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-gray-400">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

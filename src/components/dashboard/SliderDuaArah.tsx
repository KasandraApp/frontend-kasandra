import { useState } from "react";

interface SliderDuaArahProps {
  label: string;
  value: number; // -100 .. 100, 0 = netral
  onChange: (v: number) => void;
  /** "pengeluaran": naik(+) = merah (bahaya), turun(-) = ijo (bagus)
   *  "pemasukan":   naik(+) = ijo (bagus),   turun(-) = merah (bahaya) */
  jenis: "pengeluaran" | "pemasukan";
  min?: number;
  max?: number;
}

// Sama persis dengan warna merah/ijo yang dipakai di grafik proyeksi kas
// (brand green #557235 & red-600 #dc2626), biar konsisten se-web.
const IJO = { r: 0x55, g: 0x72, b: 0x35 }; // #557235
const MERAH = { r: 0xdc, g: 0x26, b: 0x26 }; // #dc2626
const PUTIH = { r: 255, g: 255, b: 255 };

function campur(a: typeof PUTIH, b: typeof PUTIH, t: number) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

// Di titik 0 warnanya putih polos (gak ada warna). Makin jauh digeser dari 0,
// makin pekat/gelap warnanya track-nya, sampai warna penuh di ujung (-100% / 100%).
function hitungWarnaTrack(value: number, jenis: "pengeluaran" | "pemasukan") {
  const intensitas = Math.min(Math.abs(value) / 100, 1); // 0 di tengah, 1 di ujung
  const target = warnaPekat(value, jenis);
  const { r, g, b } = campur(PUTIH, target, intensitas);
  return `rgb(${r}, ${g}, ${b})`;
}

// Warna teks/badge selalu pekat penuh (ga ikut mem-blend ke putih) biar tetep
// gampang dibaca walau baru digeser dikit dari 0.
function warnaPekat(value: number, jenis: "pengeluaran" | "pemasukan") {
  const naik = value > 0;
  const warnaNaik = jenis === "pengeluaran" ? MERAH : IJO;
  const warnaTurun = jenis === "pengeluaran" ? IJO : MERAH;
  const { r, g, b } = naik ? warnaNaik : warnaTurun;
  return { r, g, b };
}

function rgbCss({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbaCss({ r, g, b }: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SliderDuaArah({
  label,
  value,
  onChange,
  jenis,
  min = -100,
  max = 100,
}: SliderDuaArahProps) {
  const [sedangDrag, setSedangDrag] = useState(false);

  const warnaTrack = hitungWarnaTrack(value, jenis);
  const warnaPekatObj = warnaPekat(value, jenis);
  const warnaPekatNow = rgbCss(warnaPekatObj);
  const warnaBadgeBg = rgbaCss(warnaPekatObj, 0.1);
  const tengahPersen = ((0 - min) / (max - min)) * 100; // biasanya 50%
  const posisiPersen = ((value - min) / (max - min)) * 100;

  // Segmen warna cuma digambar dari titik tengah (0%) sampai posisi thumb sekarang
  const kiriFill = Math.min(tengahPersen, posisiPersen);
  const lebarFill = Math.abs(posisiPersen - tengahPersen);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span
          className="rounded-full border px-2 py-0.5 text-xs font-bold transition-colors"
          style={{
            borderColor: value === 0 ? "#d1d5db" : warnaPekatNow,
            color: value === 0 ? "#6b7280" : warnaPekatNow,
            backgroundColor: value === 0 ? "#f3f4f6" : warnaBadgeBg,
          }}
        >
          {value > 0 ? "+" : ""}
          {value}%
        </span>
      </div>

      <div className="relative py-2">
        {/* Tooltip persentase - cuma muncul pas lagi di-drag */}
        {sedangDrag && value !== 0 && (
          <div
            className="pointer-events-none absolute -top-6 -translate-x-1/2 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-md transition-all"
            style={{ left: `${posisiPersen}%`, backgroundColor: warnaPekatNow }}
          >
            {value > 0 ? "+" : ""}
            {value}%
          </div>
        )}

        {/* Bar dasar (track) - selalu ada, warna netral, biar thumb ga nyaru walau valuenya 0 */}
        <div className="relative h-2.5 w-full rounded-full bg-gray-200">
          {/* Fill warna - cuma nongol dari titik tengah ke arah geseran, makin jauh makin gelap */}
          {lebarFill > 0 && (
            <div
              className="absolute top-0 h-2.5 rounded-full transition-[left,width,background-color] duration-75"
              style={{
                left: `${kiriFill}%`,
                width: `${lebarFill}%`,
                backgroundColor: warnaTrack,
              }}
            />
          )}

          {/* Penanda titik tengah (0%) */}
          <div className="pointer-events-none absolute top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white" style={{ left: `${tengahPersen}%` }} />

          {/* Thumb custom, putih dengan border warna biar keliatan jelas di atas track */}
          <div
            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow transition-[left,border-color] duration-75"
            style={{
              left: `${posisiPersen}%`,
              borderColor: value === 0 ? "#9ca3af" : warnaPekatNow,
            }}
          />
        </div>

        {/* Input asli - transparan, di atas, buat nangkep drag/klik/keyboard */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setSedangDrag(true)}
          onMouseUp={() => setSedangDrag(false)}
          onTouchStart={() => setSedangDrag(true)}
          onTouchEnd={() => setSedangDrag(false)}
          className="absolute inset-0 top-0 h-full w-full cursor-pointer opacity-0"
          style={{ margin: 0 }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-gray-400">
        <span>Turun {Math.abs(min)}%</span>
        <span>0%</span>
        <span>Naik {max}%</span>
      </div>
    </div>
  );
}

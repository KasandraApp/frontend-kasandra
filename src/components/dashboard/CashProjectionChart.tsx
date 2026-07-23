import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DataPoin } from "../../utils/kalkulasiLinier";
import { EmptyIcon } from "../shared/EmptyIcon";

interface CashProjectionChartProps {
  data: DataPoin[];
}

function formatSumbuY(nilai: number) {
  return `${(nilai / 1_000_000).toFixed(1)}jt`;
}

interface TitikChart {
  labelSumbu: string;
  hari: string;
  nilai: number;
}

function TooltipKustom({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: TitikChart }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const titik = payload[0].payload;
  
  // Logika warna: merah jika minus, hijau jika positif/nol
  const warnaTeks = titik.nilai < 0 ? "text-red-600" : "text-[#557235]";

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-gray-700">{titik.hari}</p>
      <p className={warnaTeks}>
        Simulasi: Rp {titik.nilai.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

function CashProjectionChartComponent({ data }: CashProjectionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-800">Proyeksi Kas 30 Hari</h3>
        <p className="mb-3 text-xs text-gray-400">Berdasarkan tren transaksi harian</p>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <EmptyIcon
            src="/assets/icons/proyeksi-kosong.png"
            alt="Belum ada proyeksi"
            fallbackEmoji="📈"
          />
          <p className="font-semibold text-gray-700">Belum ada proyeksi</p>
          <p className="text-xs text-gray-400">
            Tambahkan data transaksi melalui menu "Keuangan" untuk melihat proyeksi
          </p>
        </div>
      </div>
    );
  }

  const nilaiAkhir = data[data.length - 1]?.nilai ?? 0;
  const berpotensiDefisit = data.some((d) => d.nilai < 0);
  const warnaGaris = berpotensiDefisit ? "#dc2626" : "#557235";
  const idGradient = berpotensiDefisit ? "gradientMerah" : "gradientHijau";

  const dataChart: TitikChart[] = data.map((d, idx) => ({
    labelSumbu: `H+${idx}`,
    hari: `H+${idx}`,
    nilai: d.nilai,
  }));

  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-[#557235]/20 bg-white p-6">
      <h3 className="text-lg font-bold text-gray-800">Proyeksi Kas 30 Hari</h3>
      <p className="mb-4 text-sm text-gray-400">Berdasarkan tren transaksi harian</p>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={dataChart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gradientHijau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#557235" stopOpacity={0.75} />
              <stop offset="55%" stopColor="#557235" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#557235" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradientMerah" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.75} />
              <stop offset="45%" stopColor="#dc2626" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          
          <XAxis
            dataKey="labelSumbu"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            interval={4}
            axisLine={{ stroke: "#374151", strokeWidth: 1.5 }}
            tickLine={{ stroke: "#374151" }}
            tickMargin={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={formatSumbuY}
            width={50}
            axisLine={{ stroke: "#374151", strokeWidth: 1.5 }}
            tickLine={{ stroke: "#374151" }}
          />
          <Tooltip content={<TooltipKustom />} />
          <Area
            type="linear"
            dataKey="nilai"
            stroke={warnaGaris}
            strokeWidth={2.5}
            fill={`url(#${idGradient})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="mt-1 text-right text-xs text-gray-400">
        Estimasi akhir: Rp {nilaiAkhir.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

export const CashProjectionChart = memo(CashProjectionChartComponent);
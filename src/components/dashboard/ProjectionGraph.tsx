import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { DataPoin } from "../../utils/kalkulasiLinier";
import { formatRupiah, formatTanggalPendek } from "../../utils/formatRupiah";

interface ProjectionGraphProps {
  dataAsli: DataPoin[];
  dataSimulasi: DataPoin[];
  tipe?: "kas" | "stok";
  judul?: string;
}

// memo() supaya komponen ini TIDAK re-render kalau props-nya sama persis.
// Penting buat performa waktu slider digeser cepat berkali-kali.
function ProjectionGraphComponent({
  dataAsli,
  dataSimulasi,
  tipe = "kas",
  judul = "Proyeksi 30 Hari ke Depan",
}: ProjectionGraphProps) {
  // Gabungkan data asli & simulasi jadi satu dataset buat dual-line chart
  const dataGabungan = dataAsli.map((titik, index) => ({
    tanggal: formatTanggalPendek(titik.tanggal),
    asli: titik.nilai,
    simulasi: dataSimulasi[index]?.nilai ?? titik.nilai,
  }));

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{judul}</h3>

      {/* Flat layout — hindari nested wrapper berlebih biar rendering ringan */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dataGabungan} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} interval={4} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) =>
              tipe === "kas" ? `${(v / 1_000_000).toFixed(1)}jt` : `${v}`
            }
            width={45}
          />
          <Tooltip
            formatter={(value, name) => [
              tipe === "kas" ? formatRupiah(Number(value)) : `${value} unit`,
              name === "asli" ? "Proyeksi Awal" : "Simulasi What-If",
            ]}
          />
          {tipe === "kas" && <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />}

          <Line
            type="monotone"
            dataKey="asli"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // matikan animasi masuk biar update real-time mulus, ga "loncat"
          />
          <Line
            type="monotone"
            dataKey="simulasi"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Custom comparison: cuma re-render kalau data beneran berubah
export const ProjectionGraph = memo(ProjectionGraphComponent);

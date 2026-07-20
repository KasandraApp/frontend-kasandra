export function formatRupiah(nilai: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

export function formatTanggalPendek(tanggalISO: string): string {
  const tanggal = new Date(tanggalISO);
  return tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

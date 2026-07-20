interface AlertBannerProps {
  severity: "warning" | "critical";
  title: string;
  desc: string;
}

function AlertBanner({ severity, title, desc }: AlertBannerProps) {
  const isKritis = severity === "critical";
  const iconSrc = isKritis
    ? "/src/assets/icons/peringatan-merah.png"
    : "/src/assets/icons/peringatan-kuning.png";

  return (
    <div
      className={`flex-1 rounded-xl border p-4 text-sm ${
        isKritis
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-yellow-200 bg-yellow-50 text-yellow-700"
      }`}
    >
      <div className="flex items-start gap-2">
        <img
          src={iconSrc}
          alt={isKritis ? "Peringatan kritis" : "Peringatan"}
          className="mt-0.5 h-4 w-4 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-0.5 text-xs opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

interface AlertBannersProps {
  kasWarning?: { title: string; desc: string } | null;
  stokWarning?: { title: string; desc: string } | null;
}

export function AlertBanners({ kasWarning, stokWarning }: AlertBannersProps) {
  if (!kasWarning && !stokWarning) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {kasWarning && (
        <AlertBanner severity="warning" title={kasWarning.title} desc={kasWarning.desc} />
      )}
      {stokWarning && (
        <AlertBanner severity="critical" title={stokWarning.title} desc={stokWarning.desc} />
      )}
    </div>
  );
}

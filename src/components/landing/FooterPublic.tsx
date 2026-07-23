export function FooterPublic() {
  return (
    <footer className="bg-[#557235] px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo-kasandra.png"
            alt="Kasandra"
            className="h-7 w-7 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-sm font-medium text-white">Kasandra</span>
        </div>
        <p className="text-xs text-white/70">Digital Twin Keuangan UMKM</p>
      </div>
    </footer>
  );
}

export function DashboardNavbar() {
  return (
    <nav className="bg-[#557235] px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8b93d] font-bold text-[#557235]">
            K
          </div>
          <span className="font-semibold text-white">Kasandra</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifikasi"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8b93d] text-[#557235]"
          >
            🔔
          </button>
          <div className="rounded-lg bg-[#44601f] px-4 py-2 text-sm font-medium text-white">
            Nama User
          </div>
        </div>
      </div>
    </nav>
  );
}

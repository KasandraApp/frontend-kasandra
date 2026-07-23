import { useState } from "react";
import { NavLink } from "react-router-dom";

// "dashboard.png" udah ada di assets/icons.
// "keuangan.png", "stok.png", "profile.png" belum ada - taruh nanti dengan nama ini,
// otomatis muncul (ada fallback inisial huruf kalau gambarnya belum ada).
const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "/src/assets/icons/dashboard.png" },
  { path: "/keuangan", label: "Keuangan", icon: "/src/assets/icons/keuangan.png" },
  { path: "/stok", label: "Stok", icon: "/src/assets/icons/stok.png" },
  { path: "/profile", label: "Profil", icon: "/src/assets/icons/profile.png" },
  {
    path: "/bantuan",
    label: "Bantuan & Masukan",
    icon: "/src/assets/icons/masukan-bantuan.png",
  },
];

function IconMenu({ src, alt }: { src: string; alt: string }) {
  const [gagalMuat, setGagalMuat] = useState(false);

  if (gagalMuat) {
    // Fallback sementara selagi PNG icon-nya belum ditaruh: huruf pertama label
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/20 text-[10px] font-bold">
        {alt.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-5 w-5 shrink-0 object-contain"
      onError={() => setGagalMuat(true)}
    />
  );
}

export function Sidebar() {
  const [terbukaMobile, setTerbukaMobile] = useState(false);

  return (
    <>
      {/* Top bar mobile - cuma logo + tombol buka menu */}
      <div className="flex items-center justify-between bg-[#557235] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo-kasandra.png"
            alt="Kasandra"
            className="h-8 w-8 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-semibold text-white">Kasandra</span>
        </div>
        <button
          onClick={() => setTerbukaMobile(true)}
          aria-label="Buka menu"
          className="text-white"
        >
          ☰
        </button>
      </div>

      {/* Overlay drawer mobile - tetep full label, ga pakai hover (mobile ga ada hover) */}
      {terbukaMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-[#557235] p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold text-white">Kasandra</span>
              <button
                onClick={() => setTerbukaMobile(false)}
                aria-label="Tutup menu"
                className="text-white"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setTerbukaMobile(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#e8b93d] text-[#557235]"
                        : "text-white/90 hover:bg-[#44601f]"
                    }`
                  }
                >
                  <IconMenu src={item.icon} alt={item.label} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setTerbukaMobile(false)}
          />
        </div>
      )}

      {/* Sidebar tetap - desktop only. Default cuma icon (w-16), hover jadi lebar penuh + label muncul. */}
      <aside className="group sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden bg-[#557235] py-4 transition-[width] duration-200 ease-in-out md:flex md:w-16 md:hover:w-56">
        <div className="mb-8 flex items-center gap-2 px-[18px]">
          <img
            src="/assets/logo-kasandra.png"
            alt="Kasandra"
            className="h-8 w-8 shrink-0 rounded-lg object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="whitespace-nowrap font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            Kasandra
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#e8b93d] text-[#557235]"
                    : "text-white/90 hover:bg-[#44601f]"
                }`
              }
            >
              <IconMenu src={item.icon} alt={item.label} />
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

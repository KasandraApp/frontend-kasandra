import { useState } from "react";

interface NavbarPublicProps {
  onMasukClick: () => void;
  onDaftarClick: () => void;
}

const menuItems = [
  { label: "Utama", href: "#utama" },
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "FAQ", href: "#faq" },
];

export function NavbarPublic({ onMasukClick, onDaftarClick }: NavbarPublicProps) {
  const [menuMobileTerbuka, setMenuMobileTerbuka] = useState(false);

  return (
    <nav className="bg-[#557235] px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
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

        <div className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-white/90 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onMasukClick}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 hover:text-white"
          >
            Masuk
          </button>
          <button
            onClick={onDaftarClick}
            className="rounded-lg bg-[#e8b93d] px-4 py-2 text-sm font-semibold text-[#557235] hover:bg-[#dcae35]"
          >
            Daftar
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-white md:hidden"
          onClick={() => setMenuMobileTerbuka((v) => !v)}
          aria-label="Buka menu"
        >
          ☰
        </button>
      </div>

      {menuMobileTerbuka && (
        <div className="mt-3 flex flex-col gap-3 md:hidden">
          {menuItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-white/90">
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onMasukClick}
              className="flex-1 rounded-lg border border-white/30 py-2 text-sm text-white"
            >
              Masuk
            </button>
            <button
              onClick={onDaftarClick}
              className="flex-1 rounded-lg bg-[#e8b93d] py-2 text-sm font-semibold text-[#557235]"
            >
              Daftar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

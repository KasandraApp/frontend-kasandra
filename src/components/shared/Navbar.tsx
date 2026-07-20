import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/input-keuangan", label: "Input Keuangan" },
  { path: "/input-stok", label: "Input Stok" },
];

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <span className="text-lg font-bold text-indigo-600">Kasandra</span>
        <div className="flex gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

import type { ReactNode } from "react";

interface AuthModalShellProps {
  onClose: () => void;
  children: ReactNode;
}

export function AuthModalShell({ onClose, children }: AuthModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

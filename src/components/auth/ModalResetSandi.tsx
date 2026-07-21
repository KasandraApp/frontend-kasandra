import { useState, type FormEvent } from "react";
import { AuthModalShell } from "./AuthModalShell";

interface ModalResetSandiProps {
  onClose: () => void;
  onKembaliKeMasuk: () => void;
  onSubmit: (password: string) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export function ModalResetSandi({ onClose, onKembaliKeMasuk, onSubmit, isSubmitting = false, errorMessage }: ModalResetSandiProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!password || password.length < 8) {
      setError("Kata sandi minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak sama");
      return;
    }

    setError("");
    onSubmit(password);
  }

  return (
    <AuthModalShell onClose={onClose}>
      <h2 className="text-center text-lg font-bold text-gray-800">Buat Kata Sandi Baru</h2>
      <p className="mb-5 text-center text-xs text-[#e8b93d]">
        Kata sandi Anda akan diganti setelah verifikasi OTP berhasil.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Kata Sandi Baru</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="Minimal 8 karakter"
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
              error ? "border-[#dc2626] focus:border-[#dc2626]" : "border-gray-300 focus:border-[#557235]"
            }`}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Konfirmasi Kata Sandi</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="Ulangi kata sandi"
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
              error ? "border-[#dc2626] focus:border-[#dc2626]" : "border-gray-300 focus:border-[#557235]"
            }`}
          />
        </div>

        {error && <p className="text-center text-xs text-[#dc2626]">{error}</p>}
        {errorMessage && <p className="text-center text-xs text-[#dc2626]">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f] disabled:cursor-not-allowed disabled:bg-[#8fa36f]"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Kata Sandi"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Ingat kata sandi?{" "}
        <button onClick={onKembaliKeMasuk} className="font-semibold text-[#557235]">
          Masuk
        </button>
      </p>
    </AuthModalShell>
  );
}

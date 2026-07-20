import { useState, type FormEvent } from "react";
import { AuthModalShell } from "./AuthModalShell";

interface ModalLupaSandiProps {
  onClose: () => void;
  onKembaliKeMasuk: () => void;
  onKirim: (email: string) => void;
}

export function ModalLupaSandi({ onClose, onKembaliKeMasuk, onKirim }: ModalLupaSandiProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email wajib diisi");
      return;
    }
    onKirim(email);
    // TODO: sambungkan ke authService.kirimOtpLupaSandi(email) begitu backend siap
  }

  return (
    <AuthModalShell onClose={onClose}>
      <h2 className="text-center text-lg font-bold text-gray-800">Lupa Kata Sandi?</h2>
      <p className="mb-5 text-center text-xs text-[#e8b93d]">
        Masukkan Email terdaftar untuk dapatkan kode OTP.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="nama@gmail.com"
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
              error ? "border-[#dc2626] focus:border-[#dc2626]" : "border-gray-300 focus:border-[#557235]"
            }`}
          />
          {error && <p className="mt-1 text-xs text-[#dc2626]">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f]"
        >
          Kirim
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

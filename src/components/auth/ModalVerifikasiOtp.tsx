import { useState } from "react";
import { AuthModalShell } from "./AuthModalShell";
import { OtpInput } from "./OtpInput";

interface ModalVerifikasiOtpProps {
  email: string;
  onClose: () => void;
  onUbahEmail: () => void;
  onVerifikasi: (kode: string) => void;
  onKirimUlang: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export function ModalVerifikasiOtp({
  email,
  onClose,
  onUbahEmail,
  onVerifikasi,
  onKirimUlang,
  isSubmitting = false,
  errorMessage,
}: ModalVerifikasiOtpProps) {
  const [kode, setKode] = useState("");
  const [error, setError] = useState("");

  function handleVerifikasi() {
    if (kode.length < 6) {
      setError("Masukkan 6 digit kode OTP");
      return;
    }
    onVerifikasi(kode);
    // TODO: sambungkan ke authService.verifikasiOtp(email, kode) begitu backend siap
  }

  return (
    <AuthModalShell onClose={onClose}>
      <h2 className="text-center text-lg font-bold text-gray-800">Kode OTP Terkirim!</h2>
      <p className="mb-5 text-center text-xs text-[#e8b93d]">
        Masukkan 6 digit kode yang sudah dikirim melalui Email Anda
        {email ? ` (${email})` : ""}
      </p>

      <OtpInput
        panjang={6}
        onChange={(k) => {
          setKode(k);
          if (error) setError("");
        }}
      />
      {error && <p className="mt-2 text-center text-xs text-[#dc2626]">{error}</p>}

      <p className="mt-3 text-center text-xs text-gray-500">
        Belum menerima pesan?{" "}
        <button onClick={onKirimUlang} className="font-semibold text-[#557235]">
          Kirim Ulang Kode
        </button>
      </p>

      {errorMessage && <p className="mt-2 text-center text-xs text-[#dc2626]">{errorMessage}</p>}

      <button
        onClick={handleVerifikasi}
        disabled={isSubmitting}
        className="mt-4 w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f] disabled:cursor-not-allowed disabled:bg-[#8fa36f]"
      >
        {isSubmitting ? "Memverifikasi..." : "Verifikasi Kode"}
      </button>

      <p className="mt-3 text-center text-xs">
        <button onClick={onUbahEmail} className="font-semibold text-[#557235] underline">
          Ubah alamat Email
        </button>
      </p>
    </AuthModalShell>
  );
}

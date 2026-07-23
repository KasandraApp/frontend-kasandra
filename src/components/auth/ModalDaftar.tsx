import { useState, type FormEvent } from "react";
import { AuthModalShell } from "./AuthModalShell";

interface ModalDaftarProps {
  onClose: () => void;
  onSwitchToMasuk: () => void;
  onSubmit: (data: {
    namaLengkap: string;
    namaUsaha: string;
    email: string;
    kataSandi: string;
  }) => void;
}

export function ModalDaftar({ onClose, onSwitchToMasuk, onSubmit }: ModalDaftarProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [namaUsaha, setNamaUsaha] = useState("");
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [tampilkanSandi, setTampilkanSandi] = useState(false);
  const [setujuSyarat, setSetujuSyarat] = useState(false);
  const [error, setError] = useState<{
    namaLengkap?: string;
    namaUsaha?: string;
    email?: string;
    kataSandi?: string;
  }>({});

  function validasi() {
    const errBaru: typeof error = {};
    if (!namaLengkap.trim()) errBaru.namaLengkap = "Nama lengkap wajib diisi";
    if (!namaUsaha.trim()) errBaru.namaUsaha = "Nama usaha wajib diisi";
    if (!email.trim()) errBaru.email = "Email wajib diisi";
    if (!kataSandi) errBaru.kataSandi = "Kata sandi wajib diisi";
    else if (kataSandi.length < 8) errBaru.kataSandi = "Kata sandi minimal 8 karakter";
    setError(errBaru);
    return Object.keys(errBaru).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!setujuSyarat) return;
    if (!validasi()) return;
    onSubmit({ namaLengkap, namaUsaha, email, kataSandi });
    // TODO: sambungkan ke authService.register() begitu backend siap
  }

  function inputCls(err?: string) {
    return `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
      err ? "border-[#dc2626] focus:border-[#dc2626]" : "border-gray-300 focus:border-[#557235]"
    }`;
  }

  return (
    <AuthModalShell onClose={onClose}>
      <h2 className="text-center text-lg font-bold text-gray-800">Buat Akun Kasandra</h2>
      <p className="mb-5 text-center text-xs text-[#e8b93d]">
        Mulai kelola arus kas dan stok usahamu.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Nama Lengkap</label>
          <input
            type="text"
            required
            value={namaLengkap}
            onChange={(e) => {
              setNamaLengkap(e.target.value);
              if (error.namaLengkap) setError((prev) => ({ ...prev, namaLengkap: undefined }));
            }}
            placeholder="Nama kamu"
            className={inputCls(error.namaLengkap)}
          />
          {error.namaLengkap && (
            <p className="mt-1 text-xs text-[#dc2626]">{error.namaLengkap}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Nama Usaha</label>
          <input
            type="text"
            required
            value={namaUsaha}
            onChange={(e) => {
              setNamaUsaha(e.target.value);
              if (error.namaUsaha) setError((prev) => ({ ...prev, namaUsaha: undefined }));
            }}
            placeholder="Contoh: Warung Berkah"
            className={inputCls(error.namaUsaha)}
          />
          {error.namaUsaha && <p className="mt-1 text-xs text-[#dc2626]">{error.namaUsaha}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error.email) setError((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="nama@gmail.com"
            className={inputCls(error.email)}
          />
          {error.email && <p className="mt-1 text-xs text-[#dc2626]">{error.email}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Kata Sandi</label>
          <div className="relative">
            <input
              type={tampilkanSandi ? "text" : "password"}
              required
              minLength={8}
              value={kataSandi}
              onChange={(e) => {
                setKataSandi(e.target.value);
                if (error.kataSandi) setError((prev) => ({ ...prev, kataSandi: undefined }));
              }}
              placeholder="Minimal 8 karakter"
              className={`${inputCls(error.kataSandi)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setTampilkanSandi((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <img
                src={
                  tampilkanSandi
                    ? "/assets/icons/eye-off.png"
                    : "/assets/icons/eye.png"
                }
                alt={tampilkanSandi ? "Sembunyikan sandi" : "Tampilkan sandi"}
                className="h-4 w-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </button>
          </div>
          {error.kataSandi && <p className="mt-1 text-xs text-[#dc2626]">{error.kataSandi}</p>}
        </div>

        <label className="flex items-start gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={setujuSyarat}
            onChange={(e) => setSetujuSyarat(e.target.checked)}
            className="mt-0.5"
          />
          Saya menyetujui Syarat &amp; Ketentuan
        </label>

        <button
          type="submit"
          disabled={!setujuSyarat}
          className="w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buat Akun
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        Atau lanjutkan dengan
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button 
        type="button"
        onClick={() => {
          const baseUrl = import.meta.env.VITE_GOOGLE_AUTH_URL || 'https://backend-kasandra.vercel.app/api/v1/auth/google';
          window.location.href = `${baseUrl}?intent=register`;
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <img
          src="/assets/icons/google.png"
          alt="Google"
          className="h-4 w-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        Google
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Sudah punya akun?{" "}
        <button onClick={onSwitchToMasuk} className="font-semibold text-[#557235]">
          Masuk
        </button>
      </p>
    </AuthModalShell>
  );
}

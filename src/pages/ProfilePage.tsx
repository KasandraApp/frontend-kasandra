import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserContext";

function IconMata({ tampil }: { tampil: boolean }) {
  return (
    <img
      src={tampil ? "/src/assets/icons/eye-off.png" : "/src/assets/icons/eye.png"}
      alt={tampil ? "Sembunyikan sandi" : "Tampilkan sandi"}
      className="h-4 w-4"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUser();

  // Informasi akun — nilai awal diambil dari context (data yang beneran tersimpan)
  const [namaLengkap, setNamaLengkap] = useState(user.namaLengkap);
  const [namaUsaha, setNamaUsaha] = useState(user.namaUsaha);
  const [email, setEmail] = useState(user.email);

  // Ubah kata sandi
  const [sandiLama, setSandiLama] = useState("");
  const [sandiBaru, setSandiBaru] = useState("");
  const [konfirmasiSandiBaru, setKonfirmasiSandiBaru] = useState("");
  const [tampilSandiLama, setTampilSandiLama] = useState(false);
  const [tampilSandiBaru, setTampilSandiBaru] = useState(false);
  const [tampilKonfirmasi, setTampilKonfirmasi] = useState(false);
  const [errorSandi, setErrorSandi] = useState("");
  const [suksesInfo, setSuksesInfo] = useState(false);
  const [suksesSandi, setSuksesSandi] = useState(false);

  function handleSimpanInformasi(e: FormEvent) {
    e.preventDefault();
    user.updateUser({ namaLengkap, namaUsaha, email });
    // TODO: sambungkan ke profileService.updateInformasi() begitu backend siap
    setSuksesInfo(true);
    setTimeout(() => setSuksesInfo(false), 2500);
  }

  function handleUbahSandi(e: FormEvent) {
    e.preventDefault();
    setErrorSandi("");

    if (!sandiLama || !sandiBaru || !konfirmasiSandiBaru) {
      setErrorSandi("Semua kolom kata sandi wajib diisi");
      return;
    }
    if (sandiBaru.length < 8) {
      setErrorSandi("Kata sandi baru harus terdiri dari minimal 8 karakter");
      return;
    }
    if (sandiBaru !== konfirmasiSandiBaru) {
      setErrorSandi("Konfirmasi kata sandi baru tidak cocok");
      return;
    }

    console.log("Ubah kata sandi");
    // TODO: sambungkan ke profileService.ubahKataSandi() begitu backend siap
    setSandiLama("");
    setSandiBaru("");
    setKonfirmasiSandiBaru("");
    setSuksesSandi(true);
    setTimeout(() => setSuksesSandi(false), 2500);
  }

  function handleLogout() {
    // TODO: bersihin token/session beneran di sini kalau udah ada backend
    navigate("/");
  }

  const inisial = namaLengkap.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, <span className="text-[#e8b93d]">{user.namaLengkap}!</span>
        </h1>
        <p className="text-sm text-gray-500">Profil</p>
        <p className="text-xs text-gray-400">Kelola informasi akun dan usahamu di sini</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#557235] text-xl font-bold text-white">
          {inisial}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{namaLengkap}</p>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
      </div>

      {/* Informasi Akun */}
      <form
        onSubmit={handleSimpanInformasi}
        className="rounded-2xl border border-gray-200 bg-white p-6"
      >
        <h3 className="font-semibold text-gray-800">Informasi Akun</h3>
        <p className="mb-4 text-xs text-gray-400">Kelola data profil dan usahamu.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Nama Lengkap"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nama Usaha</label>
            <input
              type="text"
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              placeholder="Warung Berkah"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-[#557235] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#44601f]"
        >
          Simpan Perubahan
        </button>
        {suksesInfo && (
          <p className="mt-2 text-xs font-medium text-[#557235]">Perubahan berhasil disimpan.</p>
        )}
      </form>

      {/* Ubah Kata Sandi */}
      <form
        onSubmit={handleUbahSandi}
        className="rounded-2xl border border-gray-200 bg-white p-6"
      >
        <h3 className="font-semibold text-gray-800">Ubah Kata Sandi</h3>
        <p className="mb-4 text-xs text-gray-400">
          Kata sandi baru harus terdiri dari minimal 8 karakter.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={tampilSandiLama ? "text" : "password"}
                value={sandiLama}
                onChange={(e) => setSandiLama(e.target.value)}
                placeholder="Kata sandi lama"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-[#557235] focus:outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
              />
              <button
                type="button"
                onClick={() => setTampilSandiLama((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <IconMata tampil={tampilSandiLama} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={tampilSandiBaru ? "text" : "password"}
                  value={sandiBaru}
                  onChange={(e) => setSandiBaru(e.target.value)}
                  placeholder="Kata sandi baru"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-[#557235] focus:outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setTampilSandiBaru((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <IconMata tampil={tampilSandiBaru} />
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={tampilKonfirmasi ? "text" : "password"}
                  value={konfirmasiSandiBaru}
                  onChange={(e) => setKonfirmasiSandiBaru(e.target.value)}
                  placeholder="Konfirmasi kata sandi baru"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-[#557235] focus:outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setTampilKonfirmasi((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <IconMata tampil={tampilKonfirmasi} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {errorSandi && <p className="mt-2 text-xs text-[#dc2626]">{errorSandi}</p>}
        {suksesSandi && (
          <p className="mt-2 text-xs font-medium text-[#557235]">Kata sandi berhasil diubah.</p>
        )}

        <button
          type="submit"
          className="mt-4 rounded-lg bg-[#557235] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#44601f]"
        >
          Ubah Kata Sandi
        </button>
      </form>

      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="rounded-lg border border-[#dc2626] px-6 py-2.5 text-sm font-semibold text-[#dc2626] hover:bg-red-50"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
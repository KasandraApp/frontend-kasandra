import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { useUser } from "../store/UserContext";
import { useDataStore } from "../store/DataStore";

export default function GoogleSetupPage() {
  const navigate = useNavigate();
  const user = useUser();
  const dataStore = useDataStore();
  const [namaUsaha, setNamaUsaha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!namaUsaha.trim()) {
      setError("Nama usaha wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use UserContext to update local user state after successful backend update
      if (user && user.updateUser) {
        await user.updateUser({ namaLengkap: user.namaLengkap, namaUsaha: namaUsaha.trim(), email: user.email });
        // refresh application data after profile update so dashboard shows latest data
        if (dataStore && dataStore.reloadData) await dataStore.reloadData();
      } else {
        await apiFetch('/auth/update-profile', {
          method: 'PUT',
          body: JSON.stringify({ namaUsaha: namaUsaha.trim() }),
          redirectOnUnauthorized: false,
        });
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan nama usaha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f2] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Lengkapi profil bisnismu</h1>
        <p className="mt-2 text-sm text-gray-600">
          Akun Google Anda sudah siap. Silakan isi nama usaha agar dashboard bisa langsung dipakai.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Usaha</label>
            <input
              type="text"
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              placeholder="Contoh: Warung Berkah"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-[#dc2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-white hover:bg-[#44601f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Lanjut ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

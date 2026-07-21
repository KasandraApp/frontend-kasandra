import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "../utils/api";

interface UserInfo {
  namaLengkap: string;
  namaUsaha: string;
  email: string;
}

interface UserContextValue extends UserInfo {
  isLoading: boolean;
  updateUser: (data: UserInfo) => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

const DEFAULT_USER: UserInfo = {
  namaLengkap: "Nama User",
  namaUsaha: "Warung Berkah",
  email: "nama@usaha.com",
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

function muatUser() {
    setIsLoading(true);
    apiFetch<{ success: boolean; data?: UserInfo }>('/auth/me', { redirectOnUnauthorized: false })
      .then((response) => {
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          console.warn("Gagal memuat profil, menggunakan data default");
        }
      })
      .catch((error) => {
        console.error("Gagal memuat profil:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    muatUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateUser(data: UserInfo) {
    try {
      await apiFetch('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      setUser(data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  return (
    <UserContext.Provider value={{ ...user, isLoading, updateUser }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser harus dipakai di dalam UserProvider");
  return ctx;
}

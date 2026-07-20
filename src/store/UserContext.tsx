import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface UserInfo {
  namaLengkap: string;
  namaUsaha: string;
  email: string;
}

interface UserContextValue extends UserInfo {
  updateUser: (data: UserInfo) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const KUNCI_USER = "kasandra:user";

const DEFAULT_USER: UserInfo = {
  namaLengkap: "Nama User",
  namaUsaha: "Warung Berkah",
  email: "nama@usaha.com",
};

function muatUser(): UserInfo {
  try {
    const raw = localStorage.getItem(KUNCI_USER);
    return raw ? (JSON.parse(raw) as UserInfo) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo>(muatUser);

  useEffect(() => {
    localStorage.setItem(KUNCI_USER, JSON.stringify(user));
  }, [user]);

  function updateUser(data: UserInfo) {
    setUser(data);
  }

  return (
    <UserContext.Provider value={{ ...user, updateUser }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser harus dipakai di dalam UserProvider");
  return ctx;
}

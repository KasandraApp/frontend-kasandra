import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "./components/shared/AppShell";
import { DataStoreProvider } from "./store/DataStore";
import { UserProvider } from "./store/UserContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import KeuanganPage from "./pages/KeuanganPage";
import StokPage from "./pages/StokPage";
import ProfilePage from "./pages/ProfilePage";
import GoogleSetupPage from "./pages/GoogleSetupPage";

function InternalLayout() {
  return (
    <UserProvider>
      <DataStoreProvider>
        <AppShell>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/keuangan" element={<KeuanganPage />} />
            <Route path="/stok" element={<StokPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/oauth/google/setup" element={<GoogleSetupPage />} />
            {/* Rute lama input-data dialihkan ke Keuangan biar link lama ga rusak */}
            <Route path="/input-data" element={<Navigate to="/keuangan" replace />} />
          </Routes>
        </AppShell>
      </DataStoreProvider>
    </UserProvider>
  );
}

function TokenHandler({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const mode = params.get("mode");

    if (token) {
      localStorage.setItem("kasandra:token", token);
      const nextPath = mode === "register" ? "/oauth/google/setup" : "/dashboard";
      const cleanUrl = `${window.location.pathname}${window.location.hash}`;
      window.history.replaceState({}, document.title, cleanUrl);
      navigate(nextPath, { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <TokenHandler>
        <Routes>
          {/* Landing page: publik, tanpa Sidebar internal aplikasi */}
          <Route path="/" element={<LandingPage />} />
          {/* Halaman internal aplikasi (setelah login) pakai Sidebar + layout terpisah */}
          <Route path="/*" element={<InternalLayout />} />
        </Routes>
      </TokenHandler>
    </BrowserRouter>
  );
}

export default App;

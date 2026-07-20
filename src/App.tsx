import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/shared/AppShell";
import { DataStoreProvider } from "./store/DataStore";
import { UserProvider } from "./store/UserContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import KeuanganPage from "./pages/KeuanganPage";
import StokPage from "./pages/StokPage";
import ProfilePage from "./pages/ProfilePage";

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
            {/* Rute lama input-data dialihkan ke Keuangan biar link lama ga rusak */}
            <Route path="/input-data" element={<Navigate to="/keuangan" replace />} />
          </Routes>
        </AppShell>
      </DataStoreProvider>
    </UserProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page: publik, tanpa Sidebar internal aplikasi */}
        <Route path="/" element={<LandingPage />} />
        {/* Halaman internal aplikasi (setelah login) pakai Sidebar + layout terpisah */}
        <Route path="/*" element={<InternalLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

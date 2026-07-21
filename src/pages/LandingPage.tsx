import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { NavbarPublic } from "../components/landing/NavbarPublic";
import { HeroSection } from "../components/landing/HeroSection";
import { FiturSection } from "../components/landing/FiturSection";
import { CaraKerjaSection } from "../components/landing/CaraKerjaSection";
import { FaqSection } from "../components/landing/FaqSection";
import { FooterPublic } from "../components/landing/FooterPublic";
import { ModalLogin } from "../components/auth/ModalLogin";
import { ModalDaftar } from "../components/auth/ModalDaftar";
import { ModalLupaSandi } from "../components/auth/ModalLupaSandi";
import { ModalVerifikasiOtp } from "../components/auth/ModalVerifikasiOtp";
import { ModalResetSandi } from "../components/auth/ModalResetSandi";

type ModalAktif = "login" | "daftar" | "lupa-sandi" | "verifikasi-otp" | "reset-sandi" | null;

export default function LandingPage() {
  const [modalAktif, setModalAktif] = useState<ModalAktif>(null);
  const [emailLupaSandi, setEmailLupaSandi] = useState("");
  const [otpLupaSandi, setOtpLupaSandi] = useState("");
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetError, setResetError] = useState("");
  const navigate = useNavigate();

  async function kirimOtp(email: string) {
    setIsSubmittingReset(true);
    setResetError("");

    try {
      const response = await apiFetch<{ success: boolean; message?: string; data?: { otp?: string } }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.success) {
        setEmailLupaSandi(email);
        setModalAktif('verifikasi-otp');
      } else {
        setResetError(response.message ?? 'Gagal mengirim kode OTP');
      }
    } catch (error) {
      setResetError(error instanceof Error ? error.message : 'Gagal mengirim kode OTP');
    } finally {
      setIsSubmittingReset(false);
    }
  }

  async function verifikasiOtp(kode: string) {
    setIsSubmittingReset(true);
    setResetError("");

    try {
      const response = await apiFetch<{ success: boolean; message?: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: emailLupaSandi, otp: kode }),
      });

      if (response.success) {
        setOtpLupaSandi(kode);
        setModalAktif('reset-sandi');
      } else {
        setResetError(response.message ?? 'Kode OTP tidak valid');
      }
    } catch (error) {
      setResetError(error instanceof Error ? error.message : 'Kode OTP tidak valid');
    } finally {
      setIsSubmittingReset(false);
    }
  }

  async function resetPassword(password: string) {
    setIsSubmittingReset(true);
    setResetError("");

    try {
      const response = await apiFetch<{ success: boolean; message?: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: emailLupaSandi, otp: otpLupaSandi, password }),
      });

      if (response.success) {
        setModalAktif(null);
        navigate('/dashboard');
      } else {
        setResetError(response.message ?? 'Gagal mengubah kata sandi');
      }
    } catch (error) {
      setResetError(error instanceof Error ? error.message : 'Gagal mengubah kata sandi');
    } finally {
      setIsSubmittingReset(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NavbarPublic
        onMasukClick={() => setModalAktif("login")}
        onDaftarClick={() => setModalAktif("daftar")}
      />

      <HeroSection onMulaiClick={() => setModalAktif("daftar")} />
      <FiturSection />
      <CaraKerjaSection />
      <FaqSection />
      <FooterPublic />

      {modalAktif === "login" && (
        <ModalLogin
          onClose={() => setModalAktif(null)}
          onSwitchToDaftar={() => setModalAktif("daftar")}
          onLupaSandi={() => setModalAktif("lupa-sandi")}
          onSubmit={(email, kataSandi) => {
            // Perform login via backend API
            apiFetch<{ data: { access_token: string } }>('/auth/login', {
              method: 'POST',
              body: JSON.stringify({ email, password: kataSandi })
            })
              .then((result) => {
                // Store token and navigate to dashboard on success
                if (result.data?.access_token) {
                  localStorage.setItem('kasandra:token', result.data.access_token);
                  setModalAktif(null);
                  navigate('/dashboard');
                } else {
                  console.error('Login succeeded but no token returned');
                }
              })
              .catch((err) => {
                // Show error feedback (you can replace with UI toast later)
                console.error('Login failed:', err);
                alert('Login gagal: ' + err.message);
              });
          }}
        />
      )}

      {modalAktif === "daftar" && (
        <ModalDaftar
          onClose={() => setModalAktif(null)}
          onSwitchToMasuk={() => setModalAktif("login")}
          onSubmit={(data) => {
            apiFetch<{ data: { access_token: string } }>('/auth/register', {
              method: 'POST',
              body: JSON.stringify({
                full_name: data.namaLengkap,
                business_name: data.namaUsaha,
                email: data.email,
                password: data.kataSandi,
              }),
            })
              .then((result) => {
                if (result.data?.access_token) {
                  localStorage.setItem('kasandra:token', result.data.access_token);
                  setModalAktif(null);
                  navigate('/dashboard');
                } else {
                  console.error('Registrasi berhasil, tetapi token tidak tersedia');
                  alert('Registrasi berhasil, tetapi tidak dapat masuk otomatis. Silakan masuk kembali.');
                }
              })
              .catch((err) => {
                console.error('Registrasi gagal:', err);
                alert('Registrasi gagal: ' + err.message);
              });
          }}
        />
      )}

      {modalAktif === "lupa-sandi" && (
        <ModalLupaSandi
          onClose={() => setModalAktif(null)}
          onKembaliKeMasuk={() => setModalAktif("login")}
          onKirim={(email) => {
            void kirimOtp(email);
          }}
          isSubmitting={isSubmittingReset}
          errorMessage={resetError}
        />
      )}

      {modalAktif === "verifikasi-otp" && (
        <ModalVerifikasiOtp
          email={emailLupaSandi}
          onClose={() => setModalAktif(null)}
          onUbahEmail={() => setModalAktif("lupa-sandi")}
          onKirimUlang={() => {
            void kirimOtp(emailLupaSandi);
          }}
          onVerifikasi={(kode) => {
            void verifikasiOtp(kode);
          }}
          isSubmitting={isSubmittingReset}
          errorMessage={resetError}
        />
      )}

      {modalAktif === "reset-sandi" && (
        <ModalResetSandi
          onClose={() => setModalAktif(null)}
          onKembaliKeMasuk={() => setModalAktif("login")}
          onSubmit={(password) => {
            void resetPassword(password);
          }}
          isSubmitting={isSubmittingReset}
          errorMessage={resetError}
        />
      )}
    </div>
  );
}

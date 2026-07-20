import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

type ModalAktif = "login" | "daftar" | "lupa-sandi" | "verifikasi-otp" | null;

export default function LandingPage() {
  const [modalAktif, setModalAktif] = useState<ModalAktif>(null);
  const [emailLupaSandi, setEmailLupaSandi] = useState("");
  const navigate = useNavigate();

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
            console.log("Login:", email, kataSandi);
            // TODO: sambungkan ke authService.login() begitu backend siap.
            // Untuk sekarang, langsung arahkan ke dashboard biar bisa dites alurnya.
            setModalAktif(null);
            navigate("/dashboard");
          }}
        />
      )}

      {modalAktif === "daftar" && (
        <ModalDaftar
          onClose={() => setModalAktif(null)}
          onSwitchToMasuk={() => setModalAktif("login")}
          onSubmit={(data) => {
            console.log("Daftar:", data);
            // TODO: sambungkan ke authService.register() begitu backend siap.
            setModalAktif(null);
            navigate("/dashboard");
          }}
        />
      )}

      {modalAktif === "lupa-sandi" && (
        <ModalLupaSandi
          onClose={() => setModalAktif(null)}
          onKembaliKeMasuk={() => setModalAktif("login")}
          onKirim={(email) => {
            setEmailLupaSandi(email);
            console.log("Kirim OTP ke:", email);
            // TODO: sambungkan ke authService.kirimOtpLupaSandi(email) begitu backend siap
            setModalAktif("verifikasi-otp");
          }}
        />
      )}

      {modalAktif === "verifikasi-otp" && (
        <ModalVerifikasiOtp
          email={emailLupaSandi}
          onClose={() => setModalAktif(null)}
          onUbahEmail={() => setModalAktif("lupa-sandi")}
          onKirimUlang={() => {
            console.log("Kirim ulang OTP ke:", emailLupaSandi);
            // TODO: sambungkan ke authService.kirimOtpLupaSandi(emailLupaSandi) lagi
          }}
          onVerifikasi={(kode) => {
            console.log("Verifikasi OTP:", kode);
            // TODO: sambungkan ke authService.verifikasiOtp() begitu backend siap.
            // Untuk sekarang, anggap berhasil dan arahkan ke dashboard.
            setModalAktif(null);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
}

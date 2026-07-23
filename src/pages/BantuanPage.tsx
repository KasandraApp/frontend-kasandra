import { useState } from "react";
import { useUser } from "../store/UserContext";

interface FaqItem {
  pertanyaan: string;
  jawaban: string;
}

const DAFTAR_FAQ: FaqItem[] = [
  {
    pertanyaan: "Bagaimana cara menambah transaksi baru?",
    jawaban:
      'Buka menu "Keuangan" di sidebar, isi form tanggal, jenis, kategori, dan nominal, lalu tekan tombol "Tambah". Transaksi akan langsung muncul di daftar riwayat dan memengaruhi grafik proyeksi kas.',
  },
  {
    pertanyaan: "Kenapa proyeksi kas saya berubah-ubah?",
    jawaban:
      "Proyeksi dihitung berdasarkan rata-rata transaksi harianmu. Semakin banyak dan rutin kamu mencatat, proyeksinya juga akan semakin stabil dan akurat.",
  },
  {
    pertanyaan: "Apakah simulasi what-if memengaruhi data asli saya?",
    jawaban:
      "Tidak. Simulasi what-if hanya bersifat perkiraan sementara untuk membantu menguji skenario dan tidak mengubah data transaksi atau stok yang sudah tercatat.",
  },
  {
    pertanyaan: "Seberapa akurat proyeksi kas dan stok di Kasandra?",
    jawaban:
      "Proyeksi dihitung dari rata-rata transaksi harianmu, makin rutin Anda memasukkan data, maka hasilnya dapat semakin akurat. Saat ini masih pakai perhitungan sederhana, jadi cocok untuk gambaran umum dan bukan angka pasti.",
  },
  {
    pertanyaan: "Bagaimana jika saya lupa kata sandi?",
    jawaban:
      "Klik 'Lupa Kata Sandi?' di halaman masuk, masukkan email yang terdaftar, lalu masukkan kode OTP yang kami kirim ke email tersebut untuk verifikasi.",
  },
];

export default function BantuanPage() {
  const user = useUser();
  const [faqTerbuka, setFaqTerbuka] = useState<number | null>(0);
  const [masukan, setMasukan] = useState("");
  const [terkirim, setTerkirim] = useState(false);

  function toggleFaq(idx: number) {
    setFaqTerbuka((prev) => (prev === idx ? null : idx));
  }

  function handleKirimMasukan() {
    if (!masukan.trim()) return;
    // TODO: sambungkan ke endpoint feedback beneran begitu backend siap
    setTerkirim(true);
    setMasukan("");
    setTimeout(() => setTerkirim(false), 3000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, <span className="text-[#e8b93d]">{user.namaLengkap}!</span>
        </h1>
        <p className="text-sm text-gray-500">
          Cari jawaban cepat atau kirim masukan langsung ke tim{" "}
          <span className="font-semibold text-[#557235]">Kasandra</span>.
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Pertanyaan Umum</h2>
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {DAFTAR_FAQ.map((item, idx) => {
            const terbuka = faqTerbuka === idx;
            return (
              <div key={item.pertanyaan}>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-800"
                >
                  {item.pertanyaan}
                  <span
                    className={`ml-3 shrink-0 text-gray-400 transition-transform ${
                      terbuka ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {terbuka && (
                  <div className="px-5 pb-4 text-sm text-gray-500">{item.jawaban}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-800">Kirim Masukan</h2>
        <p className="mb-4 text-sm text-gray-500">
          Ada saran, laporan kendala, atau ide fitur? Ceritakan di bawah ini.
        </p>

        <textarea
          value={masukan}
          onChange={(e) => setMasukan(e.target.value)}
          placeholder="Tulis masukanmu di sini..."
          rows={5}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#557235] focus:outline-none"
        />

        <button
          onClick={handleKirimMasukan}
          className="mt-4 w-full rounded-lg bg-[#557235] py-2.5 text-sm font-semibold text-[#e8b93d] hover:bg-[#44601f] sm:w-auto sm:px-8"
        >
          Kirim Masukan
        </button>

        {terkirim && (
          <p className="mt-3 text-sm font-medium text-[#557235]">
            Terima kasih, masukanmu udah kekirim ke tim kami!
          </p>
        )}
      </div>
    </div>
  );
}
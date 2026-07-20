interface ConfirmDeleteModalProps {
  namaItem: string;
  tipeItem: string; // misal "Transaksi" atau "Stok"
  onBatal: () => void;
  onHapus: () => void;
}

export function ConfirmDeleteModal({
  namaItem,
  tipeItem,
  onBatal,
  onHapus,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 font-bold text-gray-800">Yakin Hapus?</h3>
        <p className="mb-5 text-sm text-gray-500">
          {tipeItem} <strong>{namaItem}</strong> akan dihapus permanen dan tidak dapat
          dikembalikan.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onBatal}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={onHapus}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FALLBACK_SHIPMENT = {
  date: 'Jumat, 6 Januari 2022',
  note: 'Pesanan dimohon tiba sebelum pukul 14.00 WIB.',
  totalDiatur: 45,
  ongkosKirim: 'Rp103.000',
};

export default function Step3() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(true);
  const [shipment, setShipment] = useState(FALLBACK_SHIPMENT);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('inaproc-shipment') : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setShipment({
          date: parsed.date || FALLBACK_SHIPMENT.date,
          note: parsed.note || FALLBACK_SHIPMENT.note,
          totalDiatur: parsed.totalDiatur || FALLBACK_SHIPMENT.totalDiatur,
          ongkosKirim: parsed.ongkosKirim || FALLBACK_SHIPMENT.ongkosKirim,
        });
      } catch (e) {
        // ignore parse errors, fall back to defaults
      }
    }
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            🛍
          </div>
          <div>
            <div className="text-lg font-extrabold leading-none">
              INA<span className="text-brand">PROC</span>
            </div>
            <div className="text-[10px] text-gray-500">Katalog Elektronik</div>
          </div>
        </div>
      </header>

      {showToast && (
        <div className="mx-auto mt-4 flex max-w-6xl items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          ✅ Lokasi Pengiriman dan produk berhasil diatur.
        </div>
      )}

      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => router.push('/step1')}
              aria-label="Kembali"
              className="mt-1 text-gray-700 hover:text-black"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Atur Pengiriman Langsung Ke Banyak Lokasi
            </h1>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Lokasi Pengiriman (1)</p>
          <button
            onClick={() => router.push('/step1')}
            className="flex items-center gap-1 rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
          >
            + Tambah Lokasi Pengiriman
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Alamat</th>
                <th className="px-4 py-3 font-semibold">Tanggal Permintaan Tiba</th>
                <th className="px-4 py-3 font-semibold">Total Produk</th>
                <th className="px-4 py-3 font-semibold">Ongkos Kirim</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 align-top">
                <td className="px-4 py-4 text-gray-500">1</td>
                <td className="px-4 py-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Lokasi</p>
                  <p className="font-semibold text-gray-900">Kantor Cabang Bogor</p>
                  <p className="mt-1 text-sm text-gray-600">Namora (082111111111)</p>
                  <p className="text-sm text-gray-600">
                    Jl. Merdeka No. 12, RT.3/RW.2, Kelurahan Sempur, Kecamatan Bogor Tengah, Kota
                    Bogor, Jawa Barat 16129
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Catatan:</p>
                  <p className="text-sm text-gray-500">
                    Kirim ke Jl. Merdeka No. 12, Bogor, harap tiba sebelum jam 10 pagi. Hubungi
                    penerima untuk konfirmasi.
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-800">📅 {shipment.date}</p>
                  <p className="mt-2 text-xs text-gray-400">Catatan Permintaan Tiba:</p>
                  <p className="text-sm text-gray-500">{shipment.note}</p>
                </td>
                <td className="px-4 py-4 text-gray-700">{shipment.totalDiatur}</td>
                <td className="px-4 py-4 text-gray-700">{shipment.ongkosKirim}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-brand hover:underline">
                      Lihat Detail
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu((v) => !v)}
                        className="rounded-lg border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-50"
                        aria-label="Aksi lainnya"
                      >
                        ⋮
                      </button>
                      {openMenu && (
                        <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                          <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50">
                            Ubah
                          </button>
                          <button className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-8 py-4">
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-gray-400">Produk Diatur</p>
            <p className="font-semibold text-gray-800">{shipment.totalDiatur} dari 270</p>
          </div>
          <div>
            <p className="text-gray-400">Kurir</p>
            <p className="font-semibold text-gray-800">Kurir Penyedia</p>
          </div>
          <div>
            <p className="text-gray-400">Total Ongkos Kirim</p>
            <p className="font-semibold text-gray-800">{shipment.ongkosKirim} (72kg)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FALLBACK_LOCATIONS = [
  {
    id: 'loc-fallback',
    address: {
      label: 'Kantor Cabang Bogor',
      name: 'Namora',
      phone: '082111111111',
      address:
        'Jl. Merdeka No. 12, RT.3/RW.2, Kelurahan Sempur, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16129',
    },
    date: 'Jumat, 6 Januari 2022',
    note:
      'Kirim ke Jl. Merdeka No. 12, Bogor, harap tiba sebelum jam 10 pagi. Hubungi penerima untuk konfirmasi.',
    products: [],
    totalDiatur: 45,
    ongkosKirim: 'Rp103.000',
    kurir: 'Kurir Penyedia',
  },
];

export default function Step3() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(true);
  const [locations, setLocations] = useState(FALLBACK_LOCATIONS);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailLocation, setDetailLocation] = useState(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('inaproc-locations') : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocations(parsed);
        }
      } catch (e) {
        // ignore parse errors, fall back to defaults
      }
    }
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const totalProdukDiatur = locations.reduce((sum, l) => sum + Number(l.totalDiatur || 0), 0);

  return (
    <div className="min-h-screen pb-28">
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
          <p className="font-semibold text-gray-800">Lokasi Pengiriman ({locations.length})</p>
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
              {locations.map((loc, i) => (
                <tr key={loc.id} className="border-b border-gray-100 align-top">
                  <td className="px-4 py-4 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Lokasi</p>
                    <p className="font-semibold text-gray-900">
                      {loc.address?.label || loc.address?.labelAlamat}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {loc.address?.name} ({loc.address?.phone})
                    </p>
                    <p className="text-sm text-gray-600">{loc.address?.address}</p>
                    {loc.note && (
                      <>
                        <p className="mt-2 text-xs text-gray-400">Catatan:</p>
                        <p className="text-sm text-gray-500">{loc.note}</p>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">📅 {loc.date}</p>
                    {loc.note && (
                      <>
                        <p className="mt-2 text-xs text-gray-400">Catatan Permintaan Tiba:</p>
                        <p className="text-sm text-gray-500">{loc.note}</p>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-700">{loc.totalDiatur}</td>
                  <td className="px-4 py-4 text-gray-700">{loc.ongkosKirim}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDetailLocation(loc)}
                        className="text-sm font-medium text-brand hover:underline"
                      >
                        Lihat Detail
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === loc.id ? null : loc.id)}
                          className="rounded-lg border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-50"
                          aria-label="Aksi lainnya"
                        >
                          ⋮
                        </button>
                        {openMenuId === loc.id && (
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
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-8 py-4">
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-gray-400">Produk Diatur</p>
            <p className="font-semibold text-gray-800">{totalProdukDiatur} dari 270</p>
          </div>
          <div>
            <p className="text-gray-400">Kurir</p>
            <p className="font-semibold text-gray-800">Kurir Penyedia</p>
          </div>
          <div>
            <p className="text-gray-400">Total Ongkos Kirim</p>
            <p className="font-semibold text-gray-800">{locations[0]?.ongkosKirim} (72kg)</p>
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

      {detailLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Detail Lokasi Pengiriman</h2>
              <button
                onClick={() => setDetailLocation(null)}
                aria-label="Tutup"
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Dikirim Ke</h3>
              <p className="mt-2 font-semibold text-gray-800">
                {detailLocation.address?.label || detailLocation.address?.labelAlamat}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {detailLocation.address?.name} ({detailLocation.address?.phone})
              </p>
              <p className="mt-1 text-sm text-gray-600">{detailLocation.address?.address}</p>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">Tanggal &amp; Catatan Permintaan Tiba</h3>
              <p className="mt-2 text-sm text-gray-700">📅 {detailLocation.date}</p>
              {detailLocation.note && (
                <p className="mt-1 text-sm text-gray-500">{detailLocation.note}</p>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">Ringkasan</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Produk</p>
                  <p className="font-semibold text-gray-800">{detailLocation.totalDiatur}</p>
                </div>
                <div>
                  <p className="text-gray-400">Kurir</p>
                  <p className="font-semibold text-gray-800">{detailLocation.kurir}</p>
                </div>
                <div>
                  <p className="text-gray-400">Ongkos Kirim</p>
                  <p className="font-semibold text-gray-800">{detailLocation.ongkosKirim}</p>
                </div>
              </div>
            </div>

            {detailLocation.products && detailLocation.products.length > 0 && (
              <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="px-4 py-2 font-semibold">Produk</th>
                      <th className="px-4 py-2 font-semibold">Varian</th>
                      <th className="px-4 py-2 font-semibold">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailLocation.products.map((p) => (
                      <tr key={p.no} className="border-t border-gray-100">
                        <td className="px-4 py-2 text-gray-800">{p.name}</td>
                        <td className="px-4 py-2 text-gray-600">{p.varian}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {p.jumlah} {p.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailLocation(null)}
                className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

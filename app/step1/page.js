'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS, DEFAULT_ADDRESS } from '../data';

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function buildCalendar(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  // Monday-first index (0=Sen ... 6=Min)
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: cells.length - (startOffset + daysInMonth) + 1, current: false });
  }
  return cells;
}

function formatDateID(dateObj) {
  if (!dateObj) return '';
  return `${DAY_NAMES[dateObj.getDay()]}, ${dateObj.getDate()} ${MONTHS[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

export default function Step1() {
  const router = useRouter();

  const [viewYear, setViewYear] = useState(2022);
  const [viewMonth, setViewMonth] = useState(0); // Januari
  const [selectedDate, setSelectedDate] = useState(new Date(2022, 0, 6));
  const [showCalendar, setShowCalendar] = useState(false);
  const [note, setNote] = useState('Pesanan dimohon tiba sebelum pukul 14.00 WIB.');
  const [showModal, setShowModal] = useState(false);

  const [quantities, setQuantities] = useState(
    Object.fromEntries(PRODUCTS.map((p) => [p.no, 0]))
  );

  const cells = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);

  const totalDiatur = useMemo(
    () => Object.values(quantities).reduce((a, b) => a + Number(b || 0), 0),
    [quantities]
  );

  function updateQty(no, value) {
    const v = Math.max(0, Number(value) || 0);
    setQuantities((q) => ({ ...q, [no]: v }));
  }

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function pickDay(cell) {
    if (!cell.current) return;
    setSelectedDate(new Date(viewYear, viewMonth, cell.day));
    setShowCalendar(false);
  }

  function handleSimpan() {
    if (totalDiatur === 0) {
      alert('Atur jumlah minimal 1 produk sebelum menyimpan.');
      return;
    }
    setShowModal(true);
  }

  function confirmAndContinue() {
    const payload = {
      address: DEFAULT_ADDRESS,
      date: formatDateID(selectedDate),
      note,
      totalDiatur,
      totalBerat: '1.293 kg',
      kurir: 'Kurir Penyedia',
      ongkosKirim: 'Rp750.000',
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('inaproc-shipment', JSON.stringify(payload));
    }
    router.push('/step3');
  }

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

      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-6 flex items-start gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Kembali"
            className="mt-1 text-gray-700 hover:text-black"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Atur Pengiriman</h1>
            <p className="text-sm text-gray-500">
              Tentukan produk dan jumlah yang akan dikirim ke lokasi pengiriman berikut.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Dikirim Ke */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Dikirim Ke</h2>
              <button className="text-sm font-medium text-brand hover:underline">
                Ubah Alamat
              </button>
            </div>
            <p className="font-semibold text-gray-800">{DEFAULT_ADDRESS.label}</p>
            <p className="mt-1 text-sm text-gray-700">
              {DEFAULT_ADDRESS.name} ({DEFAULT_ADDRESS.phone})
            </p>
            <p className="mt-1 text-sm text-gray-700">{DEFAULT_ADDRESS.address}</p>
            <p className="mt-3 text-sm text-gray-400">Catatan:</p>
            <p className="text-sm text-gray-500">{DEFAULT_ADDRESS.note}</p>
          </div>

          {/* Tanggal Permintaan Tiba */}
          <div className="relative rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900">Tanggal Permintaan Tiba</h2>
            <p className="mt-1 text-sm text-gray-500">
              Tentukan tanggal kedatangan barang untuk lokasi pengiriman ini.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
                <button
                  onClick={() => setShowCalendar((v) => !v)}
                  className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-left text-sm text-gray-700 hover:border-brand"
                >
                  <span>📅</span>
                  <span>{formatDateID(selectedDate)}</span>
                </button>

                {showCalendar && (
                  <div className="absolute z-20 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        onClick={goToPrevMonth}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100"
                        aria-label="Bulan sebelumnya"
                      >
                        ‹
                      </button>
                      <span className="font-semibold text-gray-800">
                        {MONTHS[viewMonth]} {viewYear}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100"
                        aria-label="Bulan berikutnya"
                      >
                        ›
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
                      {DAYS.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
                      {cells.map((cell, i) => {
                        const isSelected =
                          cell.current &&
                          selectedDate.getFullYear() === viewYear &&
                          selectedDate.getMonth() === viewMonth &&
                          selectedDate.getDate() === cell.day;
                        return (
                          <button
                            key={i}
                            onClick={() => pickDay(cell)}
                            className={`rounded-full py-1.5 ${
                              !cell.current
                                ? 'text-gray-300'
                                : isSelected
                                ? 'bg-brand text-white'
                                : 'text-gray-700 hover:bg-brand-light'
                            }`}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                  Catatan{' '}
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-normal text-gray-500">
                    Tidak Wajib
                  </span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: pesanan dimohon tiba sebelum pukul 14.00 WIB."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Produk</th>
                <th className="px-4 py-3 font-semibold">Varian</th>
                <th className="px-4 py-3 font-semibold">Layanan</th>
                <th className="px-4 py-3 font-semibold">Belum Diatur</th>
                <th className="px-4 py-3 font-semibold">Atur Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, idx) => (
                <tr
                  key={p.no}
                  className={`border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="px-4 py-3 text-gray-500">{p.no}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.varian}</td>
                  <td className="px-4 py-3 text-gray-600">{p.layanan}</td>
                  <td className="px-4 py-3 text-gray-600">{p.belumDiatur}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={quantities[p.no]}
                        onChange={(e) => updateQty(p.no, e.target.value)}
                        className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-right"
                      />
                      <span className="rounded-lg bg-gray-100 px-2 py-1.5 text-xs text-gray-600">
                        {p.unit}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-white px-8 py-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          onClick={handleSimpan}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Simpan
        </button>
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Apakah Pengaturan Pengiriman Sudah Sesuai?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Klik &ldquo;Ya, Sudah Sesuai&rdquo;, setelah Anda telah memastikan lokasi pengiriman dan produk
              yang tertera sudah sesuai.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Dikirim Ke</h3>
                <p className="mt-2 font-semibold text-gray-800">{DEFAULT_ADDRESS.label}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {DEFAULT_ADDRESS.name} ({DEFAULT_ADDRESS.phone})
                </p>
                <p className="mt-1 text-sm text-gray-600">{DEFAULT_ADDRESS.address}</p>
                <p className="mt-2 text-xs text-gray-400">Catatan: {DEFAULT_ADDRESS.note}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Ringkasan Produk &amp; Ongkos Kirim</h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Produk Diatur</dt>
                    <dd className="font-medium text-gray-800">{totalDiatur}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Berat</dt>
                    <dd className="font-medium text-gray-800">1.293 kg</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Kurir</dt>
                    <dd className="font-medium text-gray-800">Kurir Penyedia</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Ongkos Kirim</dt>
                    <dd className="font-bold text-gray-900">Rp750.000</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Tanggal Permintaan Tiba</h4>
                  <p className="mt-1 text-sm text-gray-600">📅 {formatDateID(selectedDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Catatan Permintaan Tiba</h4>
                  <p className="mt-1 text-sm text-gray-600">{note}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 max-h-56 overflow-y-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-2 font-semibold">No.</th>
                    <th className="px-4 py-2 font-semibold">Produk</th>
                    <th className="px-4 py-2 font-semibold">Varian</th>
                    <th className="px-4 py-2 font-semibold">Layanan Tambahan</th>
                    <th className="px-4 py-2 font-semibold">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.filter((p) => quantities[p.no] > 0).map((p) => (
                    <tr key={p.no} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-500">{p.no}</td>
                      <td className="px-4 py-2 text-gray-800">{p.name}</td>
                      <td className="px-4 py-2 text-gray-600">{p.varian}</td>
                      <td className="px-4 py-2 text-gray-600">{p.layanan}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {quantities[p.no]} {p.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={confirmAndContinue}
                className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Ya, Sudah Sesuai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// src/pages/Laporan.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../pages/Header'; // Asumsi Navbar sudah ada
import { API_Source } from '../global/Apisource';
import Pagination from '../components/Pagination'; // Asumsi Pagination sudah ada

export const Laporan = () => {
  const [reportType, setReportType] = useState('daily');
  const [dailyDate, setDailyDate] = useState('');
  const [weeklyStart, setWeeklyStart] = useState('');
  const [weeklyEnd, setWeeklyEnd] = useState('');
  const [monthlyYear, setMonthlyYear] = useState('');
  const [monthlyMonth, setMonthlyMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State untuk pagination
  const itemsPerPage = 10; // Maksimum 10 item per halaman

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: [
      'report',
      reportType,
      {
        date: dailyDate,
        startDate: weeklyStart,
        endDate: weeklyEnd,
        year: monthlyYear,
        month: monthlyMonth,
      },
    ],
    queryFn: async () => {
      switch (reportType) {
        case 'daily':
          if (!dailyDate) throw new Error('Tanggal harus diisi');
          return await API_Source.getDailyReport(dailyDate);
        case 'weekly':
          if (!weeklyStart || !weeklyEnd) throw new Error('Rentang tanggal harus diisi');
          return await API_Source.getWeeklyReport(weeklyStart, weeklyEnd);
        case 'monthly':
          if (!monthlyYear || !monthlyMonth) throw new Error('Tahun dan bulan harus diisi');
          return await API_Source.getMonthlyReport(monthlyYear, monthlyMonth);
        default:
          throw new Error('Invalid report type');
      }
    },
    enabled: false, // Hanya fetch saat tombol ditekan
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 saat submit baru
    refetch();
  };

  // Hitung data untuk halaman saat ini
  const totalItems = data?.buku_harian?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBukuHarian = data?.buku_harian?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Laporan Keuangan</h1>

        {/* Form Pemilihan Laporan */}
        <div className="card bg-base-100 shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tipe Laporan</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
              </select>
            </div>

            {reportType === 'daily' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tanggal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                />
              </div>
            )}

            {reportType === 'weekly' && (
              <div className="flex gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Tanggal Mulai</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={weeklyStart}
                    onChange={(e) => setWeeklyStart(e.target.value)}
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Tanggal Selesai</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={weeklyEnd}
                    onChange={(e) => setWeeklyEnd(e.target.value)}
                  />
                </div>
              </div>
            )}

            {reportType === 'monthly' && (
              <div className="flex gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Tahun</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={monthlyYear}
                    onChange={(e) => setMonthlyYear(e.target.value)}
                    placeholder="YYYY"
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Bulan</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={monthlyMonth}
                    onChange={(e) => setMonthlyMonth(e.target.value)}
                    placeholder="MM"
                    min="1"
                    max="12"
                  />
                </div>
              </div>
            )}

            <button className="btn btn-primary mt-4" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Memuat...' : 'Tampilkan Laporan'}
            </button>
          </div>
        </div>

        {/* Tampilan Hasil Laporan */}
        {error && (
          <div className="alert alert-error">
            <span>{error.message}</span>
          </div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6"
          >
            {/* Ringkasan */}
            <div className="card bg-base-100 shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Ringkasan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat">
                  <div className="stat-title">Modal Awal</div>
                  <div className="stat-value">{data.modal_awal}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Total Keuntungan</div>
                  <div className="stat-value">{data.total_keuntungan}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Net Keuntungan</div>
                  <div className="stat-value">{data.net_keuntungan}</div>
                </div>
              </div>
            </div>

            {/* Tabel Buku Harian dengan Pagination */}
            {data.buku_harian.length > 0 && (
              <div className="card bg-base-100 shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Detail Buku Harian</h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Kode</th>
                        <th>Harga Jual</th>
                        <th>Harga Jual Grosir</th>
                        <th>Jumlah</th>
                        <th>Keuntungan</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBukuHarian.map((item) => (
                        <tr key={item.id}>
                          <td>{item.kode}</td>
                          <td>{item.harga_jual || '-'}</td>
                          <td>{item.harga_jual_grosir || '-'}</td>
                          <td>{item.jumlah}</td>
                          <td>{item.keuntungan}</td>
                          <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {totalItems > 0 && (
                  <Pagination
                    totalItems={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Laporan;

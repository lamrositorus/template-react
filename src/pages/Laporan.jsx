import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaChartLine } from 'react-icons/fa';
import Navbar from '../pages/Header';
import { API_Source } from '../global/Apisource';
import Pagination from '../components/Pagination.jsx';

export const Laporan = () => {
  const [reportType, setReportType] = useState('daily');
  const [dailyDate, setDailyDate] = useState('');
  const [weeklyStart, setWeeklyStart] = useState('');
  const [weeklyEnd, setWeeklyEnd] = useState('');
  const [monthlyYear, setMonthlyYear] = useState('');
  const [monthlyMonth, setMonthlyMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: laporanResponse,
    error,
    refetch,
    isFetching,
  } = useQuery({
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
      console.log('Fetching report with:', {
        reportType,
        dailyDate,
        weeklyStart,
        weeklyEnd,
        monthlyYear,
        monthlyMonth,
      });
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
    onSuccess: (data) => {
      console.log('Laporan response received:', data);
    },
    enabled: false,
  });

  const laporanData = laporanResponse?.data || laporanResponse || null;
  console.log('isFetching:', isFetching, 'laporanData:', laporanData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    console.log('Triggering refetch with filters:', { reportType, dailyDate });
    refetch();
  };

  const totalItems = laporanData?.transactions?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedTransactions = laporanData?.transactions?.slice(startIndex, endIndex) || [];
  console.log('paginatedTransactions:', paginatedTransactions);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="pt-16 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-xl rounded-box animate-fade-in mx-auto max-w-5xl"
        >
          <div className="card-body">
            <h1 className="text-3xl font-bold text-primary flex items-center justify-center mb-6">
              <FaChartLine className="mr-2" /> Laporan Keuangan
            </h1>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <>
                    <div className="form-control">
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
                    <div className="form-control">
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
                  </>
                )}

                {reportType === 'monthly' && (
                  <>
                    <div className="form-control">
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
                    <div className="form-control">
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
                  </>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-4 w-full sm:w-auto flex items-center justify-center"
                disabled={isFetching}
              >
                {isFetching ? 'Memuat...' : 'Tampilkan Laporan'}
              </button>
            </form>

            {isFetching ? (
              <div className="space-y-4">
                <div className="skeleton h-12 w-full"></div>
                <div className="skeleton h-64 w-full"></div>
              </div>
            ) : error ? (
              <div className="alert alert-error shadow-md">
                <span className="font-medium">Error: {error.message}</span>
              </div>
            ) : laporanData ? (
              <>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Transaksi ID</th>
                        <th>Nama Pelanggan</th>
                        <th>Items</th>
                        <th>Total Pembayaran</th>
                        <th>Keuntungan</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((transaksi) => (
                          <tr key={transaksi.id} className="transition-all">
                            <td>{transaksi.id}</td>
                            <td>{transaksi.nama_pelanggan}</td>
                            <td>
                              <ul className="list-disc pl-4">
                                {transaksi.items.map((item, index) => (
                                  <li key={index}>
                                    {item.nama} ({item.kode}) - Jumlah: {item.jumlah}, Harga: {item.harga_jual}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>{transaksi.total_pembayaran}</td>
                            <td>{transaksi.keuntungan}</td>
                            <td>{new Date(transaksi.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">Tidak ada data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalItems > itemsPerPage && (
                  <Pagination
                    totalItems={totalItems}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}

                <div className="stats stats-vertical sm:stats-horizontal shadow mt-6 w-full">
                  <div className="stat">
                    <div className="stat-title">Modal Awal (Kode)</div>
                    <div className="stat-value text-primary">{laporanData.modal_awal || 'L'}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Keuntungan (Kode)</div>
                    <div className="stat-value text-success">
                      {laporanData.total_keuntungan || 'L'}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Net Keuntungan (Kode)</div>
                    <div className="stat-value text-secondary">
                      {laporanData.net_keuntungan || 'L'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Silakan pilih filter dan tekan "Tampilkan Laporan"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Laporan;
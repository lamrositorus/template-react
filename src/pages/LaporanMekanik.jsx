import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaFilter } from 'react-icons/fa';
import { Navbar } from '../pages/Header';
import { API_Source } from '../global/Apisource';
import Pagination from '../components/Pagination.jsx';
import { format } from 'date-fns';

export const LaporanMekanik = () => {
  const [filters, setFilters] = useState({
    mekanik_id: '',
    start_date: '',
    end_date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: laporanResponse,
    isLoading: laporanLoading,
    error: laporanError,
    refetch,
  } = useQuery({
    queryKey: ['laporanMekanik', filters],
    queryFn: () => {
      console.log('Sending filters to API:', filters);
      return API_Source.getLaporanMekanik(filters);
    },
    onSuccess: (data) => {
      console.log('Laporan response received:', data);
      console.log('laporanData:', data?.data);
      console.log('transactions:', data?.data?.laporan);
    },
    onError: (err) => {
      if (err.message.includes('authentication') || !localStorage.getItem('token')) {
        window.location.href = '/';
      }
    },
  });

  const {
    data: mekanikData,
    isLoading: mekanikLoading,
    error: mekanikError,
  } = useQuery({
    queryKey: ['mekanik'],
    queryFn: () => API_Source.getMekanik(),
  });

  const laporanData = laporanResponse?.data || {};
  const transactions = laporanData.laporan || [];
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    console.log('Filter submitted:', filters);
    refetch();
  };

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
              <FaChartLine className="mr-2" /> Laporan Penjualan Mekanik
            </h1>

            <form onSubmit={handleFilterSubmit} className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mekanik</span>
                  </label>
                  {mekanikLoading ? (
                    <div className="skeleton h-12 w-full"></div>
                  ) : mekanikError ? (
                    <select className="select select-bordered w-full" disabled>
                      <option>Gagal memuat mekanik</option>
                    </select>
                  ) : (
                    <select
                      name="mekanik_id"
                      value={filters.mekanik_id}
                      onChange={handleFilterChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Semua Mekanik</option>
                      {mekanikData && mekanikData.length > 0 ? (
                        mekanikData.map((mekanik) => (
                          <option key={mekanik.id} value={mekanik.id}>
                            {mekanik.nama}
                          </option>
                        ))
                      ) : (
                        <option>Tidak ada mekanik</option>
                      )}
                    </select>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tanggal Mulai</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tanggal Akhir</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-4 w-full sm:w-auto flex items-center justify-center"
              >
                <FaFilter className="mr-2" /> Filter
              </button>
            </form>

            {laporanLoading ? (
              <div className="space-y-4">
                <div className="skeleton h-12 w-full"></div>
                <div className="skeleton h-64 w-full"></div>
              </div>
            ) : laporanError ? (
              <div className="alert alert-error shadow-md">
                <span className="font-medium">Error: {laporanError?.message}</span>
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center">Tidak ada data transaksi</div>
            ) : (
              <>
                <div className="overflow-x-auto text-left">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-center">Transaksi ID</th>
                        <th className="text-center">Mekanik/Pelanggan</th>
                        <th className="text-center">Items</th>
                        <th className="text-center">Total (Kode)</th>
                        <th className="text-center">Keuntungan (Kode)</th>
                        <th className="text-center">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaksi) => (
                        <tr key={transaksi.transaksi_id} className="transition-all">
                          <td className="text-center">{transaksi.transaksi_id}</td>
                          <td className="text-center">
                            {`${transaksi.mekanik_nama || 'Unknown'}/${transaksi.nama_customer || 'Unknown'}`}
                          </td>
                          <td className="text-center">
                            <ul className="list-disc list-inside">
                              {transaksi.items && transaksi.items.length > 0 ? (
                                transaksi.items.map((item) => (
                                  <li key={item.laporan_id}>
                                    {item.nama_sparepart} - Harga: {item.final_harga_jual}
                                  </li>
                                ))
                              ) : (
                                <li>Tidak ada item</li>
                              )}
                            </ul>
                          </td>
                          <td className="text-center">
                            {transaksi.total_pembayaran} (Ongkos: {transaksi.ongkos_pasang})
                          </td>
                          <td className="text-center">{transaksi.total_keuntungan}</td>
                          <td className="text-center">
                            {transaksi.created_at
                              ? format(new Date(transaksi.created_at), 'dd/MM/yy HH:mm')
                              : 'Unknown'}
                          </td>
                        </tr>
                      ))}
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
                    <div className="stat-title">Total Harga Jual (Kode)</div>
                    <div className="stat-value text-primary">
                      {laporanData.total_harga_jual || 'A'}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Keuntungan (Kode)</div>
                    <div className="stat-value text-success">
                      {laporanData.total_keuntungan || 'A'}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Ongkos Pasang (Kode)</div>
                    <div className="stat-value text-secondary">
                      {laporanData.total_ongkos_pasang || 'A'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LaporanMekanik;
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

  const laporanData = laporanResponse?.data;

  // Mengelompokkan data per transaksi berdasarkan mekanik_id, nama_customer, dan created_at
  const groupedTransactions = () => {
    if (!laporanData?.laporan) return [];
    const grouped = laporanData.laporan.reduce((acc, row) => {
      const key = `${row.mekanik_id}-${row.nama_customer}-${row.created_at}`;
      if (!acc[key]) {
        acc[key] = {
          id: row.id, // Gunakan ID pertama sebagai representasi
          mekanik_id: row.mekanik_id,
          nama_customer: row.nama_customer,
          created_at: row.created_at,
          items: [],
          ongkos_pasang: row.ongkos_pasang, // Ambil ongkos_pasang dari item pertama (asumsi sama per transaksi)
        };
      }
      acc[key].items.push({
        kode: row.kode,
        final_harga_jual: row.final_harga_jual,
      });
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transactions = groupedTransactions();
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

  const getMekanikName = (mekanikId) => {
    const mekanik = mekanikData?.find((m) => m.id === mekanikId);
    return mekanik?.nama || 'Unknown';
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
                      {mekanikData?.map((mekanik) => (
                        <option key={mekanik.id} value={mekanik.id}>
                          {mekanik.nama}
                        </option>
                      ))}
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
                <span className="font-medium">Error: {laporanError.message}</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto text-left">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-center">Transaksi ID</th>
                        <th className="text-center">Nama</th>
                        <th className="text-center">Items</th>
                        <th className="text-center">Ongkos Pasang (Kode)</th>
                        <th className="text-center">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((transaksi) => (
                          <tr key={transaksi.id} className="transition-all">
                            <td className="text-center">{transaksi.id}</td>
                            <td className="text-center">
                              {`${getMekanikName(transaksi.mekanik_id)}/${transaksi.nama_customer}`}
                            </td>
                            <td className="text-center">
                              <ul className="list-disc pl-4 text-left">
                                {transaksi.items.map((item, index) => (
                                  <li key={index}>
                                    {item.kode} - Harga: {item.final_harga_jual}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="text-center">{transaksi.ongkos_pasang}</td>
                            <td className="text-center">
                              {format(new Date(transaksi.created_at), 'dd/MM/yy HH:mm')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            Tidak ada data
                          </td>
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
                    <div className="stat-title">Total Harga Jual (Kode)</div>
                    <div className="stat-value text-primary">
                      {laporanData?.total_harga_jual || 'A'}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Keuntungan (Kode)</div>
                    <div className="stat-value text-success">
                      {laporanData?.total_keuntungan || 'A'}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Ongkos Pasang (Kode)</div>
                    <div className="stat-value text-secondary">
                      {laporanData?.total_ongkos_pasang || 'A'}
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
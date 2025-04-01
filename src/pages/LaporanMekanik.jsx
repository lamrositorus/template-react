import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaChartLine, FaFilter } from 'react-icons/fa';
import { Navbar } from '../pages/Header';
import { API_Source } from '../global/Apisource';

export const LaporanMekanik = () => {
  const [filters, setFilters] = useState({
    mekanik_id: '',
    start_date: '',
    end_date: '',
  });

  const { data: laporanResponse, isLoading: laporanLoading, error: laporanError, refetch } = useQuery({
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

  const { data: mekanikData, isLoading: mekanikLoading, error: mekanikError } = useQuery({
    queryKey: ['mekanik'],
    queryFn: () => API_Source.getMekanik(),
  });

  const laporanData = laporanResponse?.data;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    console.log('Filter submitted:', filters);
    refetch();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="pt-16 p-4 sm:p-6">
        <div className="card bg-base-100 shadow-xl rounded-box animate-fade-in mx-auto max-w-5xl">
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
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Harga Jual (Kode)</th>
                        <th>Keuntungan (Kode)</th>
                        <th>Ongkos Pasang (Kode)</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporanData?.laporan?.length > 0 ? (
                        laporanData.laporan.map((row) => (
                          <tr key={row.id} className="transition-all">
                            <td>{row.id}</td>
                            <td>{row.final_harga_jual}</td>
                            <td>{row.keuntungan}</td>
                            <td>{row.ongkos_pasang}</td>
                            <td>{new Date(row.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5">Tidak ada data</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

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
        </div>
      </div>
    </div>
  );
};

export default LaporanMekanik;
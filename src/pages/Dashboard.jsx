import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FaSignOutAlt, FaChartLine, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { API_Source } from '../global/Apisource';

export const Dashboard = () => {
  const navigate = useNavigate();

  // Penanganan token dari Google OAuth tetap menggunakan useEffect
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromGoogle = queryParams.get('token');

    if (tokenFromGoogle) {
      localStorage.setItem('token', tokenFromGoogle);
      console.log('Token saved from Google OAuth:', tokenFromGoogle);
      // Hapus query parameter dari URL tanpa reload
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Pengambilan data dashboard menggunakan useQuery dari react-query
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'], // Kunci unik untuk cache
    queryFn: async () => {
      const data = await API_Source.getDashboard();
      return data;
    },
    onError: (err) => {
      if (err.message.includes('Unauthorized') || !localStorage.getItem('token')) {
        navigate('/');
      }
    },
  });

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center mb-8 text-primary tracking-tight flex items-center justify-center">
            <FaChartLine className="mr-2" /> Dashboard
          </h1>

          {/* Konten Dashboard */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="skeleton h-12 w-full rounded-md"></div>
              <div className="skeleton h-12 w-full rounded-md"></div>
              <div className="skeleton h-12 w-full rounded-md"></div>
            </div>
          ) : error ? (
            <div className="alert alert-error shadow-md">
              <span className="font-medium">Error: {error.message}</span>
            </div>
          ) : dashboardData ? (
            <div className="space-y-6">
              {/* Laporan Mekanik */}
              <div className="bg-base-200 p-4 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
                  <FaBook className="mr-2" /> Laporan Mekanik
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Total Harga Jual:</span>{' '}
                    {dashboardData.data.laporan_mekanik.totals.total_harga_jual}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Keuntungan:</span>{' '}
                    {dashboardData.data.laporan_mekanik.totals.total_keuntungan}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Ongkos Pasang:</span>{' '}
                    {dashboardData.data.laporan_mekanik.totals.total_ongkos_pasang}
                  </p>
                </div>
              </div>

              {/* Laporan Buku Harian */}
              <div className="bg-base-200 p-4 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
                  <FaBook className="mr-2" /> Laporan Buku Harian
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Modal Awal:</span>{' '}
                    {dashboardData.data.laporan_buku_harian.totals.modal_awal}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Keuntungan:</span>{' '}
                    {dashboardData.data.laporan_buku_harian.totals.total_keuntungan}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Net Keuntungan:</span>{' '}
                    {dashboardData.data.laporan_buku_harian.totals.net_keuntungan}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-base-content opacity-70">
              Tidak ada data untuk ditampilkan.
            </p>
          )}

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="btn btn-secondary w-full mt-6 hover:btn-secondary-focus transition-all duration-300 flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

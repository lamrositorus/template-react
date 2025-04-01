// src/components/Dashboard.jsx
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FaBook, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_Source } from '../global/Apisource';

export const Dashboard = () => {
  const navigate = useNavigate();

  // Penanganan token dari Google OAuth
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromGoogle = queryParams.get('token');

    if (tokenFromGoogle) {
      localStorage.setItem('token', tokenFromGoogle);
      console.log('Token saved from Google OAuth:', tokenFromGoogle);
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Pengambilan data dashboard
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
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
    <div className="min-h-screen bg-base-200 p-4 md:p-6 ">
      {/* Header */}
      <h1 className="text-3xl font-bold text-primary text-center mb-6 flex items-center justify-center">
        <FaChartLine className="mr-2" /> Dashboard
      </h1>
      {/* Divider */}
      <div className="divider max-w-2xl mx-auto">Laporan Penjualan Mekanik</div>
      {/* Konten Dashboard */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="skeleton h-32 w-full rounded-md"></div>
          <div className="skeleton h-32 w-full rounded-md"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error shadow-md max-w-2xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Error: {error.message}</span>
        </div>
      ) : dashboardData ? (
        <div className="space-y-6">
          {/* Laporan Mekanik */}
          <div className="stats stats-vertical md:stats-horizontal shadow bg-base-100 w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FaBook className="text-3xl" />
              </div>
              <div className="stat-title text-2xl font-semibold">Total Harga Jual</div>
              <div className="stat-value text-3xl">
                {dashboardData.data.laporan_mekanik.totals.total_harga_jual}
              </div>
              <div className="stat-desc">Laporan Mekanik</div>
            </div>
            <div className="stat">
              <div className="stat-title text-2xl font-semibold">Total Keuntungan</div>
              <div className="stat-value text-3xl">
                {dashboardData.data.laporan_mekanik.totals.total_keuntungan}
              </div>
              <div className="stat-desc">Laporan Mekanik</div>
            </div>
            <div className="stat">
              <div className="stat-title text-2xl font-semibold">Total Ongkos Pasang</div>
              <div className="stat-value text-3xl">
                {dashboardData.data.laporan_mekanik.totals.total_ongkos_pasang}
              </div>
              <div className="stat-desc">Laporan Mekanik</div>
            </div>
          </div>

          {/* Divider */}
          <div className="divider max-w-2xl mx-auto">Laporan Buku Harian</div>

          {/* Laporan Buku Harian */}
          <div className="stats stats-vertical md:stats-horizontal shadow bg-base-100 w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FaBook className="text-3xl" />
              </div>
              <div className="stat-title text-2xl font-semibold">Modal Awal</div>
              <div className="stat-value text-3xl">
                {dashboardData.data.laporan_buku_harian.totals.modal_awal}
              </div>
              <div className="stat-desc">Buku Harian</div>
            </div>
            <div className="stat">
              <div className="stat-title text-2xl font-semibold">Total Keuntungan</div>
              <div className="stat-value text-3xl">
                {dashboardData.data.laporan_buku_harian.totals.total_keuntungan}
              </div>
              <div className="stat-desc">Buku Harian</div>
            </div>
            <div className="stat">
              <div className="stat-title text-2xl font-semibold">Net Keuntungan</div>
              <div className="stat-value text-3xl">
                {dashboardData.data.laporan_buku_harian.totals.net_keuntungan}
              </div>
              <div className="stat-desc">Buku Harian</div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-base-content opacity-70 max-w-2xl mx-auto">
          Tidak ada data untuk ditampilkan.
        </p>
      )}

      {/* Tombol Logout */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-wide hover:bg-secondary-focus transition-all duration-300 flex items-center"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

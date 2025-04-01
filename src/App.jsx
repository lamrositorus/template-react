import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  Login,
  Dashboard,
  About,
  InventoryPage,
  Sparepart,
  TransactionPage,
  Laporan,
  LaporanMekanik,
} from './pages';
import Footer from './pages/Footer';
import Header from './pages/Header';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <ToastContainer />
        {/* Buat main agar fleksibel mendorong footer ke bawah */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventaris" element={<InventoryPage />} />
            <Route path="/sparepart" element={<Sparepart />} />
            <Route path="/transaksi" element={<TransactionPage />} />
            <Route path="/laporan/daily/:date" element={<Laporan />} />
            <Route path="/laporan/weekly/:startDate/:endDate" element={<Laporan />} />
            <Route path="/laporan/monthly/:year/:month" element={<Laporan />} />
            <Route path="/laporan/mekanik" element={<LaporanMekanik />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

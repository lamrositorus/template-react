import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="navbar bg-base-100 shadow-lg fixed top-0 z-50 w-full">
        <div className="flex-none lg:hidden">
          <button
            onClick={handleClick}
            className="btn btn-ghost"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-none">
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/inventaris">Inventaris</Link>
            </li>
            <li>
              <Link to="/sparepart">Sparepart</Link>
            </li>
            <li>
              <Link to="/transaksi">Transaksi</Link>
            </li>
            <li className="dropdown tooltip tooltip-bottom" data-tip="Klik untuk lihat opsi laporan">
              <div tabIndex={0} role="button" className="flex items-center">
                Laporan
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/laporan/daily/2025-03-25">Laporan Harian</Link>
                </li>
                <li>
                  <Link to="/laporan/mekanik">Laporan Mekanik</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Spacer untuk mendorong konten di bawah navbar */}
      <div className="h-16"></div>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-base-100 shadow-lg w-full sticky top-16 z-40"
        >
          <ul className="menu p-2">
            <li>
              <Link to="/dashboard" onClick={handleClick}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/inventaris" onClick={handleClick}>
                Inventaris
              </Link>
            </li>
            <li>
              <Link to="/sparepart" onClick={handleClick}>
                Sparepart
              </Link>
            </li>
            <li>
              <Link to="/transaksi" onClick={handleClick}>
                Transaksi
              </Link>
            </li>
            <li className="dropdown">
              <div tabIndex={0} role="button" className="flex items-center">
                Laporan
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/laporan/daily/2025-03-25" onClick={handleClick}>
                    Laporan Harian
                  </Link>
                </li>
                <li>
                  <Link to="/laporan/mekanik" onClick={handleClick}>
                    Laporan Mekanik
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/about" onClick={handleClick}>
                About
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
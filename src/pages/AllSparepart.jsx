// src/pages/AllSparepart.jsx
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_Source } from '../global/Apisource';

export const AllSparepart = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data sparepart dari API
  const {
    data: sparepartsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['spareparts'],
    queryFn: API_Source.getSparepart,
    onError: (err) => {
      toast.error(`Gagal memuat data sparepart: ${err.message}`);
    },
  });

  // Filter sparepart berdasarkan pencarian
  const filteredSpareparts =
    sparepartsData?.data?.filter((sparepart) =>
      [sparepart.nama, sparepart.kode].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    ) || [];

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-6">Semua Sparepart</h1>
      <p className="mb-4">Here you can find all available spare parts.</p>

      {/* Input Pencarian */}
      <div className="mb-6 flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau kode sparepart..."
            className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Tabel Sparepart */}
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error.message}</span>
        </div>
      ) : filteredSpareparts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Nama</th>
                <th className="text-left">Kode</th>
                <th className="text-left">Kode Beli</th>
                <th className="text-left">Kategori ID</th>
                <th className="text-left">Stok</th>
                <th className="text-left">Harga Beli</th>
                <th className="text-left">Harga Jual</th>
                <th className="text-left">Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpareparts.map((sparepart) => (
                <tr key={sparepart.id}>
                  <td>{sparepart.nama}</td>
                  <td>{sparepart.kode}</td>
                  <td>{sparepart.kode_beli}</td>
                  <td>{sparepart.kategori_id}</td>
                  <td>{sparepart.stok}</td>
                  <td>{sparepart.harga_beli}</td>
                  <td>Rp {sparepart.harga_jual.toLocaleString('id-ID')}</td>
                  <td>{new Date(sparepart.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Tidak ada sparepart yang sesuai dengan pencarian.
        </p>
      )}
    </div>
  );
};

export default AllSparepart;

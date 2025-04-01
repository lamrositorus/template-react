import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { API_Source } from '../global/Apisource';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPackage, FiSearch } from 'react-icons/fi';
import CloseHandler from '../components/closeHandler.jsx';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import InventoryTable from '../components/InventoryTable.jsx';
import InventoryForm from '../components/InventoryForm.jsx';
import Pagination from '../components/Pagination.jsx';

export const Sparepart = () => {
  const queryClient = useQueryClient();

  const [spareparts, setSpareparts] = useState([]);
  const [originalSpareparts, setOriginalSpareparts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', data: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const { isLoading: sparepartsLoading, error: sparepartsError } = useQuery({
    queryKey: ['spareparts'],
    queryFn: API_Source.getSparepart,
    onSuccess: (data) => {
      console.log('Respons API getSparepart:', data);
      const initialSpareparts = Array.isArray(data?.data) ? data.data : [];
      console.log('Data awal spareparts yang diproses:', initialSpareparts);
      setSpareparts(initialSpareparts);
      setOriginalSpareparts([...initialSpareparts]);
      console.log('originalSpareparts disimpan:', initialSpareparts);
    },
    onError: (err) => {
      console.error('Error saat memuat spareparts:', err.message);
      toast.error(`Gagal memuat sparepart: ${err.message}`);
      setSpareparts([]);
      setOriginalSpareparts([]);
    },
  });

  const {
    data: kategori,
    isLoading: kategoriLoading,
    error: kategoriError,
  } = useQuery({
    queryKey: ['kategori'],
    queryFn: API_Source.getKategori,
    onSuccess: (data) => {
      console.log('Respons API getKategori:', data);
    },
    onError: (err) => {
      console.error('Error saat memuat kategori:', err.message);
      toast.error(`Gagal memuat kategori: ${err.message}`);
    },
  });

  const getKategoriName = (kategori_id) => {
    if (kategoriLoading) return 'Memuat...';
    if (kategoriError || !kategori || !kategori.length) return 'Tidak diketahui';
    const kat = kategori.find((k) => k.id === kategori_id);
    return kat ? kat.nama : 'Tidak ditemukan';
  };

  const handleViewAll = async (type, toggleShowClose) => {
    if (sparepartsLoading) {
      toast.warn('Data sedang dimuat, silakan tunggu.');
      return;
    }
    try {
      const response = await API_Source.getSparepart();
      console.log('Respons API handleViewAll getSparepart:', response);
      const updatedSpareparts = Array.isArray(response?.data) ? response.data : [];
      console.log('Data spareparts setelah View All:', updatedSpareparts);
      setSpareparts(updatedSpareparts);
      toggleShowClose(null, true);
      toast.success('Data sparepart berhasil diperbarui!');
    } catch (err) {
      console.error('Error saat handleViewAll:', err.message);
      toast.error(`Gagal memuat sparepart: ${err.message}`);
    }
  };

  const handleClose = (toggleShowClose) => {
    console.log('Status saat handleClose dipanggil - spareparts:', spareparts);
    console.log('Status saat handleClose dipanggil - originalSpareparts:', originalSpareparts);
    if (!originalSpareparts || !Array.isArray(originalSpareparts)) {
      console.warn('originalSpareparts tidak valid atau kosong:', originalSpareparts);
      toast.warn('Data awal untuk sparepart tidak tersedia, mengembalikan ke kosong.');
      setSpareparts([]);
      toggleShowClose(null, false);
      return;
    }
    console.log('Mengembalikan spareparts ke originalSpareparts:', originalSpareparts);
    setSpareparts([...originalSpareparts]);
    toggleShowClose(null, false);
    toast.info('Data sparepart dikembalikan ke semula.');
  };

  const handleSubmit = (type, data) => {
    setModalContent({ type, data });
    setShowModal(true);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Filter data berdasarkan pencarian
  const filteredData = spareparts.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(searchLower) ||
      item.kode?.toLowerCase().includes(searchLower)
    );
  });

  if (sparepartsLoading || kategoriLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  if (sparepartsError) return <div className="text-error">Error: {sparepartsError.message}</div>;
  if (kategoriError) return <div className="text-error">Error: {kategoriError.message}</div>;

  return (
    <CloseHandler>
      {({ showClose, toggleShowClose }) => (
        <div className="p-8 bg-base-100 min-h-screen">
          <ToastContainer position="top-right" autoClose={3000} />
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <FiPackage className="text-primary" /> Manajemen Sparepart
          </h1>

          <div className="mb-4">
            <InventoryForm type="sparepart" onSubmit={handleSubmit} color="primary" />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama/kode..."
                className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <button
              onClick={() => handleViewAll('sparepart', toggleShowClose)}
              className="btn btn-sm btn-outline btn-primary"
              disabled={sparepartsLoading}
            >
              Lihat Semua
            </button>
            {showClose && (
              <button
                onClick={() => handleClose(toggleShowClose)}
                className="btn btn-sm btn-outline btn-primary"
                disabled={sparepartsLoading}
              >
                Close
              </button>
            )}
          </div>

          <InventoryTable
            type="sparepart"
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            getKategoriName={getKategoriName}
            setData={setSpareparts}
            queryClient={queryClient}
          />

          <Pagination
            totalItems={filteredData.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />

          <ConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            modalContent={modalContent}
            setInventaris={setSpareparts}
            queryClient={queryClient}
          />
        </div>
      )}
    </CloseHandler>
  );
};

export default Sparepart;

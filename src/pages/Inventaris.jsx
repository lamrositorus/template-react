import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPackage, FiUsers, FiDollarSign, FiBox } from 'react-icons/fi';
import CloseHandler from '../components/CloseHandler';
import ConfirmationModal from '../components/ConfirmationModal';
import InventoryCard from '../components/InventoryCard';

export const InventoryPage = () => {
  const queryClient = useQueryClient();

  const [inventaris, setInventaris] = useState({
    kategori: [],
    mekanik: [],
    pengeluaran: [],
    modal: [],
    stok_masuk: [],
  });
  const [originalInventaris, setOriginalInventaris] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', data: null });

  const {
    isLoading,
    error,
    data: inventarisData,
  } = useQuery({
    queryKey: ['inventaris'],
    queryFn: async () => {
      const data = await API_Source.getAllInventaris();
      console.log('Raw data dari API_Source.getAllInventaris:', data);
      return data || { kategori: [], mekanik: [], pengeluaran: [], modal: [], stok_masuk: [] };
    },
    onSuccess: (data) => {
      console.log('onSuccess - Respons API getAllInventaris:', data);
      const initialData = {
        kategori: Array.isArray(data?.kategori) ? [...data.kategori] : [],
        mekanik: Array.isArray(data?.mekanik) ? [...data.mekanik] : [],
        pengeluaran: Array.isArray(data?.pengeluaran) ? [...data.pengeluaran] : [],
        modal: Array.isArray(data?.modal) ? [...data.modal] : [],
        stok_masuk: Array.isArray(data?.stok_masuk) ? [...data.stok_masuk] : [],
      };
      console.log('Data awal inventaris yang diproses:', initialData);
      setInventaris(initialData);
      setOriginalInventaris(initialData);
    },
    onError: (err) => {
      console.error('Error saat memuat inventaris:', err.message);
      toast.error(`Gagal memuat inventaris: ${err.message}`);
      const fallbackData = {
        kategori: [],
        mekanik: [],
        pengeluaran: [],
        modal: [],
        stok_masuk: [],
      };
      setInventaris(fallbackData);
      setOriginalInventaris(fallbackData);
    },
  });

  useEffect(() => {
    if (!originalInventaris && !isLoading && !error) {
      console.log('useEffect: Mengatur originalInventaris dari inventaris saat ini karena null');
      setOriginalInventaris({ ...inventaris });
    }
  }, [originalInventaris, isLoading, error, inventaris]);

  const {
    data: spareparts,
    isLoading: sparepartsLoading,
    error: sparepartsError,
  } = useQuery({
    queryKey: ['spareparts'],
    queryFn: API_Source.getSparepart,
    onSuccess: (data) => {
      console.log('Respons API getSparepart (untuk stok_masuk):', data);
    },
    onError: (err) => {
      console.error('Error saat memuat spareparts:', err.message);
      toast.error(`Gagal memuat sparepart: ${err.message}`);
    },
  });

  const getSparepartName = (sperpat_id) => {
    if (sparepartsLoading) return 'Memuat...';
    if (sparepartsError || !spareparts?.data) return 'Tidak diketahui';
    const sparepart = spareparts?.data.find((sp) => sp.id === sperpat_id);
    return sparepart ? sparepart.nama : 'Tidak ditemukan';
  };

  const handleViewAll = async (type, toggleShowClose) => {
    if (isLoading) {
      toast.warn('Data sedang dimuat, silakan tunggu.');
      return;
    }
    try {
      let result;
      switch (type) {
        case 'kategori':
          result = await API_Source.getKategori();
          break;
        case 'mekanik':
          result = await API_Source.getMekanik();
          break;
        case 'pengeluaran':
          result = await API_Source.getPengeluaran();
          break;
        case 'modal':
          result = await API_Source.getModal();
          break;
        case 'stok_masuk':
          result = await API_Source.getStokMasuk();
          break;
        default:
          throw new Error('Invalid type');
      }
      console.log(`Respons API handleViewAll untuk ${type}:`, result);
      const updatedData = Array.isArray(result)
        ? [...result]
        : Array.isArray(result?.data)
          ? [...result.data]
          : [];
      console.log(`Data ${type} setelah View All:`, updatedData);
      setInventaris((prev) => {
        const newInventaris = { ...prev, [type]: updatedData };
        console.log(`inventaris setelah handleViewAll untuk ${type}:`, newInventaris);
        return newInventaris;
      });
      toggleShowClose(type, true); // Aktifkan tombol Close
      toast.success(`Data ${type} berhasil diperbarui!`);
    } catch (err) {
      console.error(`Error saat handleViewAll untuk ${type}:`, err.message);
      toast.error(`Gagal memuat ${type}: ${err.message}`);
    }
  };

  const handleClose = (type, toggleShowClose) => {
    console.log(`Mengembalikan ${type} ke data awal`);
    if (!originalInventaris || !Array.isArray(originalInventaris[type])) {
      console.warn(`originalInventaris[${type}] tidak valid atau kosong:`, originalInventaris);
      setInventaris((prev) => ({ ...prev, [type]: [] }));
    } else {
      setInventaris((prev) => ({ ...prev, [type]: [...originalInventaris[type]] }));
    }
    toggleShowClose(type, false); // Nonaktifkan tombol Close
    toast.info(`Data ${type} dikembalikan ke semula.`);
  };

  const handleSubmit = (type, data) => {
    setModalContent({ type, data });
    setShowModal(true);
  };

  if (isLoading || sparepartsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  if (error) return <div className="text-error">Error: {error.message}</div>;
  if (sparepartsError) return <div className="text-error">Error: {sparepartsError.message}</div>;

  return (
    <CloseHandler isMultiType={true}>
      {({ showClose, toggleShowClose }) => (
        <div className="p-8 bg-base-100 min-h-screen">
          <ToastContainer position="top-right" autoClose={3000} />
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <FiPackage className="text-primary" /> Manajemen Inventaris
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InventoryCard
              type="kategori"
              title="Kategori"
              icon={<FiPackage className="text-secondary" />}
              color="secondary"
              data={inventaris.kategori}
              showClose={showClose.kategori}
              onViewAll={(type) => handleViewAll(type, toggleShowClose)}
              onClose={() => handleClose('kategori', toggleShowClose)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <InventoryCard
              type="mekanik"
              title="Mekanik"
              icon={<FiUsers className="text-accent" />}
              color="accent"
              data={inventaris.mekanik}
              showClose={showClose.mekanik}
              onViewAll={(type) => handleViewAll(type, toggleShowClose)}
              onClose={() => handleClose('mekanik', toggleShowClose)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <InventoryCard
              type="pengeluaran"
              title="Pengeluaran"
              icon={<FiDollarSign className="text-error" />}
              color="error"
              data={inventaris.pengeluaran}
              showClose={showClose.pengeluaran}
              onViewAll={(type) => handleViewAll(type, toggleShowClose)}
              onClose={() => handleClose('pengeluaran', toggleShowClose)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <InventoryCard
              type="modal"
              title="Modal"
              icon={<FiDollarSign className="text-warning" />}
              color="warning"
              data={inventaris.modal}
              showClose={showClose.modal}
              onViewAll={(type) => handleViewAll(type, toggleShowClose)}
              onClose={() => handleClose('modal', toggleShowClose)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <InventoryCard
              type="stok_masuk"
              title="Stok Masuk"
              icon={<FiBox className="text-success" />}
              data={inventaris.stok_masuk}
              showClose={showClose.stok_masuk}
              onViewAll={(type) => handleViewAll(type, toggleShowClose)}
              onClose={() => handleClose('stok_masuk', toggleShowClose)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              getSparepartName={getSparepartName}
            />
          </div>
          <ConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            modalContent={modalContent}
            setInventaris={setInventaris}
            queryClient={queryClient}
          />
        </div>
      )}
    </CloseHandler>
  );
};

export default InventoryPage;

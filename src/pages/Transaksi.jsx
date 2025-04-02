import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { API_Source } from '../global/Apisource';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiShoppingCart } from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmationModalTransaction';
import TotalProfit from '../components/TotalProfit.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';

export const TransactionPage = () => {
  const queryClient = useQueryClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    nama_pelanggan: '',
    mekanik_id: '',
    items: [],
    is_grosir: false,
    uang_masuk: '',
    ongkos_pasang: 0,
  });

  const {
    data: transaksiData,
    isLoading: transaksiLoading,
    error: transaksiError,
  } = useQuery({
    queryKey: ['transaksi'],
    queryFn: API_Source.getAllTransaksi,
  });

  const { data: mekanikData, isLoading: mekanikLoading } = useQuery({
    queryKey: ['mekanik'],
    queryFn: API_Source.getMekanik,
  });

  const { data: sparepartData, isLoading: sparepartLoading } = useQuery({
    queryKey: ['sparepart'],
    queryFn: API_Source.getSparepart,
  });

  const createTransaksiMutation = useMutation({
    mutationFn: API_Source.createTransaksi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaksi'] });
      toast.success('Transaksi berhasil dibuat!');
      setFormData({
        nama_pelanggan: '',
        mekanik_id: '',
        items: [],
        is_grosir: false,
        uang_masuk: '',
        ongkos_pasang: 0,
      });
      setShowConfirmModal(false);
    },
    onError: (error) => {
      toast.error(`Gagal membuat transaksi: ${error.message}`);
    },
  });

  const confirmTransaction = async () => {
    const payload = {
      nama_pelanggan: formData.nama_pelanggan,
      mekanik_id: formData.mekanik_id || null,
      items: formData.items,
      is_grosir: formData.is_grosir,
      uang_masuk: parseFloat(formData.uang_masuk),
      ongkos_pasang: parseFloat(formData.ongkos_pasang) || 0,
    };
    console.log('Payload sent:', JSON.stringify(payload));
    await createTransaksiMutation.mutateAsync(payload); // Gunakan mutateAsync untuk pastikan await
  };

  if (transaksiLoading || mekanikLoading || sparepartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  if (transaksiError) {
    return <div className="text-error text-center py-8">Error: {transaksiError.message}</div>;
  }

  return (
    <div className="p-4 sm:p-8 bg-base-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 justify-center sm:justify-start">
        <FiShoppingCart className="text-primary" />
        Manajemen Transaksi
      </h1>

      <TransactionForm
        formData={formData}
        setFormData={setFormData}
        sparepartData={sparepartData}
        mekanikData={mekanikData}
        onSubmit={() => setShowConfirmModal(true)}
      />

      <TotalProfit totalKeuntungan={transaksiData?.total_keuntungan} />

      <TransactionList transaksiData={transaksiData} sparepartData={sparepartData} />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmTransaction}
      />
    </div>
  );
};

export default TransactionPage;
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { API_Source } from '../global/Apisource';

const ConfirmationModal = ({
  isOpen,
  onClose,
  modalContent,
  setInventaris,
  queryClient,
  customConfirm,
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const addDataMutation = useMutation({
    mutationFn: async ({ type, data }) => {
      switch (type) {
        case 'sparepart':
          return await API_Source.createSparepart(
            data.nama,
            data.kode,
            data.kategori_id,
            data.stok,
          );
        case 'kategori':
          return await API_Source.createKategori(data);
        case 'mekanik':
          return await API_Source.createMekanik(data);
        case 'pengeluaran':
          return await API_Source.createPengeluaran(Number(data.jumlah), data.deskripsi);
        case 'modal':
          return await API_Source.createModal(Number(data.jumlah), data.tanggal);
        case 'stok_masuk':
          return await API_Source.createStokMasuk(data.sperpat_id, data.jumlah, data.keterangan);
        default:
          throw new Error('Invalid type');
      }
    },
    onSuccess: (newData, variables) => {
      setInventaris((prev) => {
        if (variables.type === 'sparepart') {
          const updatedData = Array.isArray(prev) ? [newData, ...prev] : [newData];
          console.log('Spareparts setelah update:', updatedData);
          return updatedData;
        } else {
          const key = variables.type;
          const updatedData = [newData, ...(prev[key] || [])];
          console.log(`Inventaris ${key} setelah update:`, updatedData);
          return { ...prev, [key]: updatedData };
        }
      });
      toast.success('Data berhasil ditambahkan!'); // Toast sukses untuk tambah data
      queryClient.invalidateQueries([variables.type === 'sparepart' ? 'spareparts' : 'inventaris']);
      onClose();
    },
    onError: (err) => {
      toast.error(`Gagal: ${err.message}`);
      console.error('Error saat menambah data:', err);
    },
  });

  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    if (
      customConfirm &&
      (modalContent.type === 'delete_sparepart' || modalContent.type === 'edit_sparepart_kode')
    ) {
      customConfirm(); // Panggil customConfirm untuk edit/hapus
    } else if (modalContent.type) {
      addDataMutation.mutate(modalContent); // Panggil mutasi untuk tambah data
    } else {
      toast.error('Tipe aksi tidak valid');
      console.error('Modal content tidak valid:', modalContent);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      open={isOpen}
      className="modal modal-bottom sm:modal-middle"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div className="modal-box">
        <h3 id="modal-title" className="font-bold text-lg">
          {modalContent.type === 'delete_sparepart'
            ? 'Konfirmasi Penghapusan Data'
            : modalContent.type === 'edit_sparepart_kode'
              ? 'Konfirmasi Pengeditan Kode'
              : 'Konfirmasi Penambahan Data'}
        </h3>
        <p className="py-4">
          {modalContent.type === 'delete_sparepart'
            ? 'Apakah Anda yakin ingin menghapus sparepart ini?'
            : modalContent.type === 'edit_sparepart_kode'
              ? 'Apakah Anda yakin ingin mengubah kode sparepart ini?'
              : 'Apakah Anda yakin ingin menambahkan data ini?'}
        </p>
        <pre className="mt-2 p-2 rounded">{JSON.stringify(modalContent.data, null, 2)}</pre>
        <div className="modal-action">
          <button
            ref={cancelButtonRef}
            className="btn"
            onClick={onClose}
            aria-label="Batalkan aksi"
          >
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={
              addDataMutation.isPending &&
              modalContent.type !== 'delete_sparepart' &&
              modalContent.type !== 'edit_sparepart_kode'
            }
            aria-label="Konfirmasi aksi"
          >
            {addDataMutation.isPending &&
            modalContent.type !== 'delete_sparepart' &&
            modalContent.type !== 'edit_sparepart_kode' ? (
              <span className="loading loading-spinner loading-sm" aria-hidden="true"></span>
            ) : (
              'Konfirmasi'
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true"></div>
    </dialog>
  );
};

export default ConfirmationModal;

import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box w-11/12 max-w-md sm:max-w-lg">
        <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
          <FiCheckCircle className="inline" /> Konfirmasi Transaksi
        </h3>
        <p className="py-4 text-sm sm:text-base">Apakah data transaksi sudah benar?</p>
        <div className="modal-action">
          <button className="btn btn-sm sm:btn-md" onClick={onClose}>
            Batal
          </button>
          <button className="btn btn-primary btn-sm sm:btn-md" onClick={onConfirm}>
            Konfirmasi
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmModal;

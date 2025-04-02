import React, { useState, useRef, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const modalRef = useRef(null); // Ref untuk fokus modal
  const cancelButtonRef = useRef(null); // Ref untuk fokus tombol Batal

  // Fokus ke modal saat dibuka dan tangani tombol Escape
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus(); // Fokus ke modal untuk screen reader
      cancelButtonRef.current?.focus(); // Fokus ke tombol Batal untuk keyboard navigation
    }
  }, [isOpen]);

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && !isConfirming) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isConfirming]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Gagal konfirmasi:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      open={isOpen}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1} // Membuat modal fokusable
    >
      <div className="modal-box w-11/12 max-w-md sm:max-w-lg">
        <h3
          id="modal-title"
          className="font-bold text-lg sm:text-xl flex items-center gap-2"
        >
          <FiCheckCircle aria-hidden="true" /> Konfirmasi Transaksi
        </h3>
        <p className="py-4 text-sm sm:text-base">Apakah data transaksi sudah benar?</p>
        <div className="modal-action flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            className="btn btn-sm sm:btn-md btn-neutral"
            onClick={onClose}
            disabled={isConfirming}
            aria-label="Batalkan konfirmasi transaksi"
          >
            Batal
          </button>
          <button
            className="btn btn-sm sm:btn-md btn-primary"
            onClick={handleConfirm}
            disabled={isConfirming}
            aria-label={
              isConfirming
                ? 'Sedang memproses konfirmasi transaksi'
                : 'Konfirmasi transaksi'
            }
          >
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <span
                  className="loading loading-spinner loading-sm"
                  aria-hidden="true"
                ></span>
                <span>Memproses...</span>
              </span>
            ) : (
              'Konfirmasi'
            )}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-black bg-opacity-50 fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
    </dialog>
  );
};

export default ConfirmModal;
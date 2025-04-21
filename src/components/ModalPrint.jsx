import React, { useState, useRef, useEffect } from 'react';
import { FiPrinter } from 'react-icons/fi';

const PrintConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
      cancelButtonRef.current?.focus();
    }
  }, [isOpen]);

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
      console.error('Gagal mencetak:', error);
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
      tabIndex={-1}
    >
      <div className="modal-box w-11/12 max-w-md sm:max-w-lg">
        <h3
          id="modal-title"
          className="font-bold text-lg sm:text-xl flex items-center gap-2"
        >
          <FiPrinter aria-hidden="true" /> Cetak Struk
        </h3>
        <p className="py-4 text-sm sm:text-base">
          Apakah Anda ingin mencetak struk untuk transaksi ini?
        </p>
        <div className="modal-action flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            className="btn btn-sm sm:btn-md btn-neutral"
            onClick={onClose}
            disabled={isConfirming}
            aria-label="Lewati pencetakan struk"
          >
            Lewati
          </button>
          <button
            className="btn btn-sm sm:btn-md btn-primary"
            onClick={handleConfirm}
            disabled={isConfirming}
            aria-label={
              isConfirming
                ? 'Sedang memproses pencetakan struk'
                : 'Cetak struk'
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
              'Cetak'
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

export default PrintConfirmModal;
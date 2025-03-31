import { useState } from 'react';

// Komponen untuk mengelola state showClose
const CloseHandler = ({ isMultiType = false, children }) => {
  // Jika isMultiType true (untuk InventoryPage), gunakan objek
  // Jika false (untuk Sparepart), gunakan boolean
  const initialShowClose = isMultiType
    ? {
        kategori: false,
        mekanik: false,
        pengeluaran: false,
        modal: false,
        stok_masuk: false,
      }
    : false;

  const [showClose, setShowClose] = useState(initialShowClose);

  // Fungsi untuk mengatur showClose
  const toggleShowClose = (type, value) => {
    if (isMultiType) {
      setShowClose((prev) => ({
        ...prev,
        [type]: value !== undefined ? value : !prev[type],
      }));
    } else {
      setShowClose(value !== undefined ? value : !showClose);
    }
  };

  return children({ showClose, toggleShowClose });
};

export default CloseHandler;

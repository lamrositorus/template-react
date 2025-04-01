import React, { useState } from 'react';
import { FiEye, FiX, FiSearch } from 'react-icons/fi';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';
import Pagination from './Pagination';

const InventoryCard = ({
  type,
  title,
  icon,
  color,
  data: initialData,
  showClose,
  onViewAll,
  onClose,
  onSubmit,
  isLoading,
  getKategoriName,
  getSparepartName,
  setData,
  queryClient,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setLocalData] = useState(initialData || []);

  const itemsPerPage = 3;

  const handlePageChange = (page) => {
    console.log(`Mengubah halaman untuk ${type} ke:`, page);
    setCurrentPage(page);
  };

  React.useEffect(() => {
    console.log(`initialData untuk ${type} berubah:`, initialData);
    setLocalData(initialData || []);
    setSearchTerm('');
    setCurrentPage(1);
  }, [initialData, type]);

  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    switch (type) {
      case 'sparepart':
        return (
          item.nama?.toLowerCase().includes(searchLower) ||
          item.kode?.toLowerCase().includes(searchLower)
        );
      case 'kategori':
        return item.nama?.toLowerCase().includes(searchLower);
      case 'mekanik':
        return item.nama?.toLowerCase().includes(searchLower);
      case 'pengeluaran':
        return (
          item.deskripsi?.toLowerCase().includes(searchLower) ||
          String(item.jumlah)?.includes(searchLower)
        );
      case 'modal':
        return (
          String(item.jumlah)?.includes(searchLower) ||
          item.tanggal?.toLowerCase().includes(searchLower)
        );
      case 'stok_masuk':
        return (
          getSparepartName(item.sperpat_id)?.toLowerCase().includes(searchLower) ||
          String(item.jumlah)?.includes(searchLower) ||
          item.keterangan?.toLowerCase().includes(searchLower)
        );
      default:
        return true;
    }
  });

  console.log(`filteredData untuk ${type}:`, filteredData);

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl p-4 sm:p-6">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <div className="skeleton h-8 w-1/3"></div>
            <div className="flex gap-2">
              <div className="skeleton h-8 w-24"></div>
              {showClose && <div className="skeleton h-8 w-24"></div>}
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4">
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
          <div className="skeleton h-12 w-full mb-4"></div>
          <div className="space-y-2">
            <div className="skeleton h-10 w-full"></div>
            <div className="skeleton h-10 w-full"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>
          <div className="skeleton h-10 w-1/2 mt-4 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl card-bordered p-4 sm:p-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-lg font-bold">
            {icon} {title}
            <span className={`badge  ml-2`}>Total: {filteredData.length}</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => onViewAll(type)}
              className={`btn btn-sm btn-ghost btn-${color} shadow-md hover:shadow-lg tooltip`}
              data-tip="Lihat semua data"
              disabled={isLoading}
            >
              <FiEye className="mr-1" /> Lihat Semua
            </button>
            {showClose && (
              <button
                onClick={() => onClose(type)}
                className={`btn btn-sm btn-ghost btn-${color} shadow-md hover:shadow-lg tooltip`}
                data-tip="Tutup kartu"
                disabled={isLoading}
              >
                <FiX className="mr-1" /> Close
              </button>
            )}
          </div>
        </div>

        <InventoryForm type={type} onSubmit={onSubmit} color={color} />

        <div className="divider my-4">Pencarian dan Data</div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text font-semibold">Cari Data</span>
          </label>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Cari ${type === 'sparepart' ? 'nama atau kode' : 'data'}...`}
              className="input input-bordered input-primary w-full pl-10 focus:ring-2 focus:ring-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary text-lg" />
          </div>
        </div>

        <InventoryTable
          type={type}
          data={filteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          getKategoriName={getKategoriName}
          getSparepartName={getSparepartName}
          setData={setData || setLocalData}
          queryClient={queryClient}
        />

        {filteredData.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Tidak ada data ditemukan untuk "{searchTerm}"
          </div>
        )}

        <div className="mt-6">
          <Pagination
            totalItems={filteredData.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;

import React, { useState, useRef, useEffect } from 'react';
import { API_Source } from '../global/Apisource';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const InventoryTable = ({
  type,
  data,
  currentPage,
  itemsPerPage,
  getKategoriName,
  getSparepartName,
  setData,
  queryClient,
}) => {
  console.log(`Data untuk tabel ${type} di InventoryTable:`, data);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = Array.isArray(data)
    ? data.slice(startIndex, startIndex + itemsPerPage)
    : [];

  const [editingId, setEditingId] = useState(null);
  const [editKode, setEditKode] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const kodeInputRef = useRef(null);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditKode(item.kode);
    console.log('Mengedit item:', { id: item.id, kode: item.kode });
  };

  useEffect(() => {
    if (editingId && kodeInputRef.current) {
      kodeInputRef.current.focus();
    }
  }, [editingId]);

  const handleEditSubmit = (id) => {
    console.log('Submit edit - id:', id, 'editKode:', editKode);
    setEditItem({ id, kode: editKode });
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    console.log('Konfirmasi edit - editItem:', editItem);
    try {
      const updatedSparepart = await API_Source.updateSparepart(
        editItem.id,
        undefined,
        editItem.kode,
        undefined,
        undefined,
      );
      console.log('Respons dari API updateSparepart:', updatedSparepart);

      if (!updatedSparepart || !updatedSparepart.id) {
        throw new Error('Respons API tidak valid');
      }

      toast.success('Kode sparepart berhasil diperbarui!');

      if (queryClient) {
        await queryClient.invalidateQueries(['spareparts']);
        const refreshedData = await queryClient.fetchQuery({
          queryKey: ['spareparts'],
          queryFn: API_Source.getSparepart,
        });
        console.log('Data setelah fetch ulang:', refreshedData);
        if (refreshedData && typeof setData === 'function') {
          setData(Array.isArray(refreshedData.data) ? refreshedData.data : []);
        }
      }

      setEditingId(null);
      setIsEditModalOpen(false);
      setEditItem(null);
    } catch (error) {
      toast.error(`Gagal memperbarui kode sparepart: ${error.message}`);
      console.error('Error saat update:', error);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await API_Source.deleteSparepart(deleteItemId);
      console.log('Respons dari API deleteSparepart:', response);

      if (!response || (response.status && response.status !== 200 && response.status !== 204)) {
        throw new Error('Penghapusan gagal di server');
      }

      toast.success('Sparepart berhasil dihapus!');

      if (queryClient) {
        await queryClient.invalidateQueries(['spareparts']);
        const refreshedData = await queryClient.fetchQuery({
          queryKey: ['spareparts'],
          queryFn: API_Source.getSparepart,
        });
        console.log('Data setelah fetch ulang:', refreshedData);
        if (refreshedData && typeof setData === 'function') {
          setData(Array.isArray(refreshedData.data) ? refreshedData.data : []);
        }
      }

      setIsDeleteModalOpen(false);
      setDeleteItemId(null);
    } catch (error) {
      toast.error(`Gagal menghapus sparepart: ${error.message}`);
      console.error('Error saat hapus:', error);
      setIsDeleteModalOpen(false);
    }
  };

  const renderTableHeader = () => {
    switch (type) {
      case 'sparepart':
        return (
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Kode</th>
            <th className="px-4 py-2">Kode Beli</th>
            <th className="px-4 py-2">Nama Kategori</th>
            <th className="px-4 py-2">Stok</th>
            <th className="px-4 py-2">Harga Beli</th>
            <th className="px-4 py-2">Harga Jual</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        );
      case 'kategori':
        return (
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Dibuat Pada</th>
          </tr>
        );
      case 'mekanik':
        return (
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Dibuat Pada</th>
          </tr>
        );
      case 'pengeluaran':
        return (
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Jumlah</th>
            <th className="px-4 py-2">Deskripsi</th>
            <th className="px-4 py-2">Dibuat Pada</th>
          </tr>
        );
      case 'modal':
        return (
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Jumlah</th>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">Dibuat Pada</th>
          </tr>
        );
      case 'stok_masuk':
        return (
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nama Sparepart</th>
            <th className="px-4 py-2">Jumlah</th>
            <th className="px-4 py-2">Keterangan</th>
            <th className="px-4 py-2">Dibuat Pada</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableBody = () => {
    if (!paginatedData.length) {
      return (
        <tr>
          <td
            colSpan={type === 'sparepart' ? 9 : type === 'stok_masuk' ? 5 : 4}
            className="text-center py-4"
          >
            Tidak ada data tersedia
          </td>
        </tr>
      );
    }

    return paginatedData.map((item) => {
      if (!item || typeof item !== 'object' || !item.id) {
        console.warn(`Item tidak valid untuk ${type}:`, item);
        return null;
      }

      switch (type) {
        case 'sparepart':
          return editingId === item.id ? (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editKode}
                    onChange={(e) => setEditKode(e.target.value)}
                    className="input input-bordered input-sm w-full max-w-xs"
                    ref={kodeInputRef}
                  />
                  <button
                    onClick={() => handleEditSubmit(item.id)}
                    className="btn btn-sm btn-ghost text-success tooltip"
                    data-tip="Simpan"
                  >
                    <FiSave size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn btn-sm btn-ghost text-error tooltip"
                    data-tip="Batal"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </td>
              <td className="border px-4 py-2">{item.kode_beli || '-'}</td>
              <td className="border px-4 py-2">
                {getKategoriName ? getKategoriName(item.kategori_id) : '-'}
              </td>
              <td className="border px-4 py-2">{item.stok}</td>
              <td className="border px-4 py-2">
                {item.harga_beli !== undefined ? item.harga_beli.toLocaleString('id-ID') : '-'}
              </td>
              <td className="border px-4 py-2">
                {item.harga_jual !== undefined ? item.harga_jual.toLocaleString('id-ID') : '-'}
              </td>
              <td className="border px-4 py-2"></td>
            </tr>
          ) : (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2">{item.kode}</td>
              <td className="border px-4 py-2">{item.kode_beli || '-'}</td>
              <td className="border px-4 py-2">
                {getKategoriName ? getKategoriName(item.kategori_id) : '-'}
              </td>
              <td className="border px-4 py-2">{item.stok}</td>
              <td className="border px-4 py-2">
                {item.harga_beli !== undefined ? item.harga_beli.toLocaleString('id-ID') : '-'}
              </td>
              <td className="border px-4 py-2">
                {item.harga_jual !== undefined ? item.harga_jual.toLocaleString('id-ID') : '-'}
              </td>
              <td className="border px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="btn btn-sm btn-ghost text-primary hover:bg-primary hover:text-white tooltip"
                    data-tip="Edit Kode"
                  >
                    <FiEdit size={18} />
                  </button>
                </div>
              </td>
            </tr>
          );
        case 'kategori':
          return (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2">{formatDate(item.created_at)}</td>
            </tr>
          );
        case 'mekanik':
          return (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2">{formatDate(item.created_at)}</td>
            </tr>
          );
        case 'pengeluaran':
          return (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.jumlah.toLocaleString('id-ID')}</td>
              <td className="border px-4 py-2">{item.deskripsi}</td>
              <td className="border px-4 py-2">{formatDate(item.created_at)}</td>
            </tr>
          );
        case 'modal':
          return (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.jumlah.toLocaleString('id-ID')}</td>
              <td className="border px-4 py-2">{formatDate(item.tanggal)}</td>
              <td className="border px-4 py-2">{formatDate(item.created_at)}</td>
            </tr>
          );
        case 'stok_masuk':
          return (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">
                {getSparepartName ? getSparepartName(item.sperpat_id) : '-'}
              </td>
              <td className="border px-4 py-2">{item.jumlah}</td>
              <td className="border px-4 py-2">{item.keterangan || '-'}</td>
              <td className="border px-4 py-2">{formatDate(item.created_at)}</td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        modalContent={{
          type: 'delete_sparepart',
          data: { id: deleteItemId },
        }}
        setInventaris={setData}
        queryClient={queryClient}
        customConfirm={handleDeleteConfirm}
      />

      <ConfirmationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        modalContent={{
          type: 'edit_sparepart_kode',
          data: editItem ? { id: editItem.id, kode: editItem.kode } : {},
        }}
        setInventaris={setData}
        queryClient={queryClient}
        customConfirm={handleEditConfirm}
      />
    </>
  );
};

export default InventoryTable;

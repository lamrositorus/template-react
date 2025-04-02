import React, { useState } from 'react';
import { FiUser, FiTool, FiPackage, FiDollarSign, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TransactionForm = ({ formData, setFormData, sparepartData, mekanikData, onSubmit }) => {
  const [newItem, setNewItem] = useState({ sperpat_id: '', jumlah: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    if (!newItem.sperpat_id || !newItem.jumlah) {
      toast.error('Pilih sparepart dan masukkan jumlah.');
      return;
    }
    const jumlah = parseInt(newItem.jumlah, 10);
    if (isNaN(jumlah) || jumlah <= 0) {
      toast.error('Jumlah harus lebih besar dari 0.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { sperpat_id: newItem.sperpat_id, jumlah }],
    }));
    setNewItem({ sperpat_id: '', jumlah: '' });
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTransaction = () => {
    const uang_masuk = parseFloat(formData.uang_masuk) || 0;
    const ongkos_pasang = parseFloat(formData.ongkos_pasang) || 0;

    const total_pembayaran =
      formData.items.reduce((sum, item) => {
        const selectedSparepart = sparepartData?.data?.find((sp) => sp.id === item.sperpat_id);
        if (!selectedSparepart) return sum;
        const harga_jual = formData.is_grosir
          ? selectedSparepart.harga_jual * 0.9
          : selectedSparepart.harga_jual;
        return sum + harga_jual * item.jumlah;
      }, 0) + ongkos_pasang;

    const uang_kembalian = uang_masuk - total_pembayaran;
    return { total_pembayaran, uang_kembalian };
  };

  const { total_pembayaran, uang_kembalian } = calculateTransaction();

  const validateAndSubmit = (e) => {
    e.preventDefault();
    console.log('formData before validation:', formData); // Debugging

    const uang_masuk = parseFloat(formData.uang_masuk);
    const ongkos_pasang = parseFloat(formData.ongkos_pasang) || 0;

    if (!formData.nama_pelanggan || isNaN(uang_masuk) || formData.items.length === 0) {
      toast.error('Nama pelanggan, uang masuk, dan minimal satu barang wajib diisi.');
      return;
    }

    if (uang_masuk < 0) {
      toast.error('Uang masuk harus lebih besar atau sama dengan 0.');
      return;
    }

    if (ongkos_pasang < 0) {
      toast.error('Ongkos pasang harus lebih besar atau sama dengan 0.');
      return;
    }

    if (uang_masuk < total_pembayaran) {
      toast.error(
        `Uang masuk (Rp${uang_masuk.toLocaleString('id-ID')}) harus lebih besar atau sama dengan total pembayaran (Rp${total_pembayaran.toLocaleString('id-ID')}).`,
      );
      return;
    }

    onSubmit();
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-6 sm:mb-8">
      <div className="card-body">
        <h2 className="card-title mb-4 sm:mb-6 text-lg sm:text-xl flex items-center gap-2">
          <FiCheckCircle className="text-secondary" /> Form Transaksi Baru
        </h2>

        <form onSubmit={validateAndSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FiUser /> Nama Pelanggan
              </span>
            </label>
            <input
              type="text"
              name="nama_pelanggan"
              value={formData.nama_pelanggan}
              onChange={handleInputChange}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FiTool /> Mekanik
              </span>
            </label>
            <select
              name="mekanik_id"
              value={formData.mekanik_id}
              onChange={handleInputChange}
              className="select select-bordered select-accent w-full"
            >
              <option value="">Pilih Mekanik (Opsional)</option>
              {mekanikData?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FiPackage /> Tambah Barang
              </span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                name="sperpat_id"
                value={newItem.sperpat_id}
                onChange={handleNewItemChange}
                className="select select-bordered select-info w-full sm:w-1/2"
              >
                <option value="">Pilih Sparepart</option>
                {sparepartData?.data?.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.nama} (Stok: {sp.stok}) (Harga: Rp.{sp.harga_jual})
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="jumlah"
                value={newItem.jumlah}
                onChange={handleNewItemChange}
                className="input input-bordered input-warning w-full sm:w-1/4"
                min="1"
                placeholder="Jumlah"
              />
              <button
                type="button"
                onClick={addItem}
                className="btn btn-outline btn-success w-full sm:w-auto"
              >
                Tambah
              </button>
            </div>
          </div>

          {formData.items.length > 0 && (
            <div className="md:col-span-2 overflow-x-auto">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th className="text-xs sm:text-sm">Nama Barang</th>
                    <th className="text-xs sm:text-sm">Jumlah</th>
                    <th className="text-xs sm:text-sm">Harga Satuan</th>
                    <th className="text-xs sm:text-sm">Subtotal</th>
                    <th className="text-xs sm:text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                    const sparepart = sparepartData?.data?.find((sp) => sp.id === item.sperpat_id);
                    const harga_jual = sparepart
                      ? formData.is_grosir
                        ? sparepart.harga_jual * 0.9
                        : sparepart.harga_jual
                      : 0;
                    const subtotal = harga_jual * item.jumlah;
                    return (
                      <tr key={index}>
                        <td className="text-xs sm:text-sm">{sparepart?.nama || 'N/A'}</td>
                        <td className="text-xs sm:text-sm">{item.jumlah}</td>
                        <td className="text-xs sm:text-sm">
                          Rp{(harga_jual || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="text-xs sm:text-sm">
                          Rp{(subtotal || 0).toLocaleString('id-ID')}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="btn btn-ghost btn-sm"
                          >
                            <FiTrash2 className="text-error" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="form-control flex flex-row items-center gap-4 mt-4">
            <label className="cursor-pointer label">
              <input
                type="checkbox"
                name="is_grosir"
                checked={formData.is_grosir}
                onChange={handleInputChange}
                className="checkbox checkbox-success"
              />
              <span className="label-text ml-2">Grosir (Diskon 10%)</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">🔧 Ongkos Pasang</span>
            </label>
            <input
              type="number"
              name="ongkos_pasang"
              value={formData.ongkos_pasang}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FiDollarSign /> Uang Masuk
              </span>
            </label>
            <input
              type="number"
              name="uang_masuk"
              value={formData.uang_masuk}
              onChange={handleInputChange}
              className="input input-bordered input-success w-full"
              min="0"
              step="0.01"
              required
            />
          </div>



          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FiDollarSign /> Total Pembayaran
              </span>
            </label>
            <input
              type="text"
              value={`Rp${(total_pembayaran || 0).toLocaleString('id-ID')}`}
              className="input input-bordered w-full"
              readOnly
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FiDollarSign /> Uang Kembalian
              </span>
            </label>
            <input
              type="text"
              value={`Rp${(uang_kembalian || 0).toLocaleString('id-ID')}`}
              className={`input input-bordered w-full ${uang_kembalian < 0 ? '' : ''}`}
              readOnly
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="btn btn-primary w-full">
              Buat Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;

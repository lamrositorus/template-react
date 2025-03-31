import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { API_Source } from '../global/Apisource';

const InventoryForm = ({ type, onSubmit, color }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sparepart: { nama: '', kode: '', kategori_id: '', stok: '' },
      kategori: '',
      mekanik: '',
      pengeluaran: { jumlah: '', deskripsi: '' },
      modal: { jumlah: '', tanggal: '' },
      stok_masuk: { sperpat_id: '', jumlah: '', keterangan: '' },
    },
  });

  const {
    data: kategori,
    isLoading: kategoriLoading,
    error: kategoriError,
  } = useQuery({
    queryKey: ['kategori'],
    queryFn: API_Source.getKategori,
    onError: (err) => {
      toast.error(`Gagal memuat data kategori: ${err.message}`);
    },
  });

  const {
    data: spareparts,
    isLoading: sparepartsLoading,
    error: sparepartsError,
  } = useQuery({
    queryKey: ['spareparts'],
    queryFn: API_Source.getSparepart,
    onError: (err) => {
      toast.error(`Gagal memuat data sparepart: ${err.message}`);
    },
  });

  const onFormSubmit = (data) => {
    let submitData;
    switch (type) {
      case 'sparepart':
        const stokValue = data.sparepart.stok === '' ? 0 : parseInt(data.sparepart.stok, 10);
        if (isNaN(stokValue) || stokValue < 0) {
          toast.warn('Stok harus berupa angka non-negatif!');
          return;
        }
        submitData = { ...data.sparepart, stok: stokValue };
        break;
      case 'kategori':
        submitData = data.kategori;
        break;
      case 'mekanik':
        submitData = data.mekanik;
        break;
      case 'pengeluaran':
        submitData = data.pengeluaran;
        break;
      case 'modal':
        submitData = data.modal;
        break;
      case 'stok_masuk':
        submitData = { ...data.stok_masuk, jumlah: Number(data.stok_masuk.jumlah) };
        break;
      default:
        return;
    }
    onSubmit(type, submitData);
    reset(); // Reset form setelah submit
  };

  const handleReset = () => {
    reset();
    toast.info('Form telah direset!');
  };

  return (
    <div className="card bg-base-100 shadow-xl card-bordered p-4 sm:p-6 mb-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
        {type === 'sparepart' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nama Sparepart</span>
              </label>
              <Controller
                name="sparepart.nama"
                control={control}
                rules={{ required: 'Nama sparepart wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Masukkan nama sparepart..."
                    className={`input input-primary input-bordered w-full ${errors.sparepart?.nama && 'input-error'}`}
                  />
                )}
              />
              {errors.sparepart?.nama && (
                <span className="text-error text-sm">{errors.sparepart.nama.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Kode</span>
              </label>
              <Controller
                name="sparepart.kode"
                control={control}
                rules={{ required: 'Kode wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Contoh: BU/GA"
                    className={`input input-primary input-bordered w-full uppercase ${errors.sparepart?.kode && 'input-error'}`}
                  />
                )}
              />
              {errors.sparepart?.kode && (
                <span className="text-error text-sm">{errors.sparepart.kode.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Kategori</span>
              </label>
              {kategoriLoading ? (
                <div className="skeleton h-12 w-full"></div>
              ) : kategoriError ? (
                <span className="text-error">Gagal memuat kategori</span>
              ) : (
                <Controller
                  name="sparepart.kategori_id"
                  control={control}
                  rules={{ required: 'Kategori wajib dipilih' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`select select-primary select-bordered w-full ${errors.sparepart?.kategori_id && 'select-error'}`}
                    >
                      <option value="" disabled>
                        Pilih kategori...
                      </option>
                      {kategori?.map((kat) => (
                        <option key={kat.id} value={kat.id}>
                          {kat.nama}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.sparepart?.kategori_id && (
                <span className="text-error text-sm">{errors.sparepart.kategori_id.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Stok (Opsional)</span>
              </label>
              <Controller
                name="sparepart.stok"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Masukkan stok awal..."
                    className="input input-primary input-bordered w-full"
                    min="0"
                  />
                )}
              />
            </div>
            <div className="form-control flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-warning btn-sm shadow-md hover:shadow-lg"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm shadow-md hover:shadow-lg text-white"
              >
                Tambah Sparepart
              </button>
            </div>
          </>
        )}
        {type === 'kategori' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nama Kategori</span>
            </label>
            <div className="flex gap-2">
              <Controller
                name="kategori"
                control={control}
                rules={{ required: 'Nama kategori wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Masukkan nama kategori baru..."
                    className={`input input-secondary input-bordered w-full ${errors.kategori && 'input-error'}`}
                  />
                )}
              />
              <button
                type="submit"
                className="btn btn-secondary btn-sm shadow-md hover:shadow-lg text-white"
              >
                Tambah
              </button>
            </div>
            {errors.kategori && (
              <span className="text-error text-sm">{errors.kategori.message}</span>
            )}
          </div>
        )}
        {type === 'mekanik' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nama Mekanik</span>
            </label>
            <div className="flex gap-2">
              <Controller
                name="mekanik"
                control={control}
                rules={{ required: 'Nama mekanik wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Masukkan nama mekanik baru..."
                    className={`input input-accent input-bordered w-full ${errors.mekanik && 'input-error'}`}
                  />
                )}
              />
              <button
                type="submit"
                className="btn btn-accent btn-sm shadow-md hover:shadow-lg text-white"
              >
                Tambah
              </button>
            </div>
            {errors.mekanik && <span className="text-error text-sm">{errors.mekanik.message}</span>}
          </div>
        )}
        {type === 'pengeluaran' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Jumlah Pengeluaran</span>
              </label>
              <Controller
                name="pengeluaran.jumlah"
                control={control}
                rules={{ required: 'Jumlah wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Masukkan jumlah (Rp)"
                    className={`input input-error input-bordered w-full ${errors.pengeluaran?.jumlah && 'input-error'}`}
                  />
                )}
              />
              {errors.pengeluaran?.jumlah && (
                <span className="text-error text-sm">{errors.pengeluaran.jumlah.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Deskripsi</span>
              </label>
              <Controller
                name="pengeluaran.deskripsi"
                control={control}
                rules={{ required: 'Deskripsi wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Masukkan deskripsi pengeluaran..."
                    className={`input input-error input-bordered w-full ${errors.pengeluaran?.deskripsi && 'input-error'}`}
                  />
                )}
              />
              {errors.pengeluaran?.deskripsi && (
                <span className="text-error text-sm">{errors.pengeluaran.deskripsi.message}</span>
              )}
            </div>
            <div className="form-control flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-warning btn-sm shadow-md hover:shadow-lg"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
              <button
                type="submit"
                className="btn btn-error btn-sm shadow-md hover:shadow-lg text-white"
              >
                Tambah Pengeluaran
              </button>
            </div>
          </>
        )}
        {type === 'modal' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Jumlah Modal</span>
              </label>
              <Controller
                name="modal.jumlah"
                control={control}
                rules={{ required: 'Jumlah wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Masukkan jumlah (Rp)"
                    className={`input input-warning input-bordered w-full ${errors.modal?.jumlah && 'input-error'}`}
                  />
                )}
              />
              {errors.modal?.jumlah && (
                <span className="text-error text-sm">{errors.modal.jumlah.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tanggal</span>
              </label>
              <Controller
                name="modal.tanggal"
                control={control}
                rules={{ required: 'Tanggal wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className={`input input-warning input-bordered w-full ${errors.modal?.tanggal && 'input-error'}`}
                  />
                )}
              />
              {errors.modal?.tanggal && (
                <span className="text-error text-sm">{errors.modal.tanggal.message}</span>
              )}
            </div>
            <div className="form-control flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-warning btn-sm shadow-md hover:shadow-lg"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
              <button
                type="submit"
                className="btn btn-warning btn-sm shadow-md hover:shadow-lg text-white"
              >
                Tambah Modal
              </button>
            </div>
          </>
        )}
        {type === 'stok_masuk' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nama Sparepart</span>
              </label>
              {sparepartsLoading ? (
                <div className="skeleton h-12 w-full"></div>
              ) : sparepartsError ? (
                <span className="text-error">Gagal memuat sparepart</span>
              ) : (
                <Controller
                  name="stok_masuk.sperpat_id"
                  control={control}
                  rules={{ required: 'Sparepart wajib dipilih' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`select select-success select-bordered w-full ${errors.stok_masuk?.sperpat_id && 'select-error'}`}
                    >
                      <option value="" disabled>
                        Pilih sparepart...
                      </option>
                      {spareparts?.data?.map((sparepart) => (
                        <option key={sparepart.id} value={sparepart.id}>
                          {sparepart.nama}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.stok_masuk?.sperpat_id && (
                <span className="text-error text-sm">{errors.stok_masuk.sperpat_id.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Jumlah</span>
              </label>
              <Controller
                name="stok_masuk.jumlah"
                control={control}
                rules={{ required: 'Jumlah wajib diisi' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Masukkan jumlah stok..."
                    className={`input input-success input-bordered w-full ${errors.stok_masuk?.jumlah && 'input-error'}`}
                  />
                )}
              />
              {errors.stok_masuk?.jumlah && (
                <span className="text-error text-sm">{errors.stok_masuk.jumlah.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Keterangan (Opsional)</span>
              </label>
              <Controller
                name="stok_masuk.keterangan"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Masukkan keterangan..."
                    className="input input-success input-bordered w-full"
                  />
                )}
              />
            </div>
            <div className="form-control flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-warning btn-sm shadow-md hover:shadow-lg"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
              <button
                type="submit"
                className="btn btn-success btn-sm shadow-md hover:shadow-lg text-white"
              >
                Tambah Stok
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default InventoryForm;

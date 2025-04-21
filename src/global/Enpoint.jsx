export const BASE_URL = 'http://localhost:5000';
// const BASE_URL = 'https://sparepart-alma.vercel.app';
export const Endpoint = {
  login: `${BASE_URL}/user/login`,
  dashboard: `${BASE_URL}/dashboard`,
  inventaris: `${BASE_URL}/inventaris`,
  inventarisKategori: `${BASE_URL}/inventaris/kategori`,
  inventarisMekanik: `${BASE_URL}/inventaris/mekanik`,
  inventarisPengeluaran: `${BASE_URL}/inventaris/pengeluaran`,
  inventarisModal: `${BASE_URL}/inventaris/modal`,
  inventarisStok: `${BASE_URL}/inventaris/stok`,
  inventarisSparepart: `${BASE_URL}/sparepart`,
  inventarisSparepartById: (id) => `${BASE_URL}/sparepart/${id}`,
  transaksi: `${BASE_URL}/transaksi`,
  laporan: `${BASE_URL}/laporan`,
  laporanMekanik: `${BASE_URL}/laporan_penjualan_mekanik`,
  printId: (id) => `${BASE_URL}/transaksi/${id}/print`
};

import { format } from 'date-fns';
import React, { useState } from 'react';
import { FiList } from 'react-icons/fi';
import Pagination from './Pagination';

const TransactionList = ({ transaksiData, sparepartData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = transaksiData?.transactions?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transaksiData?.transactions?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title mb-4 text-lg sm:text-xl flex items-center gap-2">
          <FiList className="text-accent" /> Daftar Transaksi
        </h2>

        <div className="overflow-x-auto">
          <table className="table table-zebra table-compact w-full">
            <thead>
              <tr>
                <th className="text-xs sm:text-sm">Pelanggan</th>
                <th className="text-xs sm:text-sm">Sparepart</th>
                <th className="text-xs sm:text-sm">Jumlah</th>
                <th className="text-xs sm:text-sm">Harga (Kode)</th>
                <th className="text-xs sm:text-sm">Total (Kode)</th>
                <th className="text-xs sm:text-sm">Keuntungan (Kode)</th>
                <th className="text-xs sm:text-sm">Pembayaran (Kode)</th>
                <th className="text-xs sm:text-sm">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((t) => (
                <tr key={t.id}>
                  <td className="text-xs sm:text-sm">{t.nama_pelanggan}</td>
                  <td className="text-xs sm:text-sm">
                    {t.items
                      .map(
                        (item) =>
                          sparepartData?.data?.find((sp) => sp.id === item.sperpat_id)?.nama ||
                          'N/A',
                      )
                      .join(', ')}
                  </td>
                  <td className="text-xs sm:text-sm">
                    {t.items.map((item) => `${item.jumlah}x`).join(', ')}
                  </td>
                  <td className="font-bold text-xs sm:text-sm">
                    {t.items.map((item) => item.harga_jual).join(', ')}
                  </td>
                  <td className="font-bold text-xs sm:text-sm">{t.total_pembayaran}</td>
                  <td className="text-success font-bold text-xs sm:text-sm">{t.keuntungan}</td>
                  <td className="text-xs sm:text-sm">
                    <div className="badge badge-success">{t.uang_masuk}</div>
                  </td>
                  <td className="text-xs sm:text-sm">
                    {format(new Date(t.created_at), 'dd/MM/yy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionList;
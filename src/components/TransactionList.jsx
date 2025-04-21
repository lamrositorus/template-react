import React, { useState } from 'react';
import { FiList, FiPrinter } from 'react-icons/fi';
import Pagination from './Pagination';
import { format } from 'date-fns';
import { API_Source } from '../global/Apisource';
import { toast } from 'react-toastify';
import { printReceipt } from '../utils/printer';

const TransactionList = ({ transaksiData, sparepartData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = transaksiData?.transactions?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedTransactions = transaksiData?.transactions?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSparepartName = (sperpatId) => {
    const sparepart = sparepartData?.data?.find((sp) => sp.id === sperpatId);
    return sparepart?.nama || 'N/A';
  };

  const handlePrint = async (transaksiId) => {
    try {
      console.log(`Initiating print for transaksi ID: ${transaksiId}`);
      const printData = await API_Source.printTransaksi(transaksiId);
      console.log("Print data received:", JSON.stringify(printData, null, 2));
      await printReceipt(transaksiId); // Panggil dengan ID
      toast.success("Struk berhasil dicetak!");
    } catch (error) {
      console.error("Print error:", error);
      toast.error(`Gagal mencetak struk: ${error.message}`);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg mt-6">
      <div className="card-body">
        <h2 className="card-title mb-4 text-lg sm:text-xl flex items-center gap-2">
          <FiList className="text-accent" /> Daftar Transaksi
        </h2>

        <div className="overflow-x-auto text-left">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="text-center">Transaksi ID</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Items</th>
                <th className="text-center">Total</th>
                <th className="text-center">Keuntungan</th>
                <th className="text-center">Tanggal</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaksi) => (
                  <tr key={transaksi.id} className="transition-all">
                    <td className="text-center">{transaksi.id}</td>
                    <td className="text-center">{transaksi.nama_pelanggan}</td>
                    <td className="text-center">
                      <ul className="list-disc pl-4 text-left">
                        {transaksi.items.map((item, index) => (
                          <li key={index}>
                            {getSparepartName(item.sperpat_id)} - Jumlah: {item.jumlah}, Harga: {item.harga_jual.toLocaleString("id-ID")}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-center">{transaksi.total_pembayaran.toLocaleString("id-ID")}</td>
                    <td className="text-center">{transaksi.keuntungan.toLocaleString("id-ID")}</td>
                    <td className="text-center">
                      {format(new Date(transaksi.created_at), 'dd/MM/yy HH:mm')}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handlePrint(transaksi.id)}
                        title="Cetak Struk"
                        aria-label={`Cetak struk untuk transaksi ${transaksi.id}`}
                      >
                        <FiPrinter className="text-primary" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Tidak ada data transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > itemsPerPage && (
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
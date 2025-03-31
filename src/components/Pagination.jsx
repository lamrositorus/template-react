import React from 'react';

const Pagination = ({ totalItems, currentPage, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPageButtons = 3;

  const handlePrevious = () => {
    if (currentPage > 1) {
      console.log('Klik Previous, halaman baru:', currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      console.log('Klik Next, halaman baru:', currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= maxPageButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 2) {
        startPage = 1;
        endPage = maxPageButtons;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - maxPageButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    startPage = Math.max(1, startPage);
    endPage = Math.min(totalPages, endPage);

    // Tambahkan tombol "First" jika currentPage > 2
    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          className="btn btn-sm btn-outline join-item"
          onClick={() => {
            console.log('Klik First, halaman baru:', 1);
            onPageChange(1);
          }}
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2 text-gray-500">
            ...
          </span>,
        );
      }
    }

    // Render nomor halaman
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm join-item ${currentPage === i ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            console.log('Klik nomor halaman:', i);
            onPageChange(i);
          }}
        >
          {i}
        </button>,
      );
    }

    // Tambahkan tombol "Last" dan ellipsis jika endPage < totalPages
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2 text-gray-500">
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key="last"
          className="btn btn-sm btn-outline join-item"
          onClick={() => {
            console.log('Klik Last, halaman baru:', totalPages);
            onPageChange(totalPages);
          }}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  if (totalItems <= itemsPerPage) return null; // Sembunyikan jika tidak perlu pagination

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="btn btn-sm btn-outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <div className="join">{renderPageNumbers()}</div>
      <button
        className="btn btn-sm btn-outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const TotalProfit = ({ totalKeuntungan }) => {
  return (
    <div className="stats shadow mb-6 sm:mb-8 bg-success text-success-content w-full max-w-md mx-auto">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <FiDollarSign className="text-2xl sm:text-3xl" />
        </div>
        <div className="stat-title">Total Keuntungan</div>
        <div className="stat-value text-lg sm:text-2xl">
          Rp. {(totalKeuntungan || 0).toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  );
};

export default TotalProfit;

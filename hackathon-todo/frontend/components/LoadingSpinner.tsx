import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-4 h-4"> {/* 16px = 4rem */}
        {/* Thin ring spinner */}
        <div className="w-full h-full border border-emerald-400 border-t-emerald-500 border-r-emerald-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
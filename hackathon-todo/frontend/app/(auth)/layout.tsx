import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-xs sm:max-w-sm md:max-w-md w-full space-y-6 sm:space-y-8 p-4 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
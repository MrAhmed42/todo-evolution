'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  authClient: any;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, authClient }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Overlay - Click to close */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-out Menu */}
      <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            Task<span className="text-emerald-500">Flow</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all ${
              isActive('/dashboard')
                ? 'bg-emerald-50 text-white shadow-md shadow-emerald-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            My Tasks
          </Link>
          <Link
            href="/chat"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all ${
              isActive('/chat')
                ? 'bg-emerald-50 text-white shadow-md shadow-emerald-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Chat with AI
          </Link>
        </nav>

        {/* User Section at Bottom */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
            <span className="block text-sm font-bold text-slate-700 truncate">
              {user.name || user.email}
            </span>
          </div>
          <button
            onClick={() => {
              authClient.signOut();
              onClose();
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
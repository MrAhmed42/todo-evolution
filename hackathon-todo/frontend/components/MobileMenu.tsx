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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard')
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            My Tasks
          </Link>
          <Link
            href="/chat"
            onClick={onClose}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/chat')
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Chat with AI
          </Link>
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="mb-4">
            <span className="block text-sm font-medium text-slate-700">Welcome, {user.name || user.email}</span>
          </div>
          <button
            onClick={() => {
              authClient.signOut();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
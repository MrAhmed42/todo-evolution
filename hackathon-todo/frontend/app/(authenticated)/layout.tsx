'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import MobileMenu from '../../components/MobileMenu';

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push("/signin");
      } else {
        setUser(session.data.user);
      }
    }
    checkUser();
  }, [router]);

  const isActive = (path: string) => pathname === path;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50"> {/* Lightened background slightly */}
      {/* Header/Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <h1 className="text-xl font-bold text-slate-900">
                  Task<span className="text-emerald-500">Flow</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                My Tasks
              </Link>
              <Link
                href="/chat"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/chat')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Chat with AI
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                id="chat-toggle-button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop User Info - Hidden on mobile */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-slate-600 mr-4">Welcome, {user.name?.split(' ')[0] || user.email?.split('@')[0]}</span>
              <button
                onClick={() => authClient.signOut()}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        authClient={authClient}
      />

      {/* Main Content Area - Optimized Padding for Mobile */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
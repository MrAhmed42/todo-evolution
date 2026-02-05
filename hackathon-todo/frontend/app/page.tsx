'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        // If user is already logged in, redirect to dashboard
        router.push("/dashboard");
      }
    }
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xs sm:max-w-sm md:max-w-md w-full text-center space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Task<span className="text-emerald-500">Flow</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            A simple and powerful way to organize your tasks. <br />
            Stay focused and get things done — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <Link href="/signin"
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 text-center min-h-[48px] flex items-center justify-center">
            Sign In to Dashboard
          </Link>
          <Link href="/signup"
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 text-center min-h-[48px] flex items-center justify-center">
            Create an Account
          </Link>
        </div>
      </div>
      <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 group">
  <a
    href="https://github.com/MrAhmed42"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-full shadow-sm hover:shadow-md hover:border-emerald-500 transition-all duration-300 group-hover:-translate-y-1 min-h-[36px]"
  >
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
    <p className="text-xs sm:text-sm text-slate-600 font-medium">
      Developed by <span className="text-emerald-600 font-bold">Mr. Ahmed</span>
    </p>
    {/* Optional: Small external link icon */}
    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  </a>
</div>
    </div>
  );
}


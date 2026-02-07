'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskDashboard from '../components/TaskDashboard';
import ChatPageContent from '../components/ChatPageContent'; // We'll create this component
import { authClient } from '../lib/auth';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CombinedDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push("/signin");
      } else {
        setUserId(session.data.user.id);
      }
    }
    checkUser();
  }, [router]);

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <LoadingSpinner />
          <p className="text-lg text-slate-600 mt-4">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-full sm:max-w-4xl mx-auto w-full"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center sm:text-left">Dashboard</h1>
        <div className="w-8 sm:w-12 h-1 bg-emerald-500 mt-2 rounded-full ml-0 sm:ml-0"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">My Tasks</h2>
          <TaskDashboard userId={userId} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Chat with AI</h2>
          <ChatPageContent userId={userId} />
        </div>
      </div>
    </motion.div>
  );
}
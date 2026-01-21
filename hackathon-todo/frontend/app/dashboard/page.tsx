"use client"; // This must be at the very top!

import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import TaskDashboard from "../../components/TaskDashboard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { authClient } from "../../lib/auth";
import { useRouter } from "next/navigation";

const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push("/signin"); // Send them back if not logged in
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
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="text-center"
        >
          <div className="mb-4">
            <LoadingSpinner />
          </div>
          <p className="text-lg text-slate-600">Loading your tasks...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants}
      className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Todo List</h1>
          <div className="w-8 sm:w-12 h-1 bg-emerald-500 mt-2 rounded-full"></div>
        </div>
        {/* We pass the userId here to fix the red error */}
        <TaskDashboard userId={userId} />
      </div>
    </motion.main>
  );
}
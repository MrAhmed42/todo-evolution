'use client';

import { motion, Variants } from 'framer-motion';

// Explicitly defining the type as 'Variants' fixes the TypeScript error
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function ClientAnimations({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants}
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      {children}
    </motion.div>
  );
}
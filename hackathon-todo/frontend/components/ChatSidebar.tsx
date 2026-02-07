'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, children }) => {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 640) { // sm breakpoint
        const sidebar = document.getElementById('chat-sidebar');
        const toggleButton = document.getElementById('chat-toggle-button');

        if (sidebar && !sidebar.contains(event.target as Node) &&
            toggleButton && !toggleButton.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.div
            id="chat-sidebar"
            className="fixed top-0 left-0 h-full w-11/12 max-w-sm z-50 bg-white shadow-xl transform -translate-x-full md:static md:translate-x-0 md:w-full md:h-auto md:shadow-none md:z-0"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center md:hidden">
              <h2 className="text-lg font-semibold">Chat</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[calc(100%-60px)] md:h-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
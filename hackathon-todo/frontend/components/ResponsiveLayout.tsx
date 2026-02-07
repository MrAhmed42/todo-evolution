'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftPanelTitle: string;
  rightPanelTitle: string;
  leftPanelWidthClass?: string;
  rightPanelWidthClass?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  leftPanel,
  rightPanel,
  leftPanelTitle,
  rightPanelTitle,
  leftPanelWidthClass = 'w-full md:w-1/2',
  rightPanelWidthClass = 'w-full md:w-1/2'
}) => {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {showLeftPanel && (
          <motion.div
            className={`${leftPanelWidthClass} mb-6 md:mb-0`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">{leftPanelTitle}</h2>
              <button
                onClick={() => setShowLeftPanel(false)}
                className="md:hidden text-slate-500 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {leftPanel}
          </motion.div>
        )}

        {showRightPanel && (
          <motion.div
            className={`${rightPanelWidthClass} ${!showLeftPanel ? '' : 'mt-6 md:mt-0'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">{rightPanelTitle}</h2>
              <button
                onClick={() => setShowRightPanel(false)}
                className="md:hidden text-slate-500 hover:text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {rightPanel}
          </motion.div>
        )}
      </div>

      {/* Toggle buttons for mobile to show hidden panels */}
      {!showLeftPanel && (
        <button
          onClick={() => setShowLeftPanel(true)}
          className="md:hidden fixed bottom-4 left-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {!showRightPanel && (
        <button
          onClick={() => setShowRightPanel(true)}
          className="md:hidden fixed bottom-4 right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ResponsiveLayout;
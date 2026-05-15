import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WarningBannerProps {
  message: string;
  isVisible: boolean;
}

const WarningBanner: React.FC<WarningBannerProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-[#fffbeb] dark:bg-amber-900/20 border border-[#fef3c7] dark:border-amber-900/30 rounded-2xl flex items-start gap-3 shadow-sm"
    >
      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div className="pt-1">
        <p className="text-sm font-bold text-amber-900 dark:text-amber-200 leading-tight">
          Account Status Warning
        </p>
        <p className="text-xs font-medium text-amber-700/80 dark:text-amber-400/80 mt-1">
          {message}
        </p>
      </div>
    </motion.div>
  );
};

export default WarningBanner;

import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import toast from 'react-hot-toast';

export const BadgeToast = ({ t, badgeName }) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="max-w-md w-full bg-surface glass border border-[var(--color-accent1)] shadow-[0_0_20px_rgba(124,58,237,0.3)] rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5"
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[var(--color-accent1)] to-[var(--color-accent2)] flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-bold text-white mb-1">🏅 New Badge Unlocked!</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)] font-medium">
              You earned the <span className="gradient-text font-bold">{badgeName}</span> badge.
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-white/10">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-[var(--color-accent2)] hover:text-[var(--color-accent1)] transition-colors focus:outline-none"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

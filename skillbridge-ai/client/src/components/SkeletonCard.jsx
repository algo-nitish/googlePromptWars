import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden h-full">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
      <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-5/6 mb-6"></div>
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="h-4 bg-white/10 rounded w-1/4 mb-2"></div>
        <div className="h-2 bg-white/10 rounded-full w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;

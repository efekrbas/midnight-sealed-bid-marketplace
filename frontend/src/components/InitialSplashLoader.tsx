"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Shield } from 'lucide-react';

export default function InitialSplashLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Midnight Prover...");

  useEffect(() => {
    // Progress interval animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }

        if (prev === 20) setStatusText("Loading Compact ZK Circuits...");
        if (prev === 55) setStatusText("Connecting to Lace Wallet Connector...");
        if (prev === 85) setStatusText("Verifying Preprod State Integrity...");
        
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden"
        >
          {/* Ambient Radial Orbs */}
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />

          {/* Doppelrand Outer Shell */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-1.5 rounded-[2.5rem] bg-white/[0.03] ring-1 ring-white/15 shadow-[0_0_80px_rgba(168,85,247,0.2)] max-w-sm w-full relative z-10"
          >
            {/* Inner Core */}
            <div className="rounded-[calc(2.5rem-0.375rem)] bg-slate-900/90 p-8 border border-white/10 flex flex-col items-center text-center">
              {/* Logo Hexagon Spinner */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                  <Hexagon className="w-10 h-10 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-950 border border-white/20 text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-extrabold text-white tracking-tight mb-1">
                MIDNIGHT <span className="text-purple-400">MARKET</span>
              </h2>
              <p className="text-[11px] font-mono text-purple-300 uppercase tracking-widest mb-6">
                Level 5 ZK Sealed-Bid Auctions
              </p>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-950 border border-white/10 rounded-full p-1 mb-4">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400">
                <span className="truncate pr-2">{statusText}</span>
                <span className="text-purple-300 font-bold">{progress}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

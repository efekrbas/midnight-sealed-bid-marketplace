import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Hexagon Spinner Container */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>

        <h3 className="text-lg font-extrabold text-white tracking-tight mb-2">
          MIDNIGHT <span className="text-purple-400">NETWORK</span>
        </h3>
        
        <p className="text-xs font-mono text-slate-400 animate-pulse">
          Syncing ZK Circuits & Preprod Ledger...
        </p>

        {/* Progress bar shimmer */}
        <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-marquee" />
        </div>
      </div>
    </div>
  );
}

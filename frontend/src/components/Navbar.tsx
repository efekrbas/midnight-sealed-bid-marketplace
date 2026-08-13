"use client";

import Link from 'next/link';
import { Hexagon, ShieldCheck, Wallet, LogOut } from 'lucide-react';
import { useState } from 'react';
import OnboardingModal from './OnboardingModal';
import ZkProofDrawer from './ZkProofDrawer';
import { useWallet } from '@/context/WalletContext';

export default function Navbar() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showZkDrawer, setShowZkDrawer] = useState(false);
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
      <nav className="w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group">
            <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-105 transition-transform">
              <Hexagon className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">Midnight Market</span>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-5">
            <Link href="/" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block">
              Explore
            </Link>
            <Link href="/create" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block">
              Create Auction
            </Link>
            <Link href="/analytics" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors hidden md:block">
              Analytics
            </Link>

            {/* ZK Inspector Launcher */}
            <button
              onClick={() => setShowZkDrawer(true)}
              className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ZK Inspector</span>
            </button>

            {/* Wallet Connect / Disconnect */}
            {isConnected ? (
              <button 
                onClick={handleDisconnect}
                title="Click to Disconnect Wallet"
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-rose-500/20 border border-emerald-500/30 hover:border-rose-500/40 text-xs font-mono font-bold text-emerald-300 hover:text-rose-300 flex items-center space-x-2 transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-rose-400 animate-pulse" />
                <span>{formatAddress(address) || "Connected"}</span>
                <LogOut className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              <button 
                onClick={handleConnect}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-white/15 text-xs font-bold text-white flex items-center space-x-2 transition-all shadow-md"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <ZkProofDrawer 
        isOpen={showZkDrawer} 
        onClose={() => setShowZkDrawer(false)} 
      />
    </>
  );
}

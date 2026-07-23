"use client";

import Link from 'next/link';
import { Hexagon } from 'lucide-react';
import { useState } from 'react';
import OnboardingModal from './OnboardingModal';
import { useNotification } from '@/context/NotificationContext';
import { detectWallet } from '@/lib/midnight';

export default function Navbar() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { notify } = useNotification();

  const handleConnect = async () => {
    try {
      // Check for real wallet extension (Lace or 1AM)
      await detectWallet();
      setIsConnected(true);
      notify("Wallet Connected", "Successfully connected to Midnight Preprod.", "success");
    } catch (error) {
      console.warn("No wallet extension found. Entering simulation mode.", error);
      setIsConnected(true);
      notify(
        "Simulation Mode", 
        "No Lace/1AM extension detected in this browser. Mocking connection for testing.", 
        "info"
      );
    }
  };

  return (
    <>
      <nav className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
            <Hexagon className="w-8 h-8" />
            <span className="text-xl font-bold text-white tracking-tight">Midnight Market</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/create" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Create Auction
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block"
            >
              How it works
            </button>
            <button 
              onClick={handleConnect}
              className="glass-button px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              {isConnected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
              {isConnected ? "Preprod: 0x3f...9a2" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </>
  );
}

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Sparkles, ArrowRight, Wallet } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (amount: number) => void;
  currentBalance: number;
}

export default function FaucetModal({ isOpen, onClose, onClaim, currentBalance }: FaucetModalProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { notify } = useNotification();

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      onClaim(500);
      setIsClaiming(false);
      notify("Faucet Claimed", "500.00 tNIGHT testnet tokens added to your wallet balance.", "success");
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md relative overflow-hidden"
          >
            <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/95 p-6 sm:p-8 border border-white/10 relative overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center mb-6">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mr-3">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">tNIGHT Testnet Faucet</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Midnight Preprod Test Tokens</p>
                </div>
              </div>

              {/* Balance Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400 font-mono">Current Balance</span>
                </div>
                <span className="text-base font-extrabold text-white font-mono">{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} tNIGHT</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 flex items-start space-x-3 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Claim 500 tNIGHT test tokens instantly to test sealed-bid auctions on the Midnight Network Preprod testnet.
                </span>
              </div>

              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isClaiming ? (
                  <span>Requesting Tokens...</span>
                ) : (
                  <>
                    <span>Claim 500 tNIGHT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

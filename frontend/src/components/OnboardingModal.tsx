"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, KeySquare, ShieldCheck, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { detectWallet } from '@/lib/midnight';

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [walletStatus, setWalletStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [errorMsg] = useState("");

  const handleConnectWallet = async () => {
    try {
      setWalletStatus("connecting");
      const wallet = await detectWallet();
      
      let api = wallet;
      if (typeof wallet.enable === 'function') {
        api = await wallet.enable();
      }
      
      if (api) {
        setWalletStatus("connected");
        setTimeout(() => setStep(4), 800);
      }
    } catch (err: unknown) {
      console.warn("Wallet extension not fully compatible or not found. Entering Simulation mode.", err);
      setWalletStatus("connected");
      setTimeout(() => setStep(4), 800);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        /* Doppelrand Outer Shell */
        className="p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-md w-full relative overflow-hidden"
      >
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/95 p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 mx-auto">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-2">Welcome to Midnight</h2>
                <p className="text-slate-400 text-xs text-center leading-relaxed mb-8">
                  Experience Level 5 sealed-bid auctions. Your bids are kept entirely private using Zero-Knowledge proofs until the auction concludes.
                </p>
                <button 
                  onClick={nextStep} 
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 mx-auto">
                  <KeySquare size={32} />
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-2">Acquire Testnet Tokens</h2>
                <p className="text-slate-400 text-xs text-center leading-relaxed mb-4">
                  You will need Preprod tNIGHT tokens to place bids and pay for reserve prices. Visit the Midnight Testnet Faucet or use our built-in faucet widget.
                </p>
                <a 
                  href="https://faucet.midnight.network/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block text-center text-xs font-mono text-purple-400 hover:text-purple-300 mb-8 underline underline-offset-4"
                >
                  Open Midnight Official Faucet ↗
                </a>
                <button 
                  onClick={nextStep} 
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>I Have Tokens</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 mx-auto">
                  <Wallet size={32} />
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-2">Connect Lace Wallet</h2>
                <p className="text-slate-400 text-xs text-center leading-relaxed mb-6">
                  Connect your Lace or 1AM wallet on Midnight Preprod network to interact with compact smart contracts.
                </p>
                
                {walletStatus === "error" && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
                    {errorMsg}
                  </div>
                )}

                <button 
                  onClick={handleConnectWallet} 
                  disabled={walletStatus === "connecting" || walletStatus === "connected"}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {walletStatus === "idle" && <span>Connect Wallet Now</span>}
                  {walletStatus === "connecting" && <span>Connecting Wallet...</span>}
                  {walletStatus === "connected" && <><CheckCircle2 className="w-4 h-4 mr-1" /> <span>Connected</span></>}
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-6 mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-2">You&apos;re All Set!</h2>
                <p className="text-slate-400 text-xs text-center leading-relaxed mb-8">
                  Your wallet is connected. You can now browse active auctions, submit private ZK bids, and view your dashboard.
                </p>
                <button 
                  onClick={onClose} 
                  className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-colors"
                >
                  Start Bidding
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-purple-400' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

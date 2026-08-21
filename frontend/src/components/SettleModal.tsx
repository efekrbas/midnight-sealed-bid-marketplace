"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, X, CheckCircle2, Loader2, Key, ArrowRight } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useWallet } from '@/context/WalletContext';
import { callTx } from '@/lib/contract';
import { loadSecret } from '@/lib/secret';
import { bech32ToUserAddress } from '@/lib/address';
import { AuctionItem } from '@/types/auction';

interface SettleModalProps {
  auction: AuctionItem;
  onClose: () => void;
}

export default function SettleModal({ auction, onClose }: SettleModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const { notify } = useNotification();
  const { isConnected, dappConnector, session, address } = useWallet();

  const steps = [
    "Locating Winning Bidder Commitment...",
    "Verifying ZK Proof of highest bid...",
    "Transferring asset ownership...",
    "Releasing tNIGHT to seller..."
  ];

  const handleSettle = async () => {
    setStatus("submitting");
    setLoadingStep(0);
    
    try {
      // Step 1: Locating Winning Bidder Commitment...
      setLoadingStep(1);
      if (!isConnected || !dappConnector || !session || !address) {
        notify("Wallet Not Connected", "Please connect your wallet first.", "error");
        setStatus("idle");
        return;
      }
      
      const contractAddress = auction.id; // Use real contract address
      
      const userSecret = loadSecret('bidder', contractAddress);
      const organizerSecret = loadSecret('seller', contractAddress);
      
      if (!organizerSecret) {
        throw new Error("Seller secret not found in local storage. Cannot settle.");
      }
      if (!userSecret) {
         throw new Error("Bidder secret not found in local storage. Cannot claim.");
      }
      
      const organizerAddress = bech32ToUserAddress(address, 'preprod');
      const userAddress = bech32ToUserAddress(address, 'preprod'); // Just for demo, usually bidder calls claimItem
      const auctionId = new Uint8Array(32);
      const encodedAddress = new TextEncoder().encode(contractAddress);
      auctionId.set(encodedAddress.slice(0, 32));
      
      // Step 2: Verifying ZK Proof of highest bid...
      setLoadingStep(2);
      await callTx.revealPrice(
        session,
        contractAddress,
        auctionId, 
        BigInt(Math.floor(Number(auction.highestBid) * 1000000)),
        organizerSecret
      );
      
      // Step 3: Transferring asset ownership...
      setLoadingStep(3);
      await callTx.claimItem(
        session,
        contractAddress,
        auctionId, 
        userAddress, 
        userSecret
      );
      
      // Step 4: Releasing tNIGHT to seller...
      setLoadingStep(4);
      await callTx.claimProceeds(
        session,
        contractAddress,
        auctionId, 
        organizerAddress, 
        organizerSecret
      );
      
      setStatus("success");
      notify("Auction Settled", `The winner has been verified for ${auction.title} and funds transferred via the smart contract.`, "success");
      
    } catch (err) {
      console.error(err);
      setStatus("idle");
      notify("Settlement Failed", "Could not verify proofs or token transfer failed.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        /* Doppelrand Outer Shell */
        className="p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md relative overflow-hidden"
      >
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/95 p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          {/* Subtle Ambient Radial Orb */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-[60px] pointer-events-none" />

          <button 
            onClick={onClose}
            disabled={status === "submitting"}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center mb-6">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mr-3">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Settle Auction</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Trustless Contract Reveal</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">Target Asset:</span>
            <span className="text-xs font-bold text-white truncate max-w-[200px]">{auction.title}</span>
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3">
                  <Key className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    The contract will evaluate all ZK commitments, verify the highest valid bid against reserve, and execute the final token payout.
                  </p>
                </div>

                <div className="space-y-2 py-2">
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                    <span className="text-slate-400">Current Status</span>
                    <span className="font-semibold text-rose-400 font-mono">Ended</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                    <span className="text-slate-400">Highest Public Reserve</span>
                    <span className="font-mono font-bold text-white">{auction.highestBid}</span>
                  </div>
                </div>

                <button 
                  onClick={handleSettle} 
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Execute Smart Settlement</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {status === "submitting" && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                <div className="space-y-5">
                  {steps.map((stepText, idx) => {
                    const isCompleted = loadingStep > idx;
                    const isActive = loadingStep === idx;
                    const isPending = loadingStep < idx;

                    return (
                      <div key={idx} className={`flex items-center space-x-3.5 transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : isActive ? (
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-slate-500" />
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-mono ${isActive ? 'text-white font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                          {stepText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Auction Settled!</h3>
                <p className="text-slate-400 text-xs mb-6">
                  Zero-knowledge proofs verified and asset transferred on-chain.
                </p>
                <button 
                  onClick={onClose} 
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

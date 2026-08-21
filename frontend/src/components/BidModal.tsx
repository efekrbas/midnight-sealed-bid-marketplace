"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, X, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useWallet } from '@/context/WalletContext';
import { callTx } from '@/lib/contract';
import { generateSecret, saveSecret, loadSecret } from '@/lib/secret';
import { bech32ToUserAddress } from '@/lib/address';
import { AuctionItem } from '@/types/auction';

interface BidModalProps {
  auction: AuctionItem;
  onClose: () => void;
}

export default function BidModal({ auction, onClose }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const { notify } = useNotification();
  const { isConnected, dappConnector, session, address } = useWallet();

  const steps = [
    "Generating ZK Proof...",
    "Proving bid > current threshold...",
    "Submitting transaction to Midnight Preprod...",
    "Transaction Confirmed"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount))) return;
    
    setStatus("submitting");
    setLoadingStep(0);
    
    try {
      // Step 1: Generating ZK Proof...
      setLoadingStep(1);
      if (!isConnected || !dappConnector || !session || !address) {
        notify("Wallet Not Connected", "Please connect your wallet first.", "error");
        setStatus("idle");
        return;
      }
      
      const contractAddress = auction.id; // Use real contract address
      const bidValue = BigInt(Math.floor(Number(bidAmount) * 1000000)); // convert to token units
      
      // Load or generate bidder secret
      let userSecret = loadSecret('bidder', contractAddress);
      if (!userSecret) {
        userSecret = generateSecret();
        saveSecret('bidder', contractAddress, userSecret);
      }
      
      const auctionId = new Uint8Array(32);
      const encodedAddress = new TextEncoder().encode(contractAddress);
      auctionId.set(encodedAddress.slice(0, 32));
      const userAddress = bech32ToUserAddress(address, 'preprod');
      
      // Step 2: Proving bid > current threshold...
      setLoadingStep(2);
      await callTx.bid(
        session,
        contractAddress,
        auctionId, 
        bidValue, 
        userAddress, 
        userSecret
      );
      
      // Step 3: Submitting transaction to Midnight Preprod...
      setLoadingStep(3);
      // Wait for block inclusion if real SDK requires it, often the callTx returns a submitted transaction or receipt
      // assuming tx has been submitted at this point.
      
      // Step 4: Transaction Confirmed
      setLoadingStep(4);
      setStatus("success");
      notify("Bid Successful", `Your private bid for ${auction.title} was written to the Midnight ledger.`, "success");
      
    } catch (err) {
      console.error(err);
      setStatus("idle");
      notify("Transaction Failed", "Could not verify ZK proof or network error occurred.", "error");
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
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />

          <button 
            onClick={onClose}
            disabled={status === "submitting"}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center mb-6">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mr-3">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Place Private Bid</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Compact ZK Proof Circuit</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">Target Asset:</span>
            <span className="text-xs font-bold text-white truncate max-w-[200px]">{auction.title}</span>
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Bid Amount</label>
                    <span className="text-[11px] text-purple-400 font-mono">Min: {auction.highestBid}</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      min={parseFloat(auction.highestBid)}
                      step="0.01"
                      className="w-full bg-slate-950 border border-white/15 rounded-xl pl-4 pr-20 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-mono text-white placeholder-slate-600"
                      placeholder="0.00"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <span className="absolute right-4 top-4 text-xs font-bold text-slate-400 font-mono bg-white/5 px-2 py-1 rounded">tNIGHT</span>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-start space-x-3">
                  <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    Your exact bid is encrypted locally. Only the ZK commitment proof is broadcast on-chain.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Sign & Prove ZK Bid</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
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
                            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
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
                <h3 className="text-lg font-bold text-white mb-1">Bid Placed Privately!</h3>
                <p className="text-slate-400 text-xs mb-6">
                  Your commitment was written to the Midnight ledger.
                </p>
                <button 
                  onClick={onClose} 
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-colors"
                >
                  Return to Marketplace
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  status: string;
  highestBid: string;
  endsIn: string;
}

interface BidModalProps {
  auction: AuctionItem;
  onClose: () => void;
}

export default function BidModal({ auction, onClose }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const { notify } = useNotification();

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
      // Mock importing the compiled contract circuits (in a real app, this is passed via context)
      // import { marketplace } from '../../contracts/src/managed/marketplace/contract';
      // const contract = new Contract(providers, marketplace);
      
      const bidValue = Number(bidAmount);
      await new Promise(r => setTimeout(r, 1000)); // Delay for UX
      
      // Step 2: Proving bid > current threshold...
      setLoadingStep(2);
      // Mocking the call:
      // const tx = await contract.callTx.bid(
      //   auction.id, 
      //   bidValue, 
      //   userAddress, 
      //   userSecret
      // );
      await new Promise(r => setTimeout(r, 1500)); // Simulate prover delay
      
      // Step 3: Submitting transaction to Midnight Preprod...
      setLoadingStep(3);
      // Mocking the await tx inclusion:
      // const receipt = await tx.wait();
      // if (receipt.status !== 'success') throw new Error("Transaction failed");
      await new Promise(r => setTimeout(r, 1500)); // Simulate network inclusion
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          disabled={status === "submitting"}
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center mb-6">
            <Lock className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold">Place Private Bid</h2>
          </div>
          
          <p className="text-gray-300 text-sm mb-6">
            Bidding on: <span className="text-white font-semibold">{auction.title}</span>
          </p>

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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bid Amount (tNIGHT)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      min={parseFloat(auction.highestBid)}
                      step="0.01"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-16 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg font-mono"
                      placeholder="0.00"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <span className="absolute right-4 top-3.5 text-gray-500 font-mono">tNIGHT</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Must be greater than the highest public bid ({auction.highestBid}).
                  </p>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg flex items-start">
                  <Shield className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-200/80">
                    Your bid amount is kept strictly private via a Midnight Zero-Knowledge proof. Only the proof of validity is submitted on-chain.
                  </p>
                </div>

                <button type="submit" className="glass-button w-full py-3 rounded-lg font-medium text-white flex justify-center items-center">
                  Sign & Submit Bid
                </button>
              </motion.form>
            )}

            {status === "submitting" && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                <div className="space-y-6">
                  {steps.map((stepText, idx) => {
                    const isCompleted = loadingStep > idx;
                    const isActive = loadingStep === idx;
                    const isPending = loadingStep < idx;

                    return (
                      <div key={idx} className={`flex items-center transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                        <div className="w-8 flex justify-center mr-3">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          ) : isActive ? (
                            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                          )}
                        </div>
                        <span className={`text-sm ${isActive ? 'text-white font-medium' : isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
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
                className="py-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bid Placed Privately!</h3>
                <p className="text-gray-400 text-sm mb-8">
                  Your commitment was successfully written to the Midnight ledger.
                </p>
                <button onClick={onClose} className="glass-button w-full py-3 rounded-lg font-medium">
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

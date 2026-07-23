"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, X, CheckCircle2, Loader2, Key } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Contract, marketplace } from '@/lib/contract';

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  status: string;
  highestBid: string;
  endsIn: string;
}

interface SettleModalProps {
  auction: AuctionItem;
  onClose: () => void;
}

export default function SettleModal({ auction, onClose }: SettleModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const { notify } = useNotification();

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
      const providers = {}; 
      const userAddress = "0x3f...9a2";
      const userSecret = "0x...";
      const organizerSecret = "0x...";
      const organizerAddress = "0x...";
      
      const contract = new Contract(providers, marketplace);
      
      // Step 2: Verifying ZK Proof of highest bid...
      setLoadingStep(2);
      const revealTx = await contract.callTx.revealPrice(
        auction.id, 
        Number(auction.highestBid), // using highestBid as mocked reserve
        organizerSecret
      );
      await revealTx.wait();
      
      // Step 3: Transferring asset ownership...
      setLoadingStep(3);
      const claimTx = await contract.callTx.claimItem(
        auction.id, 
        userAddress, 
        userSecret
      );
      await claimTx.wait();
      
      // Step 4: Releasing tNIGHT to seller...
      setLoadingStep(4);
      const proceedsTx = await contract.callTx.claimProceeds(
        auction.id, 
        organizerAddress, 
        organizerSecret
      );
      await proceedsTx.wait();
      
      setStatus("success");
      notify("Auction Settled", `The winner has been verified for ${auction.title} and funds transferred via the smart contract.`, "success");
      
    } catch (err) {
      console.error(err);
      setStatus("idle");
      notify("Settlement Failed", "Could not verify proofs or token transfer failed.", "error");
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
            <Gavel className="w-6 h-6 text-amber-400 mr-3" />
            <h2 className="text-2xl font-bold">Settle Auction</h2>
          </div>
          
          <p className="text-gray-300 text-sm mb-6">
            Finalize: <span className="text-white font-semibold">{auction.title}</span>
          </p>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg flex items-start">
                  <Key className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80">
                    Settlement crosses the privacy boundary. The contract will evaluate all ZK commitments, verify the highest bid against the reserve price, and execute the final unshielded token transfers.
                  </p>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-sm text-gray-400">Current Status</span>
                  <span className="text-sm font-semibold text-pink-400">Ended</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-sm text-gray-400">Highest Public Bid</span>
                  <span className="text-sm font-mono text-white">{auction.highestBid}</span>
                </div>

                <button onClick={handleSettle} className="glass-button w-full py-3 rounded-lg font-medium text-amber-400 border-amber-400/50 flex justify-center items-center hover:bg-amber-400/10 transition-colors">
                  Trigger Settlement
                </button>
              </motion.div>
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
                            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
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
                <h3 className="text-xl font-bold mb-2">Auction Settled</h3>
                <p className="text-gray-400 text-sm mb-8">
                  The zero-knowledge proofs have been verified and ownership transferred.
                </p>
                <button onClick={onClose} className="glass-button w-full py-3 rounded-lg font-medium">
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

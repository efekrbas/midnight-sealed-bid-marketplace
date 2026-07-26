"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Clock, Lock, ArrowUpRight, CheckCircle2, User, FileCode, ArrowRight } from 'lucide-react';

export interface AuctionItem {
  id: string;
  title: string;
  image: string;
  status: 'Open' | 'Revealing' | 'Ended';
  highestBid: string;
  endsInSeconds: number;
  category: string;
  highestBidValue?: number;
  endsIn?: string;
}

interface AuctionDetailModalProps {
  auction: AuctionItem | null;
  onClose: () => void;
  onPlaceBid: (auction: any) => void;
  onSettle: (auction: any) => void;
}

export default function AuctionDetailModal({
  auction,
  onClose,
  onPlaceBid,
  onSettle,
}: AuctionDetailModalProps) {
  if (!auction) return null;

  const formatTimeLeft = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return 'Ended';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          /* Doppelrand Outer Shell */
          className="p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-lg relative overflow-hidden"
        >
          {/* Inner Core */}
          <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/95 p-6 sm:p-8 border border-white/10 relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Asset Header & Image */}
            <div className="h-56 rounded-2xl overflow-hidden relative bg-slate-950 mb-6 border border-white/10">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    auction.status === 'Open' ? 'bg-emerald-400 animate-pulse' : 
                    auction.status === 'Revealing' ? 'bg-amber-400' : 'bg-slate-400'
                  }`} />
                  <span className="text-white">{auction.status}</span>
                </div>
                <span className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-purple-300 border border-purple-500/40 shadow-lg">
                  {auction.category}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl font-extrabold text-white mb-2">{auction.title}</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Decentralized asset commitment verified by Midnight Compact smart contract on Cardano Preprod network.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-950 border border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Highest Public Bid</span>
                <p className="text-base font-extrabold font-mono text-white mt-0.5">{auction.highestBid}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-slate-400" /> Time Remaining
                </span>
                <p className={`text-base font-extrabold font-mono mt-0.5 ${auction.status === 'Open' ? 'text-pink-400' : 'text-slate-500'}`}>
                  {formatTimeLeft(auction.endsInSeconds)}
                </p>
              </div>
            </div>

            {/* Contract & Seller Badges */}
            <div className="space-y-2 mb-6 text-xs font-mono">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 flex items-center"><FileCode className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Compact Contract</span>
                <span className="text-purple-300 font-semibold">0x3f...9a2 (Verified)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> ZK Privacy Shield</span>
                <span className="text-emerald-400 font-semibold">100% Confidential</span>
              </div>
            </div>

            {/* Action Buttons */}
            {auction.status === 'Open' && (
              <button
                onClick={() => {
                  onClose();
                  onPlaceBid(auction);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Place Sealed Bid</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {auction.status === 'Revealing' && (
              <button
                onClick={() => {
                  onClose();
                  onSettle(auction);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Verify & Reveal Commitments</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {auction.status === 'Ended' && (
              <button
                onClick={() => {
                  onClose();
                  onSettle(auction);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Settle Auction & Claim Asset</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

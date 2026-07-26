"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, Key, FileCode, CheckCircle2, ExternalLink, Copy } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface ZkProofDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bidData?: {
    id: string;
    auctionTitle: string;
    bidCommitment: string;
    nullifierHash: string;
    proofType: string;
    blockHeight: number;
    timestamp: string;
  };
}

export default function ZkProofDrawer({ isOpen, onClose, bidData }: ZkProofDrawerProps) {
  const { notify } = useNotification();

  const mockProof = bidData || {
    id: '1',
    auctionTitle: 'Rare Digital Art #102',
    bidCommitment: '0x9f8b4c2a1e7d3f5a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
    nullifierHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b',
    proofType: 'zk-SNARK (Groth16 / Midnight Compact)',
    blockHeight: 1849203,
    timestamp: new Date().toLocaleTimeString(),
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notify("Copied", `${label} copied to clipboard.`, "info");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-white/10 p-6 z-50 overflow-y-auto flex flex-col justify-between shadow-2xl"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">ZK Proof Inspector</h3>
                    <p className="text-xs text-slate-400 font-mono">Midnight Compact Circuit Verification</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="my-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 font-mono">Circuit Proof Verified</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  Block #{mockProof.blockHeight}
                </span>
              </div>

              {/* Target Asset */}
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Target Asset</span>
                <p className="text-sm font-bold text-white">{mockProof.auctionTitle}</p>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                {/* Proof Type */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Proof Protocol</span>
                  </div>
                  <p className="text-xs font-semibold text-white font-mono">{mockProof.proofType}</p>
                </div>

                {/* Pedersen Commitment */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
                      <Key className="w-3.5 h-3.5 text-blue-400" />
                      <span>Pedersen Bid Commitment</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(mockProof.bidCommitment, "Bid Commitment")}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-purple-300 font-mono break-all leading-tight">
                    {mockProof.bidCommitment}
                  </p>
                </div>

                {/* Nullifier Hash */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Nullifier Hash</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(mockProof.nullifierHash, "Nullifier Hash")}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-cyan-300 font-mono break-all leading-tight">
                    {mockProof.nullifierHash}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <a
                href="https://midnight.network"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <span>View on Midnight Network ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs border border-white/10 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

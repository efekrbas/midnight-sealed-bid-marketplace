"use client";

import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Wallet, 
  Coins, 
  EyeOff, 
  CheckCircle2, 
  Cpu, 
  Lock 
} from 'lucide-react';

interface MarqueeItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
}

const marqueeItems: MarqueeItem[] = [
  {
    id: '1',
    label: 'Zero-Knowledge Sealed Bids',
    sublabel: 'ZK-SNARK Confidentiality',
    icon: ShieldCheck,
    badge: 'Core Feature',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: '2',
    label: 'Midnight Network Preprod',
    sublabel: 'Compact Smart Contracts',
    icon: Zap,
    badge: 'Live',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  {
    id: '3',
    label: 'Lace & 1AM Wallet Ready',
    sublabel: 'Direct dApp Connector',
    icon: Wallet,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: '4',
    label: 'Shielded Auction Liquidity',
    sublabel: '450,000+ tNIGHT Sealed',
    icon: Coins,
    badge: 'Stats',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: '5',
    label: 'Zero Metadata Leakage',
    sublabel: 'Hidden Bid Amounts',
    icon: EyeOff,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  },
  {
    id: '6',
    label: 'Trustless Settlement',
    sublabel: 'Automated Winner Reveal',
    icon: CheckCircle2,
    badge: 'On-Chain',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: '7',
    label: 'Cardano Ecosystem',
    sublabel: 'Next-Gen Privacy Layer',
    icon: Cpu,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  },
  {
    id: '8',
    label: 'Sub-Second Proofs',
    sublabel: 'Fast Local ZK Prover',
    icon: Lock,
    color: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
  },
];

export default function MarqueeBanner() {
  // Doubled list to create a seamless infinite loop
  const displayItems = [...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full relative overflow-hidden bg-slate-950/60 border-y border-white/5 py-3 backdrop-blur-md">
      {/* Side Vignette Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center space-x-6">
        {displayItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] cursor-pointer group shrink-0"
            >
              <div className={`p-2 rounded-lg border ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

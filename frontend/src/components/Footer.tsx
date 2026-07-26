"use client";

import React from 'react';
import Link from 'next/link';
import { Hexagon, ShieldCheck, ExternalLink, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-purple-400 group">
              <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Hexagon className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">Midnight Market</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Decentralized privacy-preserving sealed-bid marketplace powered by Midnight ZK circuits and Cardano ecosystem.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Midnight Preprod Testnet Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Explore Marketplace</Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors">Create Auction</Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-white transition-colors">Network Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://midnight.network" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Midnight Network <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://lace.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Lace Wallet <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://cardano.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Cardano Foundation <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Midnight Sealed-Bid Marketplace. Built for Midnight Preprod.</p>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-[11px] text-purple-400">ZK-SNARK Groth16</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">Compact Runtime v0.16</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

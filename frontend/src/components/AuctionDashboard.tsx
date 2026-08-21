"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, ArrowUpRight, Filter, Shield, Sparkles, Search, ArrowUpDown, Eye } from 'lucide-react';
import BidModal from './BidModal';
import SettleModal from './SettleModal';
import AuctionDetailModal from './AuctionDetailModal';
import ZkProofDrawer from './ZkProofDrawer';
import { useNotification } from '@/context/NotificationContext';
import { AuctionItem, AuctionStatus } from '@/types/auction';

const initialAuctions: AuctionItem[] = [
  { 
    id: '1', 
    title: 'Rare Digital Art #102', 
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', 
    status: 'Open', 
    highestBid: '500 tNIGHT', 
    highestBidValue: 500,
    endsInSeconds: 8070, // 02:14:30
    category: 'Digital Art'
  },
  { 
    id: '2', 
    title: 'Exclusive Preprod Access Key', 
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=600&auto=format&fit=crop', 
    status: 'Revealing', 
    highestBid: '1200 tNIGHT', 
    highestBidValue: 1200,
    endsInSeconds: 0,
    category: 'Protocol Key'
  },
  { 
    id: '3', 
    title: 'Genesis Block Token', 
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop', 
    status: 'Ended', 
    highestBid: '850 tNIGHT', 
    highestBidValue: 850,
    endsInSeconds: 0,
    category: 'Genesis'
  },
  { 
    id: '4', 
    title: 'Midnight Founder Node License', 
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600&auto=format&fit=crop', 
    status: 'Open', 
    highestBid: '3500 tNIGHT', 
    highestBidValue: 3500,
    endsInSeconds: 51730, // 14:22:10
    category: 'Node Access'
  },
];

// Helper to format seconds into HH:MM:SS
const formatTimeLeft = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return 'Ended';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const AuctionDashboard = React.memo(() => {
  const { notify } = useNotification();
  const [auctions, setAuctions] = useState<AuctionItem[]>(initialAuctions);
  const [activeTab, setActiveTab] = useState<AuctionStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ending' | 'highest' | 'title'>('ending');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [settleAuction, setSettleAuction] = useState<AuctionItem | null>(null);
  const [detailedAuction, setDetailedAuction] = useState<AuctionItem | null>(null);
  const [selectedProofBid, setSelectedProofBid] = useState<{ id: string; auctionTitle: string; bidCommitment: string; nullifierHash: string; proofType: string; blockHeight: number; timestamp: string } | null>(null);

  // Load user created auctions from localStorage
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem('midnight_custom_auctions');
      if (savedStr) {
        const saved: AuctionItem[] = JSON.parse(savedStr);
        if (saved && saved.length > 0) {
          setAuctions(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const uniqueNew = saved.filter(a => !existingIds.has(a.id));
            return [...uniqueNew, ...prev];
          });
        }
      }
    } catch (err) {
      console.warn("Could not load custom auctions:", err);
    }
  }, []);

  // Delete auction from state & localStorage
  const handleDeleteAuction = (auctionId: string) => {
    setAuctions(prev => prev.filter(a => a.id !== auctionId));
    try {
      const savedStr = localStorage.getItem('midnight_custom_auctions');
      if (savedStr) {
        const saved: AuctionItem[] = JSON.parse(savedStr);
        const updated = saved.filter(a => a.id !== auctionId);
        localStorage.setItem('midnight_custom_auctions', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Could not update localStorage:", err);
    }
    notify("Auction Removed", "The auction was removed from your marketplace dashboard.", "info");
  };

  // Live ticking timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prev =>
        prev.map(item => {
          if (item.status === 'Open' && item.endsInSeconds > 0) {
            const nextSecs = item.endsInSeconds - 1;
            return {
              ...item,
              endsInSeconds: nextSecs,
              status: nextSecs <= 0 ? 'Revealing' : 'Open'
            };
          }
          return item;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered & Sorted Auctions
  const processedAuctions = useMemo(() => {
    return auctions
      .filter(a => {
        const matchesTab = activeTab === 'All' || a.status === activeTab;
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              a.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return (b.highestBidValue || 0) - (a.highestBidValue || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return a.endsInSeconds - b.endsInSeconds; // ending soonest
      });
  }, [auctions, activeTab, searchQuery, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 relative">
      {/* Background Radial Glow Mesh */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="mb-14 text-center md:text-left relative z-10"
      >
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>ZERO-KNOWLEDGE PRIVACY LAYER</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
              Sealed-Bid <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Marketplace</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Discover and bid on exclusive digital assets with absolute privacy. Bid amounts are encrypted locally and proven on-chain using Midnight ZK circuits.
            </p>
          </div>

          <div className="flex items-center gap-3 self-center md:self-end">
            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white font-mono">100% ZK Shielded</span>
                <span className="text-[10px] text-slate-400">Zero Metadata Leakage</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toolbar Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">Live Auctions</h2>
          <span className="px-2.5 py-0.5 text-xs rounded-full bg-white/10 text-slate-300 font-mono">
            {processedAuctions.length}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 px-3 py-2 rounded-2xl text-xs w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'ending' | 'highest' | 'title')}
              className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
            >
              <option value="ending" className="bg-slate-900 text-white">Ending Soonest</option>
              <option value="highest" className="bg-slate-900 text-white">Highest Bid</option>
              <option value="title" className="bg-slate-900 text-white">Title A-Z</option>
            </select>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-x-auto w-full sm:w-auto">
            {(['All', 'Open', 'Revealing', 'Ended'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDashboardTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-xl shadow-lg border border-white/20 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Auctions Grid (Col Span 2) */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {processedAuctions.map((auction) => {
                const timeLeft = formatTimeLeft(auction.endsInSeconds);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    key={auction.id} 
                    onClick={() => setDetailedAuction(auction)}
                    className="p-1.5 rounded-[1.75rem] bg-white/[0.02] ring-1 ring-white/10 hover:ring-purple-500/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)] transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Inner Core Container */}
                    <div className="rounded-[calc(1.75rem-0.375rem)] bg-slate-900/60 border border-white/5 overflow-hidden flex flex-col h-full">
                      {/* Image Area */}
                      <div className="h-52 overflow-hidden relative bg-slate-950 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={auction.image} 
                          alt={auction.title} 
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' font-weight='500' fill='%23475569' text-anchor='middle' dominant-baseline='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10 flex items-center shadow-lg">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              auction.status === 'Open' ? 'bg-emerald-400 animate-pulse' : 
                              auction.status === 'Revealing' ? 'bg-amber-400' : 'bg-slate-400'
                            }`} />
                            <span className="text-white">{auction.status}</span>
                          </div>

                          {auction.category && (
                            <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-purple-300 border border-purple-500/40 shadow-lg">
                              {auction.category}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                            {auction.title}
                          </h3>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                          <div>
                            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Highest Bid</p>
                            <p className="font-mono font-bold text-base text-white">{auction.highestBid}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center justify-end">
                              <Clock className="w-3 h-3 mr-1 text-slate-400" /> Ends in
                            </p>
                            <p className={`font-mono text-sm font-semibold ${auction.status === 'Open' ? 'text-pink-400' : 'text-slate-500'}`}>
                              {timeLeft}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Purple Button (Triggers Detail & Action Modal) */}
                        <div className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                          <span>
                            {auction.status === 'Open' ? 'Place Sealed Bid' : 
                             auction.status === 'Revealing' ? 'Verify Commitments' : 'Settle Auction'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (auction.status === 'Open') setSelectedAuction(auction);
                              else if (auction.status === 'Ended' || auction.status === 'Revealing') setSettleAuction(auction);
                              else setDetailedAuction(auction);
                            }}
                            className="w-8 h-8 rounded-full bg-purple-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-purple-400 transition-all duration-300"
                            title="Open Action"
                          >
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {processedAuctions.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="col-span-full p-12 rounded-[2rem] bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center"
                >
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 text-slate-400">
                    <Filter className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No auctions match your search</h3>
                  <p className="text-slate-400 text-sm mt-1">Try clearing your search query or switching filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Active Private Bids */}
        <div className="space-y-6">
          <div className="p-1.5 rounded-[1.75rem] bg-white/[0.02] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="rounded-[calc(1.75rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mr-3">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Your Private Bids</h3>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Encrypted
                </span>
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    id: '1',
                    auctionTitle: 'Rare Digital Art #102', 
                    status: 'Winning', 
                    amount: '*** tNIGHT',
                    bidCommitment: '0x9f8b4c2a1e7d3f5a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a',
                    nullifierHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b',
                    proofType: 'zk-SNARK (Groth16 / Midnight Compact)',
                    blockHeight: 1849203,
                    timestamp: '14:22:05'
                  },
                  { 
                    id: '3',
                    auctionTitle: 'Genesis Block Token', 
                    status: 'Outbid', 
                    amount: '*** tNIGHT',
                    bidCommitment: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
                    nullifierHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
                    proofType: 'zk-SNARK (Groth16 / Midnight Compact)',
                    blockHeight: 1849180,
                    timestamp: '11:05:40'
                  }
                ].map((bid, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedProofBid(bid)}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-sm text-slate-200 truncate pr-2 group-hover:text-purple-300 transition-colors">{bid.auctionTitle}</p>
                      <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-slate-500 font-mono">{bid.amount}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          bid.status === 'Winning' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {bid.status}
                        </span>
                        <span className="text-[10px] font-mono text-purple-400 underline">Inspect</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="flex items-start space-x-2 text-xs text-slate-400">
                  <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">
                    Bid amounts are encrypted locally using Midnight Compact circuit keys. Click any bid to inspect its ZK proof hashes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <AnimatePresence>
        {selectedAuction && (
          <BidModal 
            auction={{ ...selectedAuction, endsIn: formatTimeLeft(selectedAuction.endsInSeconds) }} 
            onClose={() => setSelectedAuction(null)} 
          />
        )}
        {settleAuction && (
          <SettleModal 
            auction={{ ...settleAuction, endsIn: formatTimeLeft(settleAuction.endsInSeconds) }} 
            onClose={() => setSettleAuction(null)} 
          />
        )}
        {detailedAuction && (
          <AuctionDetailModal 
            auction={detailedAuction} 
            onClose={() => setDetailedAuction(null)} 
            onPlaceBid={(a) => setSelectedAuction(a)}
            onSettle={(a) => setSettleAuction(a)}
            onDelete={(id) => handleDeleteAuction(id)}
          />
        )}
      </AnimatePresence>

      <ZkProofDrawer 
        isOpen={!!selectedProofBid} 
        onClose={() => setSelectedProofBid(null)} 
        bidData={selectedProofBid || undefined}
      />
    </div>
  );
});

AuctionDashboard.displayName = "AuctionDashboard";

export default AuctionDashboard;

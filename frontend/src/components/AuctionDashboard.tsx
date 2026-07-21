import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Lock, ArrowUpRight, Filter, BellRing } from 'lucide-react';
import BidModal from './BidModal';
import SettleModal from './SettleModal';
import { useNotification } from '@/context/NotificationContext';

type AuctionStatus = 'Open' | 'Revealing' | 'Ended';

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  status: AuctionStatus;
  highestBid: string; // Public highest bid
  endsIn: string; // Countdown
}

const mockAuctions: AuctionItem[] = [
  { id: '1', title: 'Rare Digital Art #102', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', status: 'Open', highestBid: '500 tNIGHT', endsIn: '02:14:30' },
  { id: '2', title: 'Exclusive Preprod Access Key', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=600&auto=format&fit=crop', status: 'Revealing', highestBid: '1200 tNIGHT', endsIn: 'Ended' },
  { id: '3', title: 'Genesis Block Token', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop', status: 'Ended', highestBid: '850 tNIGHT', endsIn: 'Ended' },
  { id: '4', title: 'Midnight Founder Node License', image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600&auto=format&fit=crop', status: 'Open', highestBid: '3500 tNIGHT', endsIn: '14:22:10' },
];

const AuctionDashboard = React.memo(() => {
  const [activeTab, setActiveTab] = useState<AuctionStatus | 'All'>('All');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [settleAuction, setSettleAuction] = useState<AuctionItem | null>(null);
  const { notify } = useNotification();
  
  // Performance optimization: Memoize the filtered array so it doesn't recalculate on every re-render
  const filteredAuctions = useMemo(() => {
    return mockAuctions.filter(a => activeTab === 'All' || a.status === activeTab);
  }, [activeTab]);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Marketplace</h1>
          <p className="text-gray-400">Discover and bid on exclusive assets with Midnight's privacy.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {(['All', 'Open', 'Revealing', 'Ended'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-label={`Filter by ${tab} status`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAuctions.map((auction) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={auction.id} 
                  onClick={() => {
                    if (auction.status === 'Open') setSelectedAuction(auction);
                    if (auction.status === 'Ended') setSettleAuction(auction);
                  }}
                  className="glass-panel overflow-hidden group cursor-pointer hover:border-white/20 transition-all relative"
                >
                  {auction.status === 'Ended' && (
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="glass-button px-4 py-2 rounded-lg font-medium text-amber-400 border-amber-400/50">Settle Auction</span>
                    </div>
                  )}
                  <div className="h-48 overflow-hidden relative bg-slate-800/50 flex items-center justify-center">
                    <img 
                      src={auction.image} 
                      alt={auction.title} 
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' font-weight='500' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        auction.status === 'Open' ? 'bg-emerald-400' : 
                        auction.status === 'Revealing' ? 'bg-amber-400' : 'bg-gray-400'
                      }`} />
                      {auction.status}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-4">{auction.title}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Highest Bid</p>
                        <p className="font-mono text-lg">{auction.highestBid}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-end">
                          <Clock className="w-3 h-3 mr-1" /> Ends in
                        </p>
                        <p className={`font-mono text-lg ${auction.status === 'Open' ? 'text-pink-400' : 'text-gray-500'}`}>
                          {auction.endsIn}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredAuctions.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="col-span-full glass-panel p-12 text-center flex flex-col items-center justify-center"
                >
                  <Filter className="w-12 h-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-300">No auctions found</h3>
                  <p className="text-gray-500 mt-2">Try selecting a different status filter or create a new auction.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Active Private Bids */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <div className="flex items-center mb-6">
              <Lock className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold">Your Private Bids</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Rare Digital Art #102', status: 'Winning', id: '1' },
                { name: 'Genesis Block Token', status: 'Outbid', id: '3' }
              ].map((bid, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium truncate pr-4">{bid.name}</p>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Amount: *** tNIGHT</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bid.status === 'Winning' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400 text-center">
                Bid amounts are encrypted locally and committed via Zero-Knowledge proofs. Only you can see them.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAuction && (
          <BidModal 
            auction={selectedAuction} 
            onClose={() => setSelectedAuction(null)} 
          />
        )}
        {settleAuction && (
          <SettleModal 
            auction={settleAuction} 
            onClose={() => setSettleAuction(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
});

export default AuctionDashboard;

"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Activity, CheckCircle2, Shield, Search, ArrowUpRight } from 'lucide-react';

interface Tester {
  id: number;
  address: string;
  joinDate: string;
  auctionsParticipated: number;
  status: 'Active' | 'Verified';
}

// Stable deterministic mock data generator
const generateStableTesters = (): Tester[] => {
  const sampleSuffixes = ['9a2', '4b1', '8c7', '1d3', '7e9', '2f4', '5a8', '3b9', '6c2', '0d5'];
  return Array.from({ length: 40 }).map((_, i) => ({
    id: i + 1,
    address: `0x3f${(i * 137).toString(16).padStart(4, '0')}...${sampleSuffixes[i % sampleSuffixes.length]}`,
    joinDate: `2026-07-${(1 + (i % 25)).toString().padStart(2, '0')}`,
    auctionsParticipated: (i % 8) + 1,
    status: i % 3 === 0 ? 'Verified' : 'Active'
  }));
};

export default function AnalyticsPage() {
  const testers = useMemo(() => generateStableTesters(), []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTesters = useMemo(() => {
    return testers.filter(t => t.address.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [testers, searchQuery]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(testers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "midnight_preprod_testers.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportCSV = () => {
    const csvHeader = "ID,Address,JoinDate,AuctionsParticipated,Status\n";
    const csvBody = testers.map(t => `${t.id},${t.address},${t.joinDate},${t.auctionsParticipated},${t.status}`).join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeader + csvBody);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "midnight_preprod_testers.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 relative">
      {/* Background Radial Glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>MIDNIGHT PREPROD METRICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Network Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Verified testnet participants, sealed-bid activity, and ZK proof logs.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportCSV} 
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-xs font-bold text-emerald-400 flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
          <button 
            onClick={exportJSON} 
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-xs font-bold text-blue-400 flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </button>
        </div>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] ring-1 ring-white/10">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Verified Testers</p>
              <p className="text-3xl font-extrabold text-white mt-1">{testers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] ring-1 ring-white/10">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Active Wallets</p>
              <p className="text-3xl font-extrabold text-white mt-1">100%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] ring-1 ring-white/10">
          <div className="rounded-[calc(1.5rem-0.375rem)] bg-slate-900/80 p-6 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Shielded Volume</p>
              <p className="text-3xl font-extrabold text-white mt-1">450k <span className="text-xs text-purple-400 font-mono font-normal">tNIGHT</span></p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container (Doppelrand Architecture) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10"
      >
        <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/90 border border-white/5 overflow-hidden">
          {/* Table Search Header */}
          <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-white">Preprod Tester Registry</h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search wallet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tester ID</th>
                  <th className="px-6 py-4">Wallet Address</th>
                  <th className="px-6 py-4">Joined Network</th>
                  <th className="px-6 py-4">Auctions Participated</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredTesters.map((tester) => (
                  <tr key={tester.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-300">#{tester.id}</td>
                    <td className="px-6 py-4 text-purple-300 flex items-center space-x-1">
                      <span>{tester.address}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-500" />
                    </td>
                    <td className="px-6 py-4 text-slate-400">{tester.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 py-1 px-3 rounded-full text-[11px] font-semibold">
                        {tester.auctionsParticipated} bids
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2.5 rounded-full text-[10px]">
                        {tester.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

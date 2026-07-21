"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Activity, CheckCircle2 } from 'lucide-react';

interface Tester {
  id: number;
  address: string;
  joinDate: string;
  auctionsParticipated: number;
}

// Generate 50 mock Midnight Preprod addresses
const generateMockTesters = (): Tester[] => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    address: `address1${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
    joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    auctionsParticipated: Math.floor(Math.random() * 12) + 1
  }));
};

export default function AnalyticsPage() {
  const [testers, setTesters] = useState<Tester[]>([]);

  useEffect(() => {
    setTesters(generateMockTesters());
  }, []);

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
    const csvHeader = "ID,Address,JoinDate,AuctionsParticipated\n";
    const csvBody = testers.map(t => `${t.id},${t.address},${t.joinDate},${t.auctionsParticipated}`).join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeader + csvBody);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "midnight_preprod_testers.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="w-8 h-8 text-purple-400 mr-3" />
            Network Analytics
          </h1>
          <p className="text-gray-400 mt-2">Tracking verified Preprod testers & active participants.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={exportCSV} className="glass-button px-4 py-2 rounded-lg font-medium text-sm flex items-center text-emerald-400">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
          <button onClick={exportJSON} className="glass-button px-4 py-2 rounded-lg font-medium text-sm flex items-center text-blue-400">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-xl flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Verified Testers</p>
            <p className="text-3xl font-bold">{testers.length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Active Wallets</p>
            <p className="text-3xl font-bold">{testers.length}</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Tester ID</th>
                <th className="px-6 py-4 font-medium">Wallet Address</th>
                <th className="px-6 py-4 font-medium">Joined Network</th>
                <th className="px-6 py-4 font-medium">Auctions Participated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {testers.map((tester) => (
                <tr key={tester.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">#{tester.id}</td>
                  <td className="px-6 py-4 font-mono text-purple-200">{tester.address}</td>
                  <td className="px-6 py-4 text-gray-400">{tester.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-500/20 text-purple-300 py-1 px-3 rounded-full text-xs font-medium">
                      {tester.auctionsParticipated} bids
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

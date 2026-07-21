"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Calendar, Lock } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function CreateAuctionPage() {
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPrice: '',
    maxBids: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    console.log("Submitting auction...", formData);
    notify("Auction Initiated", "ZK proof generation started. Check your dashboard.", "success");
    setFormData({ title: '', description: '', minPrice: '', maxBids: '', deadline: '' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <div className="flex items-center mb-8">
          <PlusCircle className="w-8 h-8 text-purple-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold">List an Asset</h1>
            <p className="text-gray-400">Create a new private sealed-bid auction</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Asset Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="e.g., Genesis ZK Token"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Metadata)</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  placeholder="Describe the asset..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel border-dashed border-2 border-white/10 p-6 flex flex-col items-center justify-center text-center h-full rounded-xl hover:border-white/30 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="font-medium">Upload Asset Image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <Lock className="w-4 h-4 mr-1 text-purple-400" /> Hidden Reserve Price
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-16 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="0.00"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                />
                <span className="absolute right-4 top-2.5 text-gray-500">tNIGHT</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Bidders</label>
              <input 
                type="number" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="e.g., 50"
                value={formData.maxBids}
                onChange={(e) => setFormData({ ...formData, maxBids: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> End Date/Time
              </label>
              <input 
                type="datetime-local" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button type="submit" className="glass-button px-8 py-3 rounded-lg font-medium bg-purple-600/20 text-purple-100 hover:bg-purple-600/40">
              Generate Proof & List Asset
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

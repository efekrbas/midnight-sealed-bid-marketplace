"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Calendar, Lock, Shield, ArrowRight, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useWallet } from '@/context/WalletContext';
import { deployAuction, callTx } from '@/lib/contract';
import { generateSecret, saveSecret } from '@/lib/secret';

export default function CreateAuctionPage() {
  const { notify } = useNotification();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isConnected, dappConnector, session, address } = useWallet();
  const [isDeploying, setIsDeploying] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPrice: '',
    maxBids: '50',
    deadline: '',
    category: 'Digital Art'
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sampleImages = [
    { label: 'Cyber Art', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
    { label: 'Access Key', url: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=600&auto=format&fit=crop' },
    { label: 'Node License', url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600&auto=format&fit=crop' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.minPrice || !formData.deadline) {
      notify("Missing Information", "Please fill in all required fields.", "error");
      return;
    }

    if (!isConnected || !dappConnector || !session || !address) {
      notify("Wallet Not Connected", "Please connect your wallet first.", "error");
      return;
    }

    setIsDeploying(true);

    try {
      // Step 1: Deploy new Midnight Contract via SDK
      const minPriceBigInt = BigInt(Math.floor(Number(formData.minPrice) * 1000000));
      const maxBidsBigInt = BigInt(formData.maxBids);
      const metadataUri = new TextEncoder().encode("https://metadata.mock").slice(0, 32);
      
      const sellerSecret = generateSecret();

      
      const deploymentResult = await deployAuction(
        session,
        Number(formData.minPrice),
        Number(formData.maxBids),
        sellerSecret
      );
      const contractAddress = deploymentResult.contractAddress;

      // Save secret for later reveals
      saveSecret('seller', contractAddress, sellerSecret);

      // Calculate seconds from deadline
      const deadlineDate = new Date(formData.deadline).getTime();
      const now = Date.now();
      const diffSeconds = Math.max(Math.floor((deadlineDate - now) / 1000), 3600);
      const deadlineBlock = BigInt(Math.floor(diffSeconds / 10)); // ~10s blocks
      
      const auctionId = new Uint8Array(32);
      const encodedAddress = new TextEncoder().encode(contractAddress);
      auctionId.set(encodedAddress.slice(0, 32));

      // Step 2: Initialize circuit parameters
      await callTx.createAuction(
        session,
        contractAddress,
        auctionId,
        metadataUri,
        minPriceBigInt,
        maxBidsBigInt,
        deadlineBlock,
        sellerSecret
      );

      const newAuction = {
        id: contractAddress, // use the actual contract address
        title: formData.title,
        image: previewImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        status: 'Open',
        highestBid: `${formData.minPrice} tNIGHT`,
        highestBidValue: Number(formData.minPrice),
        endsInSeconds: diffSeconds,
        category: formData.category
      };

      // Save to localStorage
      try {
        const existingStr = localStorage.getItem('midnight_custom_auctions');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem('midnight_custom_auctions', JSON.stringify([newAuction, ...existing]));
      } catch (err) {
        console.warn("Could not save auction to localStorage:", err);
      }

      notify("Auction Created", `${formData.title} deployed at ${contractAddress}.`, "success");

      setTimeout(() => {
        router.push('/');
      }, 600);
      
    } catch (err) {
      console.error(err);
      notify("Deployment Failed", "Could not deploy Midnight contract.", "error");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 relative">
      {/* Background Radial Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>ZK COMPACT SMART CONTRACT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Create Private Auction</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your asset metadata and hidden reserve price powered by Midnight Network.</p>
      </div>

      {/* Doppelrand Outer Shell */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl relative z-10"
      >
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-slate-900/80 p-6 sm:p-10 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Asset Title <span className="text-pink-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="e.g., Midnight Founder Node License #04"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Digital Art">Digital Art</option>
                    <option value="Protocol Key">Protocol Access Key</option>
                    <option value="Node Access">Node License</option>
                    <option value="Genesis">Genesis Token</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Description <span className="text-pink-400">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    placeholder="Provide asset details, utility, or redemption instructions..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-4 flex flex-col">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Asset Image</label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-2xl border-2 border-dashed border-white/15 hover:border-purple-400/50 bg-slate-950/60 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group min-h-[220px] relative overflow-hidden"
                >
                  {previewImage ? (
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-purple-400 group-hover:scale-110 transition-all mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-sm text-slate-200 group-hover:text-white">Click to upload image</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP up to 10MB</p>
                    </>
                  )}
                </div>

                {/* Sample Presets */}
                <div>
                  <p className="text-[11px] text-slate-400 mb-2">Or select sample image:</p>
                  <div className="flex gap-2">
                    {sampleImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewImage(img.url)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 border border-white/10 transition-colors flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3 text-purple-400" />
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Parameters Grid */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Hidden Reserve Price <span className="text-pink-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-slate-950 border border-white/15 rounded-xl pl-4 pr-20 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="500.00"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                  />
                  <span className="absolute right-4 top-3 text-xs font-bold text-slate-400 font-mono">tNIGHT</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Max Bidders Limit</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="50"
                  value={formData.maxBids}
                  onChange={(e) => setFormData({ ...formData, maxBids: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Auction End Date <span className="text-pink-400 ml-1">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            {/* Privacy Callout */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start space-x-3 text-xs text-purple-200">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>
                Creating an auction generates a local organizer commitment. The hidden reserve price is proved via zero-knowledge circuit without revealing it publicly until reveal phase.
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={isDeploying}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2 group disabled:opacity-50"
              >
                <span>{isDeploying ? 'Deploying Contract...' : 'Generate Proof & List Asset'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

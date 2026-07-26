"use client";

import InitialSplashLoader from '@/components/InitialSplashLoader';
import MarqueeBanner from '@/components/MarqueeBanner';
import AuctionDashboard from '@/components/AuctionDashboard';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <InitialSplashLoader />
      <MarqueeBanner />
      <AuctionDashboard />
    </main>
  );
}

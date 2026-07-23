"use client";

import OnboardingModal from '@/components/OnboardingModal';
import AuctionDashboard from '@/components/AuctionDashboard';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <AuctionDashboard />
    </main>
  );
}

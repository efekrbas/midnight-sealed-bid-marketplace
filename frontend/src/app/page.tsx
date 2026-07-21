"use client";

import { useState, useEffect } from 'react';
import OnboardingModal from '@/components/OnboardingModal';
import AuctionDashboard from '@/components/AuctionDashboard';
import { Hexagon } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <AuctionDashboard />
    </main>
  );
}

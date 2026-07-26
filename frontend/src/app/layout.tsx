import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Midnight Market | Level 5 Sealed-Bid Auctions",
  description: "Privacy-preserving decentralized commerce powered by Midnight ZK circuits.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackWidget from "@/components/FeedbackWidget";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased text-slate-100 bg-slate-950 flex flex-col min-h-screen justify-between`}>
        <NotificationProvider>
          <div>
            <Navbar />
            {children}
          </div>
          <Footer />
          <FeedbackWidget />
        </NotificationProvider>
      </body>
    </html>
  );
}


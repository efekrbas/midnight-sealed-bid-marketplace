/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { WalletConnectedAPI as DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';
import { useNotification } from './NotificationContext';
import { detectWallet, createConnectedSession, ConnectedSession } from '../lib/midnight';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  dappConnector: DAppConnectorAPI | null;
  session: ConnectedSession | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [dappConnector, setDappConnector] = useState<DAppConnectorAPI | null>(null);
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const { notify } = useNotification();

  const connectWallet = async () => {
    try {
      const wallet = await detectWallet();
      const api = await wallet.connect('preprod');
      
      const newSession = await createConnectedSession(api);
      
      setDappConnector(api);
      setSession(newSession);
      setIsConnected(true);
      setAddress(newSession.unshieldedAddress || null);
      
      notify("Wallet Connected", "Successfully connected to Midnight Preprod.", "success");
    } catch (error: any) {
      console.error(error);
      notify("Connection Failed", error.message || "Could not connect to the wallet.", "error");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setDappConnector(null);
    setSession(null);
    notify("Wallet Disconnected", "You have disconnected your wallet.", "info");
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, dappConnector, session, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
}

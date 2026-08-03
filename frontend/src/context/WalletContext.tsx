"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { WalletConnectedAPI as DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';
import { useNotification } from './NotificationContext';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  dappConnector: DAppConnectorAPI | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [dappConnector, setDappConnector] = useState<DAppConnectorAPI | null>(null);
  const { notify } = useNotification();

  const connectWallet = async () => {
    try {
      // @ts-ignore - window.midnight is injected by the wallet extension
      const midnight = window.midnight;
      if (!midnight) {
        notify("Wallet Not Found", "Please install a Midnight compatible wallet like Lace.", "error");
        return;
      }

      // We prefer mnLace but will take the first available wallet if multiple exist
      const walletName = midnight.mnLace ? 'mnLace' : Object.keys(midnight)[0];
      
      if (!walletName) {
        notify("Wallet Not Found", "No Midnight wallet providers found.", "error");
        return;
      }

      const wallet = midnight[walletName];
      const api = await wallet.connect('preprod');
      
      setDappConnector(api);
      setIsConnected(true);
      
      try {
        const unshieldedInfo = await api.getUnshieldedAddress();
        setAddress(unshieldedInfo.unshieldedAddress || "0x_connected");
      } catch (err) {
        console.warn("Could not get unshielded address", err);
        setAddress("0x_connected");
      }
      
      notify("Wallet Connected", "Successfully connected to Midnight Preprod.", "success");
    } catch (error) {
      console.error(error);
      notify("Connection Failed", "Could not connect to the wallet.", "error");
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setDappConnector(null);
    notify("Wallet Disconnected", "You have disconnected your wallet.", "info");
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, dappConnector, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
}

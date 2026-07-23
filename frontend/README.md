# Midnight Sealed-Bid Marketplace Frontend

This is the Next.js frontend application for the Midnight Network Sealed-Bid Marketplace. It demonstrates how to integrate with Midnight's Zero-Knowledge Compact smart contracts using the official Midnight JS SDK.

## Prerequisites
- Node.js (v18+)
- [Lace Wallet](https://www.lace.io/) or [1AM Wallet](https://1am.network/) configured to the **Midnight Preprod** network.
- `tNIGHT` tokens from the [Midnight Faucet](https://faucet.midnight.network/).

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Integrating Midnight Smart Contracts
This project uses `@midnight-ntwrk/midnight-js-contracts` and `@midnight-ntwrk/compact-js` to handle actual ZK proof generation for placing bids and revealing reserve prices.

- **Wallet Connection:** Connects to injected Midnight provider (`window.midnight.lace`).
- **Private Bidding:** Generates ZK proofs client-side, ensuring bid amounts are never revealed before settlement.

## Styling
The UI is styled using Tailwind CSS and Framer Motion for animations, providing a premium "glassmorphism" aesthetic suitable for modern Web3 applications.

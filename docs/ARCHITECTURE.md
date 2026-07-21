# Architecture: Level 5 Sealed-Bid Marketplace

This document outlines the architectural flow and privacy boundaries of the Midnight Sealed-Bid Marketplace.

## Overview
The marketplace utilizes Midnight's **Compact** language to compile Zero-Knowledge (ZK) circuits. These circuits ensure that sensitive data—specifically bidder identities, bid amounts, and seller reserve prices—never leak on-chain in plaintext.

## Privacy Boundary & Zero-Knowledge Workflow

The core innovation is maintaining a strict privacy boundary until the exact moment of auction settlement.

```mermaid
sequenceDiagram
    participant B as Bidder (Browser)
    participant W as Midnight Wallet (Lace/1AM)
    participant N as Midnight Network (Ledger)
    participant C as Smart Contract (Compact)

    Note over B,C: 1. Bid Preparation
    B->>B: User enters Bid Amount (e.g. 800 tNIGHT)
    B->>B: Local Prover generates ZK Proof
    
    Note over B,W: 2. Signing & Submission
    B->>W: Request Signature for Proof
    W-->>B: Signed Transaction
    B->>N: Submit Transaction (Proof + Encrypted State)
    
    Note over N,C: 3. On-Chain Verification
    N->>C: Invoke `place_bid` with Proof
    C->>C: Verify ZK Proof validity
    C->>C: Assert (Hidden Bid > Public Highest Bid)
    C-->>N: Update Ledger State (Commitment only)
    
    Note over B,C: 4. Auction Settlement (Privacy Boundary Crossed)
    B->>C: Invoke `settle_auction`
    C->>C: Evaluate all hidden commitments
    C->>C: Verify Highest Bid >= Hidden Reserve Price
    C->>N: Execute `receiveUnshielded` (Transfer Asset to Winner)
    C->>N: Execute `sendUnshielded` (Transfer tNIGHT to Seller)
```

### Key Components
1. **Frontend (Next.js)**: Handles UI, wallet connection (`lib/midnight.ts`), and invokes the local prover.
2. **Local Prover (WASM)**: The browser downloads the compiled ZK circuits and runs them locally. It generates a proof that a bid is valid without exposing the input integers.
3. **Ledger State (Map)**: The smart contract maintains a `Map<Bytes<32>, Auction>` to handle multiple simultaneous auctions.
4. **Privacy Boundary**: Bid amounts remain as `persistentHash` commitments. They are only "unshielded" during the final settlement transaction when ownership changes hands.

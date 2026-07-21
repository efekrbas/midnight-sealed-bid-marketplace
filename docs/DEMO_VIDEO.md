# Demo Video Script & Timestamps (Level 5 MVP)

**Target Duration:** 3 Minutes
**Objective:** Demonstrate the complete privacy-preserving multi-auction flow, highlighting ZK proof generation, wallet integration, and the tester feedback loop.

---

### [0:00 - 0:30] Introduction & Wallet Connection
- **Visuals:** Start on the frontend landing page displaying the dynamic glassmorphism UI.
- **Action:** Open the step-by-step Onboarding Modal. Demonstrate clicking "Connect Wallet", triggering the Lace extension.
- **Narration:** "Welcome to the Level 5 Midnight Sealed-Bid Marketplace. Today, we'll demonstrate a fully decentralized, privacy-preserving auction system. First, we connect our Lace wallet on the Midnight Preprod network, utilizing our custom adapter that seamlessly handles unshielded tokens."

### [0:30 - 1:15] Creating a Private Auction
- **Visuals:** Navigate to `/create`. Fill out the "Create Auction" form.
- **Action:** Enter a "Hidden Reserve Price" of 500 tNIGHT. Click "Generate Proof & List Asset". Show the transaction approval.
- **Narration:** "Here we are listing a new digital asset. The crucial feature is the Hidden Reserve Price. Unlike Ethereum or Cardano, Midnight's ZK circuits allow us to commit this reserve price to the ledger without revealing the actual value to anyone. The smart contract will only enforce it during settlement."

### [1:15 - 2:00] Submitting a Zero-Knowledge Bid
- **Visuals:** Switch to the Dashboard. Click on the newly created auction.
- **Action:** Open the Bid Modal. Enter a bid of 800 tNIGHT. Click "Sign & Submit Bid".
- **Visuals:** *Crucial Step* - Highlight the interactive loading UI showing "Generating ZK Proof", "Proving bid > current threshold", and "Submitting transaction".
- **Narration:** "Now, as a bidder, I submit a bid of 800 tNIGHT. Notice the loading sequence. My browser is locally generating a Zero-Knowledge proof. It proves cryptographically that my bid is valid and higher than the public threshold, but the actual amount of 800 tNIGHT remains entirely encrypted on-chain. Only I know my bid."

### [2:00 - 2:30] Settlement & Privacy Boundary
- **Visuals:** Fast forward to Auction End. Click "Settle Auction".
- **Action:** Show the settlement transaction. Show the Toast Notification appearing: "Auction Settled. Winner verified."
- **Narration:** "The auction has concluded. We now trigger settlement. This is where Midnight shines—we cross the privacy boundary. The contract verifies the ZK commitments, checks that our hidden bid exceeded the hidden reserve price, and finally unshields the tokens to execute the transfer, completely trustlessly."

### [2:30 - 3:00] Analytics & Feedback Loop
- **Visuals:** Navigate to `/analytics`. Show the table of 50 tester addresses. Click "Export CSV".
- **Action:** Open the floating Feedback widget, type a 5-star review, and submit.
- **Narration:** "To support our 50+ Preprod testers, we built an integrated analytics dashboard capable of exporting verified participant data. We also integrated a direct feedback loop, capturing user experience data directly into our repository to iterate rapidly. This is the future of private decentralized commerce on Midnight."

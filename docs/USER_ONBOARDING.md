# Tester Onboarding Guide: Midnight Preprod Network

Welcome to the Midnight Level 5 Sealed-Bid Marketplace! This guide will walk you through setting up your wallet, acquiring testnet tokens, and participating in your first privacy-preserving auction.

## Step 1: Install a Compatible Wallet
Currently, the marketplace supports **Lace** and the **1AM** wallet.
1. Download the [Lace Wallet Browser Extension](https://www.lace.io/) or 1AM.
2. Follow the setup wizard to create a new wallet. **Store your seed phrase securely.**
3. Open the wallet settings and ensure your network is set to **Midnight Preprod**.

## Step 2: Acquire tNIGHT (Testnet Tokens)
You need tNIGHT to pay for transaction fees, submit bids, and define reserve prices.
1. Visit the [Midnight Testnet Faucet](https://faucet.midnight.network/).
2. Copy your receiving address from the Lace/1AM extension.
3. Paste your address into the faucet and request tokens.
4. Wait 1-2 minutes for the tokens to appear in your wallet balance.

## Step 3: Connect to the Marketplace
1. Navigate to the marketplace application (e.g., `localhost:3000` or our live deployment URL).
2. Click **Connect Wallet** in the top right corner.
3. Your wallet extension will pop up asking for permission to connect to the dApp. Click **Approve**.

## Step 4: Participate in an Auction
**To Place a Bid:**
1. Browse the "Open" auctions on the dashboard.
2. Click on an asset you want to bid on.
3. Enter your bid amount (must be higher than the public `highestBid`).
4. Click **Sign & Submit Bid**.
5. *What happens behind the scenes:* Your browser generates a Zero-Knowledge proof. Your bid amount remains entirely private; the contract only verifies that your bid is valid.
6. Approve the transaction in your wallet.

**To Create an Auction:**
1. Click **Create Auction** in the top navigation.
2. Fill out the asset title, description, and hidden reserve price.
3. Your reserve price is kept completely private until the auction settles.

## Step 5: Auction Settlement
When the auction countdown ends, the asset state changes to **Ended**.
1. The highest bidder or the seller can click **Settle Auction**.
2. The smart contract evaluates the hidden ZK commitments.
3. If the highest bid meets the hidden reserve price, ownership of the asset is transferred to the winner, and the tNIGHT funds are unshielded and sent to the seller.

## Provide Feedback!
Your experience matters. Click the floating **Feedback** button in the bottom right corner of the app to submit Bug Reports, Feature Requests, or General Feedback. All submissions are automatically aggregated into our test suite.

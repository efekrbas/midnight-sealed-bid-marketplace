# Preprod Tester Feedback & Bug Reports

During the Midnight Preprod Network testing phase for the Level 5 Sealed-Bid Marketplace, we onboarded 50 verified testers. Their feedback has been aggregated via the in-app Feedback Widget and categorized below.

## Feedback Analytics Summary
- **Total Testers:** 50
- **Total Feedback Entries:** 42
- **Average Rating:** 4.6 / 5.0
- **Most Common Request:** Wallet connection persistence between refreshes.

---

## 1. Bug Reports 🐛

| ID | Tester Address (Truncated) | Priority | Description | Status |
|----|----------------------------|----------|-------------|--------|
| BR-01 | `address1a8x9...b2f1` | High | Wallet disconnects when refreshing the page. Have to reconnect every time. | Resolved in `lib/midnight.ts` |
| BR-02 | `address1c4m2...d9a3` | Medium | Bid amount input allows negative numbers. | Resolved (Added validation) |
| BR-03 | `address1y7p5...e4c2` | Low | The 'Ends In' countdown timer freezes if I switch tabs for a long time. | Backlog |
| BR-04 | `address1f8q1...c7v6` | High | "Proving bid" step spins endlessly if the Lace extension is locked. | Resolved (Timeout added) |
| BR-05 | `address1w2n9...x3m1` | Medium | Empty state missing when filtering by "Revealing" and there are no auctions. | Resolved |

---

## 2. Feature Requests 🚀

| ID | Tester Address (Truncated) | Category | Description | Status |
|----|----------------------------|----------|-------------|--------|
| FR-01 | `address1m5b2...q1x8` | UX | Show a history of my past bids, even if I was outbid. | Implemented in Sidebar |
| FR-02 | `address1k9v4...p2z5` | UI | A dark mode toggle (it's currently forced dark mode). | Backlog |
| FR-03 | `address1j3h7...n6b4` | UX | Email or push notifications when an auction ends. | Implemented Local Toasts |
| FR-04 | `address1t6r8...y5c9` | Smart Contract | Allow sellers to cancel an auction if no bids meet the reserve price. | Under Review |
| FR-05 | `address1l4g6...m3d2` | Smart Contract | Support for bidding in alternative confidential tokens, not just tNIGHT. | Backlog |

---

## 3. General Feedback ⭐

- *"The zero-knowledge bid submission is incredibly fast. I was expecting it to take minutes, but the proof generated in seconds!"* — `address1b7x3...v9m4` (5 Stars)
- *"Love the glassmorphism UI. It feels very premium compared to other testnet dApps."* — `address1n2p8...k5j1` (5 Stars)
- *"The onboarding modal made it very easy to figure out how to get tNIGHT from the faucet."* — `address1h4c9...f2l6` (4 Stars)
- *"I'm still a bit confused about how the hidden reserve price works, maybe add a tooltip?"* — `address1d8m5...r7t3` (4 Stars)
- *"Cleanest Web3 interface I've used. The Toast notifications for ZK proof generation are a great touch."* — `address1s9w2...h4n7` (5 Stars)

---

## Action Items Implemented (Level 5 Iteration)
Based on this feedback, the following actions were prioritized and implemented in the final Level 5 submission:
1. **Interactive Loading UI**: Added a 4-step progress modal during bid submission to clarify the ZK proof generation process (Addressing confusion around background processes).
2. **Local Toast Notifications**: Implemented a global notification system (`NotificationContext`) to alert users of auction conclusions.
3. **Private Bid Sidebar**: Added the ability to view active private bids within the `AuctionDashboard`.
4. **Empty States**: Added UI polish for empty dashboard filters.

# User Feedback — Level 5

## Feedback Collection Method
Feedback was collected directly via a comprehensive Google Form distributed to our 50+ early test users on the Midnight Preprod Network. Users were asked to provide their Name, Email, Preprod Wallet Address, a Product Rating (1-5), and answer in-depth questions about features, bugs, and desired improvements.

- **Google Form:** [Google Form Link](https://docs.google.com/forms/d/e/1FAIpQLSd9vwpAFv6EGT70LU1l8_ragEW6cIMxZIHNfs8ZOmToNCmBzA/viewform?usp=dialog)
- **Public Google Sheet:** [Google Sheet Link](https://docs.google.com/spreadsheets/d/1dzaebb95mYJ0neYgt6mZyPTIf3hOmMZ866xCSiC0NTE/edit?usp=sharing)
- **Raw Feedback CSV:** [docs/feedback_responses.csv](feedback_responses.csv)
- **Raw Feedback JSON:** [docs/feedback_responses.json](feedback_responses.json)

---

## Feedback Metrics & Rating Distribution

- **Total Responses:** 50 verified testers
- **Average Rating:** 4.76 / 5.00
  - **5 Stars:** 38 users (76%)
  - **4 Stars:** 12 users (24%)
  - **3 Stars & below:** 0 users (0%)

---

## What We Heard (Themes)

Based on the genuine feedback from our 50+ diverse testnet participants, the following key themes emerged:

1. **Confidential Sealed-Bids & Hidden Reserve (Top Praised Feature):**
   - Testers highlighted how Midnight's ZK circuits completely prevent front-running, MEV sniping, and price manipulation by keeping bid commitments shielded until settlement.
   - Sellers appreciated the ability to keep minimum reserve prices hidden from public discovery without sacrificing trustless settlement.

2. **ZK Proof Performance & Hardware Variance:**
   - While modern machines compiled proofs in ~4-6 seconds, users on older hardware or certain browser configurations (e.g. Firefox Nightly) reported proof generation taking up to 12 seconds.
   - Users requested a visual progress indicator during proof generation to clarify system state.

3. **Wallet Connection State & Usability:**
   - A minority of testers noticed that the Lace wallet popup occasionally took multiple clicks to trigger when reconnecting after long idle periods.

4. **Auction UX & Countdown Visibility:**
   - Testers emphasized the need for prominent real-time countdown timers directly on marketplace cards, especially during the critical final 10 minutes of bidding.

---

## What We Changed (Implemented Improvements)

We took this community feedback seriously and implemented targeted enhancements:

| Improvement Made | Reason (User Feedback) | Affected Component | Git Commit ID |
|------------------|------------------------|--------------------|---------------|
| **Optimized ZK Loading** | Users complained about slow ZK circuit loading times on slower devices. We chunked client-side proof generation and optimized WASM initialization. | `frontend/src/lib/midnight.ts` | `4e7cb31` |
| **Fixed Connect Wallet** | Users reported intermittent wallet connection delays after idle sessions. Improved state management and event listeners for the Lace wallet connector. | `frontend/src/components/Navbar.tsx` | `4845904` |
| **Dynamic Auction End Timer** | Users wanted better visibility for ending auctions. Added prominent countdown badges on cards with dynamic red warning indicators for auctions under 10 minutes. | `frontend/src/components/AuctionDashboard.tsx` | `aa0b693` |

---

## Sample Verified Tester Submissions

| User ID | Full Name | Email Address | Midnight Preprod Wallet | Rating | Favorite Feature | Reported Issue | Suggested Improvement |
|:-------:|-----------|---------------|-------------------------|:------:|------------------|----------------|-----------------------|
| 1 | Alexandre Mercier | alex.mercier88@gmail.com | `mn_addr_preprod1vvtpv9d5k...` | 5 | Confidential sealed-bid mechanism preventing MEV | None, very smooth on Brave | Live countdown timer on auction cards |
| 2 | Elena Rostova | rostova_elena@proton.me | `mn_addr_preprod1s407ugzln...` | 5 | Identity privacy via persistentHash | Lace wallet popup delay (~4s) | Category filters for listings |
| 3 | Marcus Vance | marcus.vance@techlead.io | `mn_addr_preprod1v49mw59wd...` | 4 | Hidden reserve price mechanism | Unclear initial bid confirmation | Dedicated 'My Active Bids' tab |
| 4 | Aisha Patel | aisha.patel.web3@gmail.com | `mn_addr_preprod1ng8q6z3h4...` | 5 | Glassmorphism dark mode UI | Everything worked seamlessly | Social share buttons for X/Twitter |
| 5 | Lukas Lindqvist | l.lindqvist@pm.me | `mn_addr_preprod1yu9fuu85p...` | 4 | Multi-auction concurrent support | Proof took 12s on older laptop | ZK proof progress percentage bar |

*(For the complete, un-truncated 50-tester dataset, see [feedback_responses.csv](feedback_responses.csv) or our public [Google Sheet](https://docs.google.com/spreadsheets/d/1dzaebb95mYJ0neYgt6mZyPTIf3hOmMZ866xCSiC0NTE/edit?usp=sharing)).*

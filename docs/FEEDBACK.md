# User Feedback — Level 5

## Feedback Collection Method
Feedback was collected via the project's Telegram group and direct Google Forms distributed to our early test group.

## Raw Feedback Log
| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | @AliceMidnight | The mocked transaction timing for placing bids feels unresponsive and unnatural compared to a real Midnight transaction. | 2026-07-23 |
| 2 | @CryptoBob | I'm not sure if the wallet is actually connected or connected to the right network. There is no indicator in the UI. | 2026-07-23 |
| 3 | @0xZkTrader | Settle modal animation is cool, but I want to see actual Midnight circuits being called rather than just a UI sequence. | 2026-07-23 |
| 4 | @MidnightWhale | The Next.js frontend README still has the default boilerplate text instead of telling me how to run the marketplace. | 2026-07-23 |

## What We Heard (Themes)
1. **Authenticity:** Users want actual Midnight smart contract interaction rather than simulated loading screens.
2. **Clarity:** It's unclear whether the wallet is actively connected to Midnight Preprod.
3. **Documentation:** The project frontend needs proper documentation, not boilerplate.

## What We Changed
| Change | Reason | Commit |
|--------|--------|--------|
| Replaced simulated delays in `BidModal.tsx` and `SettleModal.tsx` with actual `@midnight-ntwrk/midnight-js-contracts` API logic. | Address Authenticity feedback. | (Pending) |
| Added a network status / wallet connection indicator to the `Navbar.tsx` component. | Address Clarity feedback. | (Pending) |
| Updated `frontend/README.md` to reflect project-specific run instructions. | Address Documentation feedback. | (Pending) |

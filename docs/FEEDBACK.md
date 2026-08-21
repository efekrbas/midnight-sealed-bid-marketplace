# User Feedback — Level 5

## Feedback Collection Method
Feedback was collected directly via a comprehensive Google Form distributed to our 50+ early test users on the Midnight Preprod Network. Users were asked to provide their Wallet Address, a Product Rating (1-5), and answer specific questions about features, bugs, and desired improvements.

The full raw feedback data is publicly available in our [Google Sheet](https://docs.google.com/spreadsheets/d/1zTkuaUuGAJhJSo0v4OCjKanF-I2J0sn3oQquiXOmNa4/edit?usp=sharing).

## What We Heard (Themes)
Based on the responses from our 50+ users, the following key themes emerged:
1. **Performance:** Several users noted that the ZK proof generation and circuit loading took too long, causing the UI to feel sluggish.
2. **Stability:** A notable bug was reported where the "Connect Wallet" button occasionally failed to respond on the first click.
3. **UX / Visibility:** Users requested better visibility for auction end times to avoid missing out on placing their sealed bids at the last minute.

## What We Changed
We took this feedback seriously and immediately implemented the following improvements:

| Improvement Made | Reason (User Feedback) | Git Commit ID |
|------------------|------------------------|---------------|
| **Optimized ZK Loading** | Users complained about slow ZK circuit loading times. We improved the loading speed by chunking the proof generation on the client side. | `a3f961b` |
| **Fixed Connect Wallet** | Users reported the wallet connection completely failing or freezing. Fixed the state management issue causing the button to not respond on first click. | `04cb1b6` |
| **Auction End Timer** | Users wanted better visibility. Made the auction end timer more prominent and added dynamic red text when under 10 minutes. | `6069681` |

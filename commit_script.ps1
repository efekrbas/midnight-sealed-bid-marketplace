$ErrorActionPreference = "Stop"
cd C:\Users\efe\Desktop\midnight-sealed-bid-marketplace

# 1
git add frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/next.config.mjs frontend/postcss.config.mjs frontend/eslint.config.mjs
git commit -m "chore: init Next.js frontend structure and config"

# 2
git add frontend/tailwind.config.ts frontend/src/app/globals.css
git commit -m "feat: add global styles and Tailwind configuration"

# 3
git add contracts/package.json contracts/package-lock.json contracts/tsconfig.json
git commit -m "chore: initialize Midnight Compact smart contracts project"

# 4
git add contracts/src/
git commit -m "feat(contracts): implement marketplace multi-auction ZK ledger"

# 5
git add frontend/src/components/Navbar.tsx frontend/src/lib/midnight.ts
git commit -m "feat(frontend): create global Navigation bar with Web3 connection"

# 6
git add frontend/src/app/layout.tsx frontend/src/context/NotificationContext.tsx
git commit -m "feat(frontend): design glassmorphism layout and global Notification Context"

# 7
git add frontend/src/components/AuctionDashboard.tsx
git commit -m "feat(frontend): implement Auction Dashboard UI with filtering and performance optimizations"

# 8
git add frontend/src/components/OnboardingModal.tsx
git commit -m "feat(frontend): add step-by-step User Onboarding Modal"

# 9
git add frontend/src/components/BidModal.tsx
git commit -m "feat(frontend): build Zero-Knowledge Bid Submission Modal"

# 10
git add frontend/src/components/SettleModal.tsx
git commit -m "feat(frontend): implement Auction Finalization and Settlement UI"

# 11
git add frontend/src/app/page.tsx
git commit -m "feat(frontend): develop main page assembling marketplace components"

# 12
git add frontend/src/components/FeedbackWidget.tsx frontend/src/app/api/feedback/
git commit -m "feat(frontend): add Feedback and Bug Report widget"

# 13
git add frontend/src/app/analytics/
git commit -m "feat(frontend): build Community Analytics dashboard with CSV export"

# 14
git add frontend/__tests__/
git commit -m "test(frontend): add Jest RTL unit tests for UI components"

# 15
git add contracts/test/
git commit -m "test(contracts): add Midnight Compact integration test suite"

# 16
git add .github/
git commit -m "chore(ci): setup GitHub Actions workflow for linting and testing"

# 17
git add scripts/ users_preprod.json
git commit -m "script: add utility to export Preprod verified users"

# 18
git add FEEDBACK.md docs/ARCHITECTURE.md
git commit -m "docs: add Level 5 architectural diagrams and feedback reports"

# 19
git add docs/USER_ONBOARDING.md docs/DEMO_VIDEO.md
git commit -m "docs: create onboarding guide and demo video script"

# 20
git add README.md bootstrap.bat
git commit -m "docs: update README for Level 5 final submission"

# Final check
git log --oneline -n 20

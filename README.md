🪙 Crypto Portfolio Tracker

A sleek cryptocurrency portfolio manager built with React, TypeScript, and Redux. Monitor your crypto holdings, track live prices, and manage your assets through a clean, dark-themed interface.

✨ Core Features
📊 Portfolio Overview

Total Portfolio Value: Displays your overall crypto holdings in real-time with a timestamp of the last update.

Interactive Donut Visualization: See your top 6 token holdings at a glance.

Mobile & Desktop Ready: Fully responsive layouts.

📈 Watchlist

Full Token Info: Logo, name, symbol, price, 24-hour change, and 7-day sparklines.

Editable Holdings: Inline editing for precise adjustments.

Auto Value Calculation: Holdings × current price is computed automatically.

Actions per Row: Edit or remove tokens easily.

Pagination: Cleanly displays 10 items per page.

🔍 Token Discovery

Smart Search: Find any cryptocurrency by name or symbol.

Trending Tokens: Explore popular coins using CoinGecko data.

Multi-select Additions: Add multiple tokens at once to your watchlist.

Clear Selection UI: Radio buttons with checkmarks for clarity.

💳 Wallet Integration

Multiple Wallet Support: Connect MetaMask or browser wallets via wagmi.

Connection Feedback: Display connected wallet addresses in the header.

Persistent State: Wallet connection persists across sessions.

🎨 UX & Design

Dark Theme: Modern, clean dark interface.

Live Updates: Refresh prices manually or see real-time changes.

Loading Indicators: Skeleton loaders for smoother experience.

Notifications: Success, error, and info toast messages.

Animations: Subtle hover effects and transitions throughout.

🛠 Tech Stack

React 19 + TypeScript

Vite - Lightning-fast dev server

Tailwind CSS - Utility-first styling

Redux Toolkit - Simplified state management

React Hooks & Custom Hooks - Reusable logic

LocalStorage - Persistent portfolio data

wagmi - Ethereum wallet integration

CoinGecko API - Cryptocurrency data source

🚀 Getting Started
Requirements
Node.js >= 18
npm >= 9

Installation

Clone the repo:

git clone <repo-url>
cd token-portfolio
npm install


Start development:

npm run dev


Visit http://localhost:5173

Build for production:

npm run build
npm run preview

Scripts Overview
Command	Purpose
npm run dev	Start dev server with HMR
npm run build	Compile production-ready code
npm run lint	Run ESLint
npm run preview	Preview production build locally
📊 Data Flow
CoinGecko API → Redux Store → React Components → UI
     ↓              ↓              ↓           ↓
Live data → Global state → Local state → User interface

Persistent State Example
localStorage: {
  "token-portfolio-state": {
    portfolio: {
      watchlist: WatchlistItem[],
      total: number,
      lastUpdated: string
    }
  }
}

🎯 Implementation Highlights
Portfolio Calculations
token.value = token.holdings * token.price
portfolio.total = watchlist.reduce((sum, token) => sum + token.value, 0)

Chart & Display Logic

Only top 6 holdings displayed in donut chart.

Consistent color palette per position.

Small holdings (<0.1%) handled gracefully.

API Integration
fetchTokenPrices() // Batched with 200ms interval
sparkline=true     // Include 7-day price data

Responsive Breakpoints
default: Mobile-first layout
lg: (1024px+) Desktop layout

🔧 Configuration
Vite Proxy (for CoinGecko)
server: {
  proxy: {
    '/api': {
      target: 'https://api.coingecko.com',
      changeOrigin: true
    }
  }
}

Wagmi Wallet Setup
chains: [mainnet, sepolia]
connectors: [injected(), metaMask()]

⚡ Performance & Optimization

React: useCallback & useMemo for expensive ops

Rendering: Avoid unnecessary re-renders

API: Batched & cached requests

Bundle: Tree-shaken for production, fast HMR for dev

🔐 Security & Data Safety

No private keys stored locally

Wallet state stays in browser

CoinGecko API is public; no auth required

TypeScript enforces compile-time type checks

🎨 Design System
Colors
--bg-primary: #212124
--bg-secondary: #27272A
--accent-primary: #A9E851
--chart-orange: #FB923C
--chart-purple: #A78BFA  
--chart-pink: #FB7185
--chart-green: #10B981
--chart-blue: #60A5FA
--chart-cyan: #18C9DD

Typography

Headers: 2xl, xl (semibold)

Body: base, sm

Data: Monospace formatting for numbers

🚀 Deployment

Vercel, Netlify, GitHub Pages supported

npm run build → dist/ ready for deployment

📈 Future Ideas

Historical portfolio tracking

Price alerts

Multi-currency support

Candlestick & volume charts

CSV/PDF export
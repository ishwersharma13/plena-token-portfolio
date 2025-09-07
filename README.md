
# 🪙 Crypto Portfolio Tracker

A sleek cryptocurrency portfolio manager built with **React, TypeScript, and Redux**.  
Monitor your crypto holdings, track live prices, and manage your assets through a clean, **dark-themed interface**.

A modern, responsive cryptocurrency portfolio tracking application built with React, TypeScript, and Tailwind CSS. Track your crypto investments, view portfolio breakdowns, and manage your watchlist with real-time data.

![Homepage](/src/assets/HomeDashboard.png)
![Mobile](/src/assets/HomeMobile.png)

---

## ✨ Core Features

### 📊 Portfolio Overview
- **Total Portfolio Value** – Real-time overall crypto holdings with last updated timestamp  
- **Interactive Donut Chart** – Displays your top 6 token holdings  
- **Responsive Layouts** – Works seamlessly on mobile & desktop  

### 📈 Watchlist
- Token info: logo, name, symbol, price, 24h change, 7d sparkline  
- Inline editing of holdings  
- Auto-calculated total value = *holdings × current price*  
- Edit or remove tokens easily  
- Pagination – 10 items per page  

### 🔍 Token Discovery
- Search tokens by name or symbol  
- Explore **trending coins** (CoinGecko API)  
- Add multiple tokens at once  
- Clear, intuitive selection UI  

### 💳 Wallet Integration
- Connect **MetaMask** or other browser wallets (wagmi)  
- Show connected wallet address in header  
- Wallet state persists across sessions  

### 🎨 UX & Design
- Modern dark theme  
- Manual refresh or real-time updates  
- Skeleton loaders for smooth transitions  
- Toast notifications (success, error, info)  
- Subtle animations & hover effects  

---

## 🛠 Tech Stack

- ⚛️ **React 19** + TypeScript  
- ⚡ **Vite** (dev + build)  
- 🎨 **Tailwind CSS** (utility-first styling)  
- 🗂 **Redux Toolkit** (state management)  
- 🔗 **wagmi** (Ethereum wallet integration)  
- 📡 **CoinGecko API** (live crypto data)  
- 💾 **LocalStorage** (persistent portfolio state)  

---

## 🚀 Getting Started

### Requirements
- Node.js **>= 18**  
- npm **>= 9**

### Installation
```bash
git clone <repo-url>
cd token-portfolio
npm install
````

### Development

```bash
npm run dev
```

Visit 👉 [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

---

## 📜 Scripts Overview

| Command           | Purpose                        |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start dev server (HMR)         |
| `npm run build`   | Build production-ready code    |
| `npm run lint`    | Run ESLint checks              |
| `npm run preview` | Preview local production build |

---

## 📊 Data Flow

```
CoinGecko API → Redux Store → React Components → UI
     ↓              ↓              ↓           ↓
 Live Data → Global State → Local State → User Interface
```

### Example Persistent State

```json
{
  "token-portfolio-state": {
    "portfolio": {
      "watchlist": [ ... ],
      "total": 12345,
      "lastUpdated": "2025-09-07T12:34:56Z"
    }
  }
}
```

---

## 🎯 Implementation Highlights

### Portfolio Calculations

```ts
token.value = token.holdings * token.price
portfolio.total = watchlist.reduce((sum, t) => sum + t.value, 0)
```

### Chart Logic

* Top 6 tokens only
* Consistent color palette
* Ignores tiny holdings (<0.1%)

### API Integration

```js
fetchTokenPrices() // batched every 200ms
sparkline = true   // includes 7-day data
```

### Responsive Layouts

* Mobile-first by default
* `lg:` breakpoints for desktop

---

## 🔧 Configuration

### Vite Proxy (CoinGecko)

```ts
server: {
  proxy: {
    '/api': {
      target: 'https://api.coingecko.com',
      changeOrigin: true
    }
  }
}
```

### Wagmi Wallet

```ts
chains: [mainnet, sepolia]
connectors: [injected(), metaMask()]
```

---

## ⚡ Performance & Optimization

* `useCallback` + `useMemo` to optimize rendering
* Batched & cached API requests
* Production builds are tree-shaken
* Fast hot-reload during dev

---

## 🔐 Security

* **No private keys stored**
* Wallet data stays in browser
* Public API only (no auth needed)
* TypeScript ensures type safety

---

## 🎨 Design System

### Colors

```
--bg-primary:   #212124
--bg-secondary: #27272A
--accent:       #A9E851
--chart-orange: #FB923C
--chart-purple: #A78BFA
--chart-pink:   #FB7185
--chart-green:  #10B981
--chart-blue:   #60A5FA
--chart-cyan:   #18C9DD
```

### Typography

* Headers: **2xl, xl** (semibold)
* Body: base, sm
* Numbers: monospace font

---

## 🚀 Deployment

Supports **Vercel, Netlify, GitHub Pages**.

```bash
npm run build
# deploy dist/ folder
```

---

## 📈 Future Roadmap

* Historical portfolio tracking
* Price alerts
* Multi-currency support
* Advanced charts (candlestick, volume)
* Export options (CSV/PDF)

---

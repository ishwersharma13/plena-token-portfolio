import type { RootState } from './index'

// Portfolio selectors
export const getWatchlist = (state: RootState) => state.portfolio.watchlist
export const getPortfolioTotal = (state: RootState) => state.portfolio.total
export const getLastUpdated = (state: RootState) => state.portfolio.lastUpdated
export const getPortfolioLoading = (state: RootState) => state.portfolio.isLoading
export const getPortfolioError = (state: RootState) => state.portfolio.error

// Wallet selectors
export const getWalletConnected = (state: RootState) => state.wallet.isConnected
export const getWalletAddress = (state: RootState) => state.wallet.address
export const getWalletConnecting = (state: RootState) => state.wallet.isConnecting
export const getWalletError = (state: RootState) => state.wallet.error

// Chart data from portfolio
export const getPortfolioChartData = (state: RootState) => {
  const watchlist = state.portfolio.watchlist
  return watchlist.map(item => ({
    name: item.symbol,
    value: item.value,
    color: item.change24h >= 0 ? '#10b981' : '#ef4444'
  }))
}

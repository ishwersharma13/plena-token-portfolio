import type { RootState } from './index'

// Portfolio selectors
export const getWatchlist = (state: RootState) => state.portfolio.watchlist
export const getPortfolioTotal = (state: RootState) => state.portfolio.totalValue
export const getLastUpdatedAt = (state: RootState) => state.portfolio.lastUpdatedAt
export const isPortfolioLoading = (state: RootState) => state.portfolio.isLoading
export const getPortfolioError = (state: RootState) => state.portfolio.errorMessage

// Wallet selectors
export const isWalletConnected = (state: RootState) => state.wallet.isConnected
export const getWalletAddress = (state: RootState) => state.wallet.address
export const isWalletConnecting = (state: RootState) => state.wallet.isConnecting
export const getWalletError = (state: RootState) => state.wallet.errorMessage

// Portfolio chart data
export const getPortfolioChartData = (state: RootState) => {
  return state.portfolio.watchlist.map(token => ({
    name: token.symbol,
    value: token.value,
    color: token.change24h >= 0 ? '#10b981' : '#ef4444',
  }))
}

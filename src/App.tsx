import { useSelector } from 'react-redux'
import { Header } from './components/Header'
import { Watchlist } from './components/Watchlist'
import { PortfolioCard } from './components/PortfolioCard'
import type { RootState } from './store'

export const App = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio)
  const { watchlist: portfolioItems, total: portfolioTotal, lastUpdated: updatedAt } = portfolio

  try {
    return (
      <div className="min-h-screen bg-[#212124]">
        <Header />

        <main className="mx-auto px-4 lg:px-6 py-4 lg:py-8">
          {/* Portfolio Summary */}
          <PortfolioCard
            watchlist={portfolioItems}
            total={portfolioTotal}
            lastUpdated={updatedAt}
          />

          {/* Watchlist Display */}
          <Watchlist />
        </main>
      </div>
    )
  } catch (err) {
    console.error('Error rendering App component:', err)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212124]">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-400">Try refreshing the page.</p>
        </div>
      </div>
    )
  }
}

export default App

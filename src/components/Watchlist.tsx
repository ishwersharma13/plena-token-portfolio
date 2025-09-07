import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StarIcon } from './icons/StarIcon'
import { RefreshIcon } from './icons/RefreshIcon'
import { AddIcon } from './icons/AddIcon'
import { EditIcon } from './icons/EditIcon'
import { RemoveIcon } from './icons/RemoveIcon'
import { TokenIconComponent } from './TokenIcon'
import { Sparkline } from './Sparkline'
import { AddTokenModal } from './AddTokenModal'
import { WatchlistRowSkeleton } from './LoadingSkeleton'
import { Toast } from './Toast'
import { useToast } from '../hooks/useToast'
import { useTokenPrices } from '../hooks/useTokenPrices'
import { updateHoldings, removeFromWatchlist } from '../store/slices/portfolioSlice'
import type { RootState } from '../store'
import type { WatchlistItem } from '../types'

export const Watchlist = () => {
  const dispatch = useDispatch()
  const { watchlist, isLoading } = useSelector((state: RootState) => state.portfolio)
  const { refreshPrices, isRefreshing } = useTokenPrices()
  const { toast, showToast, hideToast } = useToast()

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [editingToken, setEditingToken] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [watchlist.length])

  useEffect(() => {
    refreshPrices()
  }, [])

  const formatPrice = useCallback((price: number) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, [])
  const formatChange = useCallback((change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`, [])
  const formatHoldings = useCallback((holdings: number) => holdings.toFixed(4), [])

  const handleEditHoldings = (tokenId: string, currentValue: number) => {
    setEditingToken(tokenId)
    setEditValue(formatHoldings(currentValue))
    setOpenDropdown(null)
  }

  const handleSaveHoldings = () => {
    if (editingToken && editValue) {
      const holdings = parseFloat(editValue)
      if (!isNaN(holdings) && holdings >= 0) {
        dispatch(updateHoldings({ id: editingToken, holdings }))
        showToast(`Holdings updated successfully`, 'success')
      } else {
        showToast('Please enter a valid number', 'error')
      }
    }
    setEditingToken(null)
    setEditValue('')
  }

  const handleRefreshPrices = async () => {
    try {
      await refreshPrices()
      showToast('Prices refreshed successfully', 'success')
    } catch {
      showToast('Failed to refresh prices', 'error')
    }
  }

  // Pagination
  const totalPages = Math.ceil(watchlist.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWatchlist = watchlist.slice(startIndex, endIndex)
  const displayedRange = watchlist.length > 0 ? `${startIndex + 1} — ${Math.min(endIndex, watchlist.length)}` : 'No results'

  const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

  // Render a single token row (Desktop or Mobile)
  const renderTokenRow = (token: WatchlistItem) => (
    <>
      {/* Token */}
      <div className="flex items-center gap-3">
        <TokenIconComponent symbol={token.symbol} name={token.name} className="w-8 h-12" />
        <div>
          <div className="text-white font-normal text-sm">{token.name} <span className="hidden lg:inline text-gray-400">({token.symbol})</span></div>
          <div className="lg:hidden text-gray-400 text-xs">({token.symbol})</div>
        </div>
      </div>

      {/* Price */}
      <div className="text-[#A1A1AA] text-sm font-normal">{formatPrice(token.price)}</div>

      {/* 24h Change */}
      <div className={`text-sm font-normal ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatChange(token.change24h)}</div>

      {/* Sparkline */}
      <div className="flex items-center"><Sparkline symbol={token.symbol} change24h={token.change24h} sparklineData={token.sparklineData || []} /></div>

      {/* Holdings */}
      <div>
        {editingToken === token.id ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="w-[109px] bg-[#27272A] text-white text-sm px-2 py-1 rounded border-0 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
              step="0.0001" min="0" autoFocus
              style={{ boxShadow: "0 0 0 2px #A9E851, 0 0 0 4px rgba(169, 232, 81, 0.2)" }}
            />
            <button onClick={handleSaveHoldings} className="w-[51px] h-[32px] drop-shadow-md bg-[#A9E851] border-[2px] border-[#1F6619] px-2 py-1 text-black text-xs font-medium rounded-md transition-colors">Save</button>
          </div>
        ) : <div className="text-white text-sm font-normal">{formatHoldings(token.holdings)}</div>}
      </div>

      {/* Value */}
      <div className="text-white text-sm font-normal">{formatPrice(token.value)}</div>

      {/* Menu */}
      <div className="flex items-center justify-center relative">
        <button
          onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === token.id ? null : token.id) }}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span className="text-lg">⋯</span>
        </button>

        {openDropdown === token.id && (
          <div
            ref={dropdownRef}
            className="absolute lg:right-12 lg:-top-4 right-2 -top-16 shadow-lg z-50 w-[144px] bg-[#27272A] rounded-lg border border-[#3F3F46] p-2 pointer-events-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => handleEditHoldings(token.id, token.holdings)}
              className="w-full flex items-center gap-2 px-2 py-1 text-left text-[#A1A1AA] h-6 text-sm"
            >
              <EditIcon className="w-4 h-4" /> Edit Holdings
            </button>
            <div className="w-full h-px bg-[#3F3F46] my-1"></div>
            <button
              onClick={() => {
                dispatch(removeFromWatchlist(token.id))
                setOpenDropdown(null)
                showToast(`${token.symbol} removed from watchlist`, 'info')
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-left text-[#FDA4AF] h-6 text-sm"
            >
              <RemoveIcon className="w-4 h-4" /> Remove
            </button>
          </div>
        )}
      </div>
    </>
  )

  const renderTable = (isMobile = false) => (
    <div className={`${isMobile ? 'lg:hidden' : 'hidden lg:block'} rounded-xl bg-[#212124]`}>
      {/* Header */}
      <div className="grid px-6 py-4 h-[48px] border rounded-t-lg border-gray-600 bg-[#27272A] text-[#A1A1AA]" style={{ gridTemplateColumns: isMobile ? "repeat(6, 206px) 80px" : "repeat(6, 1fr) 80px", gap: "6px" }}>
        <div className="text-sm font-medium">Token</div>
        <div className="text-sm font-medium">Price</div>
        <div className="text-sm font-medium">24h %</div>
        <div className="text-sm font-medium">Sparkline (7d)</div>
        <div className="text-sm font-medium">Holdings</div>
        <div className="text-sm font-medium">Value</div>
        <div></div>
      </div>

      {/* Loading */}
      {isLoading && watchlist.length === 0 && Array.from({ length: 2 }).map((_, i) => <WatchlistRowSkeleton key={i} />)}

      {/* Empty */}
      {!isLoading && watchlist.length === 0 && <div className="flex items-center justify-center py-12 text-gray-400">No tokens in watchlist. Add some tokens to get started.</div>}

      {/* Rows */}
      <div className="border-x border-gray-600 py-2">{paginatedWatchlist.map(token => <div key={token.id} className="grid px-6 transition-colors cursor-pointer h-12 items-center" style={{ gridTemplateColumns: isMobile ? "repeat(6, 206px) 80px" : "repeat(6, 1fr) 80px", gap: "6px" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#27272A"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>{renderTokenRow(token)}</div>)}</div>

      {/* Pagination */}
      <div className={`flex items-center justify-between px-6 py-4 border ${isMobile ? 'border-t' : 'rounded-b-lg'} bg-[#212124] border-gray-600`}>
        <div className="text-gray-400 text-sm">{watchlist.length > 0 ? `${displayedRange} of ${watchlist.length} results` : "No results"}</div>
        <div className="flex items-center gap-2">
          <div className="text-gray-400 text-sm">{watchlist.length > 0 ? `${currentPage} of ${totalPages} pages` : "0 of 0 pages"}</div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevPage} disabled={currentPage <= 1} className={`px-2 py-1 transition-colors ${currentPage <= 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white cursor-pointer"}`}>Prev</button>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages} className={`px-2 py-1 transition-colors ${currentPage >= totalPages ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white cursor-pointer"}`}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mb-8">
      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <StarIcon className="w-6 h-6" />
          <h2 className="text-white text-xl font-semibold">Watchlist</h2>
        </div>

        <div className="flex items-center gap-3 h-[36px]">
          <button onClick={handleRefreshPrices} disabled={isRefreshing || isLoading} className={`h-full text-sm flex items-center border bg-[#27272A] border-gray-800 gap-2 px-4 py-2 text-white hover:bg-[#212124] rounded-lg transition-colors ${isRefreshing || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">{isRefreshing ? "Refreshing..." : "Refresh Prices"}</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="h-full flex items-center gap-2 px-4 py-2 text-black font-medium rounded-lg transition-colors bg-[#A9E851] border-2 border-[#1F6619] hover:scale-105">
            <AddIcon className="w-4 h-4" /> Add Token
          </button>
        </div>
      </div>

      {/* Tables */}
      {renderTable(false)}
      {renderTable(true)}

      <AddTokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  )
}

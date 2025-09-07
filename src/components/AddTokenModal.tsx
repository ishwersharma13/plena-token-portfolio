import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TokenIconComponent } from './TokenIcon';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';
import { CheckIcon } from './icons/CheckIcon';
import { addToWatchlist } from '../store/slices/portfolioSlice';
import { fetchTrendingTokens, searchTokens, fetchTokenDetails, type SearchToken } from '../services/api';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTokenModal = ({ isOpen, onClose }: AddTokenModalProps) => {
  const dispatch = useDispatch();
  const { toast, showToast, hideToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tokens, setTokens] = useState<SearchToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load trending tokens on modal open
  useEffect(() => {
    if (isOpen && tokens.length === 0) loadTrending();
  }, [isOpen]);

  // Search when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length > 2) searchTokensByQuery(trimmed);
    else if (trimmed.length === 0) loadTrending();
  }, [query]);

  const loadTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const trending = await fetchTrendingTokens();
      setTokens(trending.slice(0, 10));
    } catch (err) {
      console.error('Trending tokens load failed:', err);
      setError('Failed to load trending tokens');
      setTokens([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: '', large: '' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: '', large: '' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: '', large: '' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const searchTokensByQuery = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchTokens(q);
      setTokens(results.slice(0, 10));
    } catch (err) {
      console.error('Token search failed:', err);
      setError('Failed to search tokens');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAdd = async () => {
    if (!selectedIds.length) return;

    setLoading(true);
    const detailsList = [];
    try {
      for (const id of selectedIds) {
        try {
          const details = await fetchTokenDetails(id);
          detailsList.push({
            id: details.id,
            name: details.name || id,
            symbol: details.symbol?.toUpperCase() || id.toUpperCase(),
            price: details.current_price || 0,
            change24h: details.price_change_percentage_24h || 0,
            sparklineData: details.sparkline_in_7d?.price || []
          });
          await new Promise(res => setTimeout(res, 200));
        } catch (err) {
          console.error(`Failed fetching ${id}:`, err);
          detailsList.push({
            id,
            name: id,
            symbol: id.toUpperCase(),
            price: 0,
            change24h: 0,
            sparklineData: []
          });
        }
      }

      dispatch(addToWatchlist(detailsList));
      showToast(`Added ${selectedIds.length} token${selectedIds.length > 1 ? 's' : ''} to watchlist`, 'success');
      setSelectedIds([]);
      setQuery('');
      onClose();
    } catch (err) {
      console.error('Add to watchlist failed:', err);
      setError('Failed to add tokens to watchlist');
      showToast('Failed to add tokens to watchlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="relative flex flex-col w-[90vw] h-[90vh] max-w-[640px] max-h-[480px] mx-4 bg-[#212124] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div className="relative border-b border-gray-600">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tokens (e.g., ETH, SOL)..."
            disabled={loading}
            className="w-full h-[52px] px-4 pr-12 py-3 text-white bg-[#212124] outline-none"
          />
        </div>

        {/* Token List */}
        <div className="flex-1 flex flex-col px-2 pt-2 overflow-hidden">
          {error && (
            <div className="mb-4 p-3 border border-red-500 rounded-lg bg-red-600/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <h3 className="ml-1 mb-2 text-sm font-medium text-[#71717A]">Trending</h3>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <style>{`
              .custom-scrollbar::-webkit-scrollbar { width: 4px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 6px; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272A; border-radius: 6px; min-height: 96px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #27272A; }
            `}</style>
            {tokens.map(token => (
              <div
                key={token.id}
                className="flex items-center justify-between px-2 py-1 rounded-lg transition-colors cursor-pointer bg-transparent"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#27272A"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                onClick={() => toggleSelection(token.id)}
              >
                <div className="flex items-center gap-3">
                  <TokenIconComponent symbol={token.symbol} name={token.name} className="w-8 h-8" />
                  <div className="text-white font-medium text-sm">{token.name} ({token.symbol})</div>
                </div>

                <div className="flex items-center gap-3">
                  {selectedIds.includes(token.id) && (
                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 1.88542L9.47917 5.89583L14 6.55208L10.75 9.71875L11.4583 14.2292L7.5 12.1875L3.54167 14.2292L4.25 9.71875L1 6.55208L5.52083 5.89583L7.5 1.88542Z" fill="#A9E851" />
                    </svg>
                  )}
                  <div className={`flex items-center justify-center w-[12.5px] h-[12.5px] rounded-full bg-transparent ${selectedIds.includes(token.id) ? '' : 'border-2 border-zinc-500'}`}>
                    {selectedIds.includes(token.id) && <CheckIcon className="w-[15px] h-[15px] text-[#A9E851]" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-6 py-3 border-t border-gray-600 h-[57px] bg-[#27272A] rounded-b-xl">
          <button
            onClick={handleAdd}
            disabled={selectedIds.length === 0}
            className={`h-[32px] text-sm px-4 font-medium rounded-md border border-gray-600 transition-colors gap-2 ${selectedIds.length > 0 ? 'bg-[#A9E851] text-black hover:opacity-90' : 'bg-[#27272A] text-[#52525B] cursor-not-allowed'}`}
          >
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
};

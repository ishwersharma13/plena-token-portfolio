import { useCallback } from 'react';
import { PortfolioChart } from './PortfolioChart';
import type { WatchlistItem } from '../types';

interface PortfolioCardProps {
  watchlist: WatchlistItem[];
  total: number;
  lastUpdated: string;
}

export const PortfolioCard = ({ watchlist, total, lastUpdated }: PortfolioCardProps) => {
  const { DonutChart, chartData, chartTotal } = PortfolioChart({ watchlist });

  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, []);

  const calculatePercentage = (value: number) => {
    if (chartTotal <= 0) return '0.0';
    const percent = (value / chartTotal) * 100;
    return percent > 0 && percent < 0.1 ? '<0.1' : percent.toFixed(1);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex w-full h-72 gap-5 p-6 mb-8 bg-[#27272A] rounded-xl">
        {/* Left: Portfolio Total */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-gray-400 text-sm mb-2">Portfolio Total</h2>
          <div className="text-white text-4xl font-medium flex-1">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-gray-500 text-sm">Last updated: {formatTime(lastUpdated)}</p>
        </div>

        {/* Right: Chart */}
        <div className="flex-1">
          <h2 className="text-gray-400 text-sm mb-4">Portfolio Total</h2>
          <div className="flex items-start gap-6">
            <DonutChart data={chartData} />
            <div className="flex-1 space-y-4">
              {chartData.length ? (
                chartData.map((item, idx) => (
                  <div key={`${item.symbol}-${idx}`} className="flex items-center justify-between text-sm font-medium">
                    <span style={{ color: item.color }}>{item.name} ({item.symbol})</span>
                    <span className="text-gray-400">{calculatePercentage(item.value)}%</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No tokens with holdings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mb-8">
        <div className="p-6 bg-[#27272A] rounded-xl">
          <h2 className="text-gray-400 text-sm mb-3">Portfolio Total</h2>
          <div className="text-white text-3xl font-bold mb-6">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-gray-500 text-sm mb-6">Last updated: {formatTime(lastUpdated)}</p>

          <div className="flex flex-col items-center space-y-6">
            <DonutChart data={chartData} />
            <div className="w-full space-y-4">
              {chartData.length ? (
                chartData.map((item, idx) => (
                  <div key={`${item.symbol}-${idx}`} className="flex items-center justify-between text-sm">
                    <span style={{ color: item.color }}>{item.name} ({item.symbol})</span>
                    <span className="text-gray-400">{calculatePercentage(item.value)}%</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No tokens with holdings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import { useCallback, useMemo } from 'react';
import type { WatchlistItem } from '../types';

export interface DonutDataItem {
  name: string;
  symbol: string;
  value: number;
  color: string;
}

const DonutPieChart = ({ data }: { data: DonutDataItem[] }) => {
  const outerRadius = 80;
  const innerRadius = 45;
  const centerX = outerRadius;
  const centerY = outerRadius;

  let angleAccumulator = 0;
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  if (!data.length || totalValue === 0) {
    return (
      <div className="w-40 h-40 flex items-center justify-center">
        <svg width={160} height={160} viewBox="0 0 160 160">
          <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="#374151" strokeWidth="2" />
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="#18181B" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-40 h-40">
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="#ffffff" strokeWidth="1" />
        {data.map((item, idx) => {
          const fraction = totalValue > 0 ? item.value / totalValue : 0;
          const sliceAngle = fraction * 360;

          const startAngle = angleAccumulator;
          const endAngle = angleAccumulator + sliceAngle;

          const xStart = centerX + outerRadius * Math.cos((startAngle - 90) * (Math.PI / 180));
          const yStart = centerY + outerRadius * Math.sin((startAngle - 90) * (Math.PI / 180));
          const xEnd = centerX + outerRadius * Math.cos((endAngle - 90) * (Math.PI / 180));
          const yEnd = centerY + outerRadius * Math.sin((endAngle - 90) * (Math.PI / 180));

          const xInnerEnd = centerX + innerRadius * Math.cos((endAngle - 90) * (Math.PI / 180));
          const yInnerEnd = centerY + innerRadius * Math.sin((endAngle - 90) * (Math.PI / 180));
          const xInnerStart = centerX + innerRadius * Math.cos((startAngle - 90) * (Math.PI / 180));
          const yInnerStart = centerY + innerRadius * Math.sin((startAngle - 90) * (Math.PI / 180));

          const largeArcFlag = sliceAngle > 180 ? 1 : 0;

          const pathD = [
            `M ${xStart} ${yStart}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${xEnd} ${yEnd}`,
            `L ${xInnerEnd} ${yInnerEnd}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${xInnerStart} ${yInnerStart}`,
            'Z',
          ].join(' ');

          angleAccumulator += sliceAngle;

          return <path key={idx} d={pathD} fill={item.color} stroke="#ffffff" strokeWidth="1" />;
        })}
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="#ffffff" strokeWidth="1" />
      </svg>
    </div>
  );
};

interface PortfolioChartProps {
  watchlist: WatchlistItem[];
}

export const PortfolioChart = ({ watchlist }: PortfolioChartProps) => {
  const getSliceColor = useCallback((idx: number) => {
    const colors = ['#FB923C', '#A78BFA', '#FB7185', '#10B981', '#60A5FA', '#18C9DD'];
    return colors[idx % colors.length];
  }, []);

  const formattedData = useMemo(() => {
    return watchlist
      .filter(token => token.value > 0)
      .sort((a, b) => b.value - a.value)
      .map((token, idx) => ({
        name: token.name,
        symbol: token.symbol,
        value: token.value,
        color: getSliceColor(idx),
      }));
  }, [watchlist, getSliceColor]);

  const chartData = useMemo(() => formattedData.slice(0, 6), [formattedData]);
  const chartTotal = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData]);

  return { DonutChart: DonutPieChart, chartData, chartTotal };
};

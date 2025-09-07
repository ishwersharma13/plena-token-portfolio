interface SparklineProps {
  symbol: string;
  change24h: number;
  sparklineData?: number[];
}

export const Sparkline = ({ change24h, sparklineData }: SparklineProps) => {
  if (sparklineData && sparklineData.length > 0) {
    const chartWidth = 76;
    const chartHeight = 28;

    const minVal = Math.min(...sparklineData);
    const maxVal = Math.max(...sparklineData);
    const range = maxVal - minVal || 1;

    const svgPath = sparklineData
      .map((price, idx) => {
        const x = (idx / (sparklineData.length - 1)) * chartWidth;
        const y = chartHeight - ((price - minVal) / range) * chartHeight;
        return idx === 0 ? `M${x.toFixed(2)} ${y.toFixed(2)}` : `L${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');

    const strokeColor = change24h >= 0 ? '#32CA5B' : '#FF3A33';

    return (
      <div className="w-19 h-7 flex items-center justify-center">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={svgPath} stroke={strokeColor} strokeWidth={0.7} fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-19 h-7 flex items-center justify-center text-gray-400 text-xs">
      Loading...
    </div>
  );
};

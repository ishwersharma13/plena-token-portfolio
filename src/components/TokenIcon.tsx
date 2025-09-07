import ethereumImg from '../assets/ethereum.png';
import bitcoinImg from '../assets/bitcoin.png';
import solanaImg from '../assets/solana.png';
import dogecoinImg from '../assets/dogecoin.png';
import usdcImg from '../assets/USDC.png';
import stellarImg from '../assets/stellar.png';

interface TokenIconProps {
  symbol: string;
  name: string;
  className?: string;
}

export const TokenIconComponent = ({ symbol, name, className = 'w-8 h-8' }: TokenIconProps) => {
  const defaultIcons = [ethereumImg, bitcoinImg, solanaImg, dogecoinImg, usdcImg, stellarImg];

  const iconMap: Record<string, string> = {
    ETH: ethereumImg,
    BTC: bitcoinImg,
    SOL: solanaImg,
    DOGE: dogecoinImg,
    USDC: usdcImg,
    XLM: stellarImg,
  };

  const selectIcon = () => {
    if (iconMap[symbol]) return iconMap[symbol];

    // Generate a pseudo-random fallback icon based on symbol
    const symbolHash = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const index = symbolHash % defaultIcons.length;
    return defaultIcons[index];
  };

  return (
    <img
      src={selectIcon()}
      alt={`${name} (${symbol})`}
      className={`${className} rounded-lg w-[32px] h-[48px]`}
    />
  );
};

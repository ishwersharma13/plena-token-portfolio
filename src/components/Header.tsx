import { useState } from 'react';
import { TokenIcon } from './icons/TokenIcon';
import { WalletIcon } from './icons/WalletIcon';
import { WalletModal } from './WalletModal';
import { useWallet } from '../hooks/useWallet';

export const Header = () => {
  const { isConnected, address, isConnecting, disconnectWallet } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const handleWalletClick = () => {
    if (isConnected) disconnectWallet();
    else setWalletModalOpen(true);
  };

  const shortenAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const buttonLabel = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected && address) return shortenAddress(address);
    return 'Connect Wallet';
  };

  return (
    <header className="flex items-center justify-between px-6 py-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[28px] h-[28px] rounded-lg bg-[#A9E851]">
          <TokenIcon className="w-4 h-4 text-black" />
        </div>
        <h1 className="text-white text-xl font-semibold">Token Portfolio</h1>
      </div>

      {/* Wallet Button */}
      <button
        onClick={handleWalletClick}
        disabled={isConnecting}
        className={`flex items-center gap-2 p-2 font-medium rounded-full transition-colors bg-[#A9E851] text-black ${
          isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        <WalletIcon className="w-4 h-4" />
        {buttonLabel()}
      </button>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </header>
  );
};

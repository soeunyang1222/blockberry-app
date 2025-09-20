'use client';

import { useCurrentAccount, useDisconnectWallet, useWallets, useConnectWallet } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { ChevronDown, Wallet, LogOut, Copy, CheckCircle } from 'lucide-react';

export function WalletConnect() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 지갑이 연결되지 않은 경우
  if (!account) {
    return (
      <div className="relative">
        <Button
          variant="default"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          지갑 연결
          <ChevronDown className="w-4 h-4" />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-2">
              <h3 className="text-sm font-semibold text-foreground mb-2 px-2">
                지갑 선택
              </h3>
              {wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => {
                    connect({ wallet });
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-background-secondary rounded-md transition-colors"
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="w-6 h-6 rounded"
                  />
                  <span className="text-sm text-foreground">
                    {wallet.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 지갑이 연결된 경우
  return (
    <div className="relative">
      <Button
        variant="secondary"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        {formatAddress(account.address)}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <p className="text-xs text-foreground-muted mb-1">연결된 주소</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-foreground">
                {formatAddress(account.address)}
              </p>
              <button
                onClick={handleCopyAddress}
                className="p-1 hover:bg-background-secondary rounded transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground-muted" />
                )}
              </button>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                disconnect();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">연결 해제</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
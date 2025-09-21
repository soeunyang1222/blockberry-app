// Mock data types

export interface WalletBalance {
  asset?: string
  symbol: string
  name: string
  amount: number
  value: number
  price: number
}

export interface PortfolioData {
  totalValue: number
  totalInvested: number
  totalReturn: number
  returnRate: number
  holdings: {
    asset: string
    amount: number
    value: number
    avgBuyPrice: number
    currentPrice: number
    returnAmount: number
    returnRate: number
  }[]
}

export interface Transaction {
  id: string
  date: string
  type: 'buy' | 'sell'
  asset: string
  amount: number
  price: number
  total: number
  status: 'completed' | 'pending' | 'failed'
  vaultId?: string
}

export interface DCAOrder {
  id: string
  createdAt: string
  frequency: 'daily' | 'weekly' | 'monthly'
  amount: number
  fromAsset: string
  toAsset: string
  status: 'active' | 'paused' | 'completed'
  nextExecution: string
  executedCount: number
  totalInvested: number
}
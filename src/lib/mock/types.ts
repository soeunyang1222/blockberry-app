// Mock data types

export interface WalletBalance {
  asset: string
  symbol: string
  amount: number
  value: number
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
    change24h: number
  }[]
}

export interface Transaction {
  id: string
  date: string
  type: 'buy' | 'sell'
  asset: string
  amount: number
  price: number
  value: number
  status: 'completed' | 'pending' | 'failed'
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
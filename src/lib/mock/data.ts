// Mock database
import { WalletBalance, PortfolioData, Transaction, DCAOrder } from './types'

// Wallet data
export const mockWalletBalances: WalletBalance[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    amount: 1000000,  // 1,000,000 달러 (100만 달러)
    value: 1000000,
    price: 1
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    amount: 0.05,
    value: 2175,
    price: 43500
  }
]

// Portfolio data
export const mockPortfolio: PortfolioData = {
  totalValue: 1002175,  // 1,000,000 USDC + 2,175 WBTC value
  totalInvested: 1000000,
  totalReturn: 2175,
  returnRate: 0.2175,  // 0.2175% return rate
  holdings: [
    {
      asset: 'WBTC',
      amount: 0.05,
      value: 2175,
      avgBuyPrice: 43500,
      currentPrice: 43500,
      returnAmount: 0,
      returnRate: 0
    },
    {
      asset: 'USDC',
      amount: 1000000,  // 1,000,000 USDC (100만 달러)
      value: 1000000,
      avgBuyPrice: 1,
      currentPrice: 1,
      returnAmount: 0,
      returnRate: 0
    }
  ]
}

// Transaction history
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.001,
    price: 43500,
    total: 43.5,
    status: 'completed'
  },
  {
    id: 'txn-002',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0015,
    price: 43000,
    total: 64.5,
    status: 'completed'
  },
  {
    id: 'txn-003',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.002,
    price: 42800,
    total: 85.6,
    status: 'completed'
  },
  {
    id: 'txn-004',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0012,
    price: 42500,
    total: 51,
    status: 'completed'
  },
  {
    id: 'txn-005',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0018,
    price: 42000,
    total: 75.6,
    status: 'completed'
  },
  {
    id: 'txn-006',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0025,
    price: 41800,
    total: 104.5,
    status: 'completed'
  },
  {
    id: 'txn-007',
    date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.003,
    price: 41500,
    total: 124.5,
    status: 'completed'
  },
  {
    id: 'txn-008',
    date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), // 7 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0022,
    price: 41000,
    total: 90.2,
    status: 'completed'
  },
  {
    id: 'txn-009',
    date: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(), // 8 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0028,
    price: 40800,
    total: 114.24,
    status: 'completed'
  },
  {
    id: 'txn-010',
    date: new Date(Date.now() - 1000 * 60 * 60 * 216).toISOString(), // 9 days ago
    type: 'buy',
    asset: 'WBTC',
    amount: 0.0035,
    price: 40500,
    total: 141.75,
    status: 'completed'
  }
]

// DCA Orders
export const mockDCAOrders: DCAOrder[] = [
  {
    id: 'dca-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    frequency: 'daily',
    amount: 100,
    fromAsset: 'USDC',
    toAsset: 'WBTC',
    status: 'active',
    nextExecution: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(), // 22 hours from now
    executedCount: 30,
    totalInvested: 3000
  },
  {
    id: 'dca-002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    frequency: 'weekly',
    amount: 500,
    fromAsset: 'USDC',
    toAsset: 'WBTC',
    status: 'active',
    nextExecution: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    executedCount: 1,
    totalInvested: 500
  },
  {
    id: 'dca-003',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
    frequency: 'monthly',
    amount: 1000,
    fromAsset: 'USDC',
    toAsset: 'WBTC',
    status: 'paused',
    nextExecution: '',
    executedCount: 2,
    totalInvested: 2000
  }
]

// In-memory storage for new orders
let orderIdCounter = 4
let transactionIdCounter = 11

export const addDCAOrder = (order: Omit<DCAOrder, 'id' | 'createdAt' | 'nextExecution' | 'executedCount' | 'totalInvested'>): DCAOrder => {
  const newOrder: DCAOrder = {
    ...order,
    id: `dca-${String(orderIdCounter++).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    nextExecution: calculateNextExecution(order.frequency),
    executedCount: 0,
    totalInvested: 0
  }
  mockDCAOrders.push(newOrder)
  
  // DCA 주문 생성 시 첫 거래 내역도 자동으로 추가 (데모용)
  const newTransaction: Transaction = {
    id: `txn-${String(transactionIdCounter++).padStart(3, '0')}`,
    date: new Date().toISOString(),
    type: 'buy',
    asset: order.toAsset,
    amount: order.amount / 43500, // Mock BTC price로 계산 (일일 구매량)
    price: 43500,
    total: order.amount,
    status: 'completed'
  }
  mockTransactions.unshift(newTransaction) // 최신 거래를 앞에 추가
  
  // 지갑 잔액 업데이트 - 전체 기간의 금액을 차감
  const daysInPeriod = order.frequency === 'daily' ? 30 : 
                       order.frequency === 'weekly' ? 7 : 30
  const totalOrderAmount = order.amount * daysInPeriod // 전체 기간 동안의 총 금액
  
  const usdcBalance = mockWalletBalances.find(b => b.symbol === 'USDC')
  const btcBalance = mockWalletBalances.find(b => b.symbol === 'WBTC')
  
  if (usdcBalance) {
    usdcBalance.amount -= totalOrderAmount // 전체 금액 차감
    usdcBalance.value = usdcBalance.amount
  }
  if (btcBalance) {
    // 첫 거래만 BTC 추가 (데모용)
    btcBalance.amount += order.amount / 43500
    btcBalance.value = btcBalance.amount * 43500
  }
  
  // Portfolio 업데이트
  mockPortfolio.totalValue = mockWalletBalances.reduce((sum, b) => sum + b.value, 0)
  mockPortfolio.totalInvested += order.amount
  mockPortfolio.holdings = [
    {
      asset: 'WBTC',
      amount: btcBalance?.amount || 0,
      value: btcBalance?.value || 0,
      avgBuyPrice: 43500,
      currentPrice: 43500,
      returnAmount: 0,
      returnRate: 0
    },
    {
      asset: 'USDC',
      amount: usdcBalance?.amount || 0,
      value: usdcBalance?.value || 0,
      avgBuyPrice: 1,
      currentPrice: 1,
      returnAmount: 0,
      returnRate: 0
    }
  ]
  
  return newOrder
}

function calculateNextExecution(frequency: 'daily' | 'weekly' | 'monthly'): string {
  const now = new Date()
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1)
      break
    case 'weekly':
      now.setDate(now.getDate() + 7)
      break
    case 'monthly':
      now.setMonth(now.getMonth() + 1)
      break
  }
  return now.toISOString()
}

// Update wallet balance (for simulating trades)
export const updateWalletBalance = (asset: string, amountChange: number) => {
  const balance = mockWalletBalances.find(b => b.symbol === asset)
  if (balance) {
    balance.amount += amountChange
    balance.value = asset === 'USDC' ? balance.amount : balance.amount * 43500 // Mock BTC price
  }
}
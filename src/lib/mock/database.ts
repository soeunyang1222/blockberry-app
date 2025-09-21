import {
  WalletBalance,
  PortfolioData,
  Transaction,
  DCAOrder
} from './types';

// Mock data for production builds
const mockWalletBalances: WalletBalance[] = [
  { symbol: 'USDC', name: 'USD Coin', amount: 1000000, value: 1000000, price: 1 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', amount: 0, value: 0, price: 95000 },
  { symbol: 'SUI', name: 'Sui', amount: 0, value: 0, price: 3.75 }
];

const mockPortfolio: PortfolioData = {
  totalValue: 1000000,
  totalInvested: 1000000,
  totalReturn: 0,
  returnRate: 0,
  holdings: [
    { asset: 'USDC', amount: 1000000, value: 1000000, avgBuyPrice: 1, currentPrice: 1, returnAmount: 0, returnRate: 0 },
    { asset: 'WBTC', amount: 0, value: 0, avgBuyPrice: 0, currentPrice: 95000, returnAmount: 0, returnRate: 0 }
  ]
};

const mockTransactions: Transaction[] = [];
const mockDCAOrders: DCAOrder[] = [];

// In-memory storage for mock data
let walletBalances = [...mockWalletBalances];
let portfolio = { ...mockPortfolio };
let transactions = [...mockTransactions];
let dcaOrders = [...mockDCAOrders];

// Database operations (mock implementations)
export const getWalletBalances = (): WalletBalance[] => {
  return walletBalances;
};

export const updateWalletBalance = (symbol: string, amount: number) => {
  const index = walletBalances.findIndex(b => b.symbol === symbol);
  if (index !== -1) {
    walletBalances[index].amount = amount;
    walletBalances[index].value = amount * walletBalances[index].price;
  }
};

export const getPortfolio = (): PortfolioData => {
  return portfolio;
};

export const updatePortfolio = (data: Partial<PortfolioData>) => {
  portfolio = { ...portfolio, ...data };
};

export const getTransactions = (): Transaction[] => {
  return transactions;
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const id = `tx-${Date.now()}`;
  const newTransaction = { id, ...transaction };
  transactions.unshift(newTransaction);
  return newTransaction;
};

export const getDCAOrders = (): DCAOrder[] => {
  return dcaOrders;
};

export const addDCAOrder = (order: Omit<DCAOrder, 'id' | 'createdAt' | 'nextExecution' | 'executedCount' | 'totalInvested'>): DCAOrder => {
  const now = new Date();
  const nextExecution = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const newOrder: DCAOrder = {
    id: `dca-${Date.now()}`,
    createdAt: now.toISOString(),
    ...order,
    nextExecution: nextExecution.toISOString(),
    executedCount: 0,
    totalInvested: 0
  };

  dcaOrders.unshift(newOrder);
  return newOrder;
};

export const updateDCAOrderStatus = (id: string, status: DCAOrder['status']): boolean => {
  const index = dcaOrders.findIndex(o => o.id === id);
  if (index !== -1) {
    dcaOrders[index].status = status;
    return true;
  }
  return false;
};

export default null;
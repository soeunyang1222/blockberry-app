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

// Database operations (mock implementations for production)
export const getWalletBalances = (): WalletBalance[] => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      const balances = db.prepare('SELECT * FROM wallet_balances').all() as any[];
      db.close();
      
      return balances.map(b => ({
        symbol: b.symbol,
        name: b.name,
        amount: b.amount,
        value: b.value,
        price: b.price
      }));
    } catch (error) {
      console.warn('Database not available, using mock data');
    }
  }
  
  return mockWalletBalances;
};

export const updateWalletBalance = (symbol: string, amount: number) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      const stmt = db.prepare(`
        UPDATE wallet_balances
        SET amount = ?, value = ? * price
        WHERE symbol = ?
      `);
      stmt.run(amount, amount, symbol);
      db.close();
    } catch (error) {
      console.warn('Database not available, mock update skipped');
    }
  }
};

export const getPortfolio = (): PortfolioData => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      const portfolio = db.prepare('SELECT * FROM portfolio ORDER BY id DESC LIMIT 1').get() as any;
      const holdings = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ?').all(portfolio.id) as any[];
      db.close();

      return {
        totalValue: portfolio.total_value,
        totalInvested: portfolio.total_invested,
        totalReturn: portfolio.total_return,
        returnRate: portfolio.return_rate,
        holdings: holdings.map(h => ({
          asset: h.asset,
          amount: h.amount,
          value: h.value,
          avgBuyPrice: h.avg_buy_price,
          currentPrice: h.current_price,
          returnAmount: h.return_amount,
          returnRate: h.return_rate
        }))
      };
    } catch (error) {
      console.warn('Database not available, using mock data');
    }
  }
  
  return mockPortfolio;
};

export const updatePortfolio = (data: Partial<PortfolioData>) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      if (data.totalValue !== undefined) {
        db.prepare(`
          UPDATE portfolio
          SET total_value = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT MAX(id) FROM portfolio)
        `).run(data.totalValue);
      }
      db.close();
    } catch (error) {
      console.warn('Database not available, mock update skipped');
    }
  }
};

export const getTransactions = (): Transaction[] => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      const transactions = db.prepare('SELECT * FROM transactions ORDER BY date DESC').all() as any[];
      db.close();
      
      return transactions.map(t => ({
        id: t.id,
        type: t.type as Transaction['type'],
        amount: t.amount,
        asset: t.asset,
        price: t.price,
        total: t.total,
        date: t.date,
        status: t.status as Transaction['status'],
        vaultId: t.vault_id
      }));
    } catch (error) {
      console.warn('Database not available, using mock data');
    }
  }
  
  return mockTransactions;
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const id = `tx-${Date.now()}`;
  const newTransaction = { id, ...transaction };

  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      db.prepare(`
        INSERT INTO transactions (id, type, amount, asset, price, total, date, status, vault_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        newTransaction.type,
        newTransaction.amount,
        newTransaction.asset,
        newTransaction.price,
        newTransaction.total,
        newTransaction.date,
        newTransaction.status,
        newTransaction.vaultId || null
      );
      db.close();
    } catch (error) {
      console.warn('Database not available, mock transaction added');
    }
  }

  return newTransaction;
};

export const getDCAOrders = (): DCAOrder[] => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      const orders = db.prepare('SELECT * FROM dca_orders ORDER BY created_at DESC').all() as any[];
      db.close();
      
      return orders.map(o => ({
        id: o.id,
        createdAt: o.created_at,
        frequency: o.frequency as DCAOrder['frequency'],
        amount: o.amount,
        fromAsset: o.from_asset,
        toAsset: o.to_asset,
        status: o.status as DCAOrder['status'],
        nextExecution: o.next_execution,
        executedCount: o.executed_count,
        totalInvested: o.total_invested
      }));
    } catch (error) {
      console.warn('Database not available, using mock data');
    }
  }
  
  return mockDCAOrders;
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

  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      db.prepare(`
        INSERT INTO dca_orders
        (id, created_at, frequency, amount, from_asset, to_asset, status, next_execution, executed_count, total_invested)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newOrder.id,
        newOrder.createdAt,
        newOrder.frequency,
        newOrder.amount,
        newOrder.fromAsset,
        newOrder.toAsset,
        newOrder.status,
        newOrder.nextExecution,
        newOrder.executedCount,
        newOrder.totalInvested
      );
      db.close();
    } catch (error) {
      console.warn('Database not available, mock DCA order added');
    }
  }

  return newOrder;
};

export const updateDCAOrderStatus = (id: string, status: DCAOrder['status']): boolean => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'mock-data.db');
      const db = new Database(dbPath);
      
      const result = db.prepare(`
        UPDATE dca_orders
        SET status = ?
        WHERE id = ?
      `).run(status, id);
      db.close();
      
      return result.changes > 0;
    } catch (error) {
      console.warn('Database not available, mock update skipped');
    }
  }
  
  return false;
};

export default null;
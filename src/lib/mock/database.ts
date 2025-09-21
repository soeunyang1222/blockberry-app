import Database from 'better-sqlite3';
import path from 'path';
import {
  WalletBalance,
  PortfolioData,
  Transaction,
  DCAOrder
} from './types';

// Create database file in project root
const dbPath = path.join(process.cwd(), 'mock-data.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS wallet_balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    value REAL NOT NULL,
    price REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_value REAL NOT NULL,
    total_invested REAL NOT NULL,
    total_return REAL NOT NULL,
    return_rate REAL NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER,
    asset TEXT NOT NULL,
    amount REAL NOT NULL,
    value REAL NOT NULL,
    avg_buy_price REAL NOT NULL,
    current_price REAL NOT NULL,
    return_amount REAL NOT NULL,
    return_rate REAL NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolio(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    asset TEXT NOT NULL,
    price REAL NOT NULL,
    total REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    vault_id TEXT
  );

  CREATE TABLE IF NOT EXISTS dca_orders (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    frequency TEXT NOT NULL,
    amount REAL NOT NULL,
    from_asset TEXT NOT NULL,
    to_asset TEXT NOT NULL,
    status TEXT NOT NULL,
    next_execution TEXT NOT NULL,
    executed_count INTEGER NOT NULL,
    total_invested REAL NOT NULL
  );
`);

// Initialize default data if empty
const initializeData = () => {
  const walletCount = db.prepare('SELECT COUNT(*) as count FROM wallet_balances').get() as { count: number };

  if (walletCount.count === 0) {
    // Initialize wallet balances
    db.prepare(`
      INSERT INTO wallet_balances (symbol, name, amount, value, price)
      VALUES
        ('USDC', 'USD Coin', 1000000, 1000000, 1),
        ('WBTC', 'Wrapped Bitcoin', 0, 0, 95000),
        ('SUI', 'Sui', 0, 0, 3.75)
    `).run();

    // Initialize portfolio
    const portfolioId = db.prepare(`
      INSERT INTO portfolio (total_value, total_invested, total_return, return_rate)
      VALUES (1000000, 1000000, 0, 0)
    `).run().lastInsertRowid;

    // Initialize portfolio holdings
    db.prepare(`
      INSERT INTO portfolio_holdings
        (portfolio_id, asset, amount, value, avg_buy_price, current_price, return_amount, return_rate)
      VALUES
        (?, 'USDC', 1000000, 1000000, 1, 1, 0, 0),
        (?, 'WBTC', 0, 0, 0, 95000, 0, 0)
    `).run(portfolioId, portfolioId);
  }
};

initializeData();

// Database operations
export const getWalletBalances = (): WalletBalance[] => {
  const balances = db.prepare('SELECT * FROM wallet_balances').all() as any[];
  return balances.map(b => ({
    symbol: b.symbol,
    name: b.name,
    amount: b.amount,
    value: b.value,
    price: b.price
  }));
};

export const updateWalletBalance = (symbol: string, amount: number) => {
  const stmt = db.prepare(`
    UPDATE wallet_balances
    SET amount = ?, value = ? * price
    WHERE symbol = ?
  `);
  stmt.run(amount, amount, symbol);
};

export const getPortfolio = (): PortfolioData => {
  const portfolio = db.prepare('SELECT * FROM portfolio ORDER BY id DESC LIMIT 1').get() as any;
  const holdings = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ?').all(portfolio.id) as any[];

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
};

export const updatePortfolio = (data: Partial<PortfolioData>) => {
  if (data.totalValue !== undefined) {
    db.prepare(`
      UPDATE portfolio
      SET total_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT MAX(id) FROM portfolio)
    `).run(data.totalValue);
  }
};

export const getTransactions = (): Transaction[] => {
  const transactions = db.prepare('SELECT * FROM transactions ORDER BY date DESC').all() as any[];
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
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const id = `tx-${Date.now()}`;
  const newTransaction = { id, ...transaction };

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

  return newTransaction;
};

export const getDCAOrders = (): DCAOrder[] => {
  const orders = db.prepare('SELECT * FROM dca_orders ORDER BY created_at DESC').all() as any[];
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
};

export const addDCAOrder = (order: Omit<DCAOrder, 'id' | 'createdAt' | 'nextExecution' | 'executedCount' | 'totalInvested'>): DCAOrder => {
  try {
    const now = new Date();
    const nextExecution = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next day

    const newOrder: DCAOrder = {
      id: `dca-${Date.now()}`,
      createdAt: now.toISOString(),
      ...order,
      nextExecution: nextExecution.toISOString(),
      executedCount: 0,
      totalInvested: 0
    };

    // Insert new DCA order
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

  // Create transaction record
  // frequency: 'daily', 'weekly', 'monthly'
  // For monthly: $100/day for 30 days = $3000 total
  // For weekly: $100/day for 7 days = $700 total
  const daysInPeriod = order.frequency === 'daily' ? 1 :
                       order.frequency === 'weekly' ? 7 :
                       order.frequency === 'monthly' ? 30 : 30;
  const totalOrderAmount = order.amount * daysInPeriod;

  addTransaction({
    type: 'buy',
    amount: totalOrderAmount / 95000, // Convert to BTC amount
    asset: order.toAsset,
    price: 95000,
    total: totalOrderAmount,
    date: now.toISOString(),
    status: 'completed',
    vaultId: 'vault-1'
  });

  // Update wallet balances
  const usdcBalance = db.prepare('SELECT amount FROM wallet_balances WHERE symbol = ?').get('USDC') as { amount: number };
  const btcBalance = db.prepare('SELECT amount FROM wallet_balances WHERE symbol = ?').get('WBTC') as { amount: number };

  if (usdcBalance) {
    updateWalletBalance('USDC', usdcBalance.amount - totalOrderAmount);
  }

  if (btcBalance && order.toAsset === 'WBTC') {
    const btcAmount = totalOrderAmount / 95000;
    updateWalletBalance('WBTC', btcBalance.amount + btcAmount);
  }

  // Update portfolio
  const portfolio = getPortfolio();
  const newTotalValue = portfolio.totalValue - totalOrderAmount + (totalOrderAmount / 95000) * 95000;
  updatePortfolio({ totalValue: newTotalValue });

  // Update portfolio holdings
  db.prepare(`
    UPDATE portfolio_holdings
    SET amount = ?, value = ?
    WHERE asset = ? AND portfolio_id = (SELECT MAX(id) FROM portfolio)
  `).run(
    usdcBalance.amount - totalOrderAmount,
    usdcBalance.amount - totalOrderAmount,
    'USDC'
  );

  if (order.toAsset === 'WBTC') {
    const newBtcAmount = btcBalance.amount + (totalOrderAmount / 95000);
    db.prepare(`
      UPDATE portfolio_holdings
      SET amount = ?, value = ?, avg_buy_price = 95000
      WHERE asset = ? AND portfolio_id = (SELECT MAX(id) FROM portfolio)
    `).run(
      newBtcAmount,
      newBtcAmount * 95000,
      'WBTC'
    );
  }

    return newOrder;
  } catch (error) {
    console.error('Error in addDCAOrder:', error);
    throw error;
  }
};

export const updateDCAOrderStatus = (id: string, status: DCAOrder['status']): boolean => {
  const result = db.prepare(`
    UPDATE dca_orders
    SET status = ?
    WHERE id = ?
  `).run(status, id);

  return result.changes > 0;
};

// Clean up database connection on process exit
process.on('exit', () => db.close());
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  db.close();
  process.exit(0);
});

export default db;
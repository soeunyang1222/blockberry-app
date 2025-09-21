import { NextResponse } from 'next/server';
import db from '@/lib/mock/database';

export async function POST() {
  try {

    // Start transaction
    const resetData = db.transaction(() => {
      // Clear all existing data
      db.prepare('DELETE FROM dca_orders').run();
      db.prepare('DELETE FROM transactions').run();
      db.prepare('DELETE FROM portfolio_holdings').run();
      db.prepare('DELETE FROM portfolio').run();
      db.prepare('DELETE FROM wallet_balances').run();

      // Reset wallet balances to initial state
      db.prepare(`
        INSERT INTO wallet_balances (symbol, name, amount, value, price)
        VALUES
          ('USDC', 'USD Coin', 1000000, 1000000, 1),
          ('WBTC', 'Wrapped Bitcoin', 0, 0, 95000),
          ('SUI', 'Sui', 0, 0, 3.75)
      `).run();

      // Reset portfolio
      const portfolioId = db.prepare(`
        INSERT INTO portfolio (total_value, total_invested, total_return, return_rate)
        VALUES (1000000, 1000000, 0, 0)
      `).run().lastInsertRowid;

      // Reset portfolio holdings
      db.prepare(`
        INSERT INTO portfolio_holdings
          (portfolio_id, asset, amount, value, avg_buy_price, current_price, return_amount, return_rate)
        VALUES
          (?, 'USDC', 1000000, 1000000, 1, 1, 0, 0),
          (?, 'WBTC', 0, 0, 0, 95000, 0, 0)
      `).run(portfolioId, portfolioId);
    });

    // Execute transaction
    resetData();

    // Don't close the shared database connection

    return NextResponse.json({
      success: true,
      message: 'Demo data has been reset successfully',
      data: {
        initialBalance: 1000000,
        currency: 'USDC'
      }
    });

  } catch (error) {
    console.error('Failed to reset demo data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset demo data'
      },
      { status: 500 }
    );
  }
}
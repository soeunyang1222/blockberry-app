export interface PortfolioAsset {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalValueBTC: number;
  totalReturn: number;
  unrealizedGainLoss: number;
  totalCostBasis: number;
}

export interface RecurringOrder {
  id: string;
  asset: string;
  frequency: 'weekly' | 'monthly';
  amount: number;
  currency: string;
  nextExecution: Date;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  currency: string;
  price: number;
  total: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface InvestmentPortfolio {
  stats: PortfolioStats;
  assets: PortfolioAsset[];
  recurringOrders: RecurringOrder[];
}

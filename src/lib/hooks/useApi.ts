import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query Keys
export const queryKeys = {
  wallet: ['wallet', 'balance'] as const,
  portfolio: ['portfolio'] as const,
  transactions: (limit: number = 10) => ['transactions', limit] as const,
  dcaOrders: ['dca', 'orders'] as const,
};

// Fetch functions
const fetchWalletBalance = async () => {
  const response = await fetch('/api/wallet/balance');
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchPortfolio = async () => {
  const response = await fetch('/api/portfolio');
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchTransactions = async (limit: number = 10) => {
  const response = await fetch(`/api/transactions?limit=${limit}`);
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchDCAOrders = async () => {
  const response = await fetch('/api/dca/orders');
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const createDCAOrder = async (orderData: any) => {
  const response = await fetch('/api/dca/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

// Custom hooks
export const useWalletBalance = () => {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: fetchWalletBalance,
  });
};

export const usePortfolio = () => {
  return useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: fetchPortfolio,
  });
};

export const useTransactions = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.transactions(limit),
    queryFn: () => fetchTransactions(limit),
  });
};

export const useDCAOrders = () => {
  return useQuery({
    queryKey: queryKeys.dcaOrders,
    queryFn: fetchDCAOrders,
  });
};

export const useCreateDCAOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDCAOrder,
    onSuccess: () => {
      // Invalidate all related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
      queryClient.invalidateQueries({ queryKey: queryKeys.dcaOrders });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useResetDemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/demo/reset', {
        method: 'POST',
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      // Invalidate all queries to refetch fresh data
      queryClient.invalidateQueries();
    },
  });
};
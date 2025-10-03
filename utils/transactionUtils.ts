// Transaction utilities for consistent styling across components

export const getTransactionColor = (type: string): string => {
  const colors = {
    income: '#10b981',
    expense: '#ef4444',
    transfer: '#3b82f6',
    withdrawal: '#f59e0b',
  };

  switch (type) {
    case 'income': return colors.income;
    case 'expense': return colors.expense;
    case 'transfer': return colors.transfer;
    default: return colors.withdrawal;
  }
};

export const getTransactionIcon = (type: string): string => {
  switch (type) {
    case 'income': return 'arrow-down';
    case 'expense': return 'arrow-up';
    case 'transfer': return 'swap-horizontal';
    default: return 'arrow-down';
  }
};
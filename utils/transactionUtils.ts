// Transaction utilities for consistent styling across components

export const getTransactionColor = (type_id: string): string => {
  const colors: Record<string, string> = {
    '1': '#ef4444',
    '2': '#10b981',
    '3': '#3b82f6',
    '4': '#f59e0b',
  }

  return colors[type_id] || '#6b7280';
};

export const getTransactionIcon = (type_id: string): string => {
  const icons: Record<string, string> = {
    '1': 'arrow-up',
    '2': 'arrow-down',
    '3': 'swap-horizontal',
    '4': 'arrow-down',
  }

  return icons[type_id] || 'arrow-down';
};

export const getTransactionType = (transaction: any): string => {
  // Cek apakah transaksi adalah withdrawal atau transfer berdasarkan nama/code
  const nameLower = transaction.name.toLowerCase();
  const codeLower = transaction.code.toLowerCase();

  if (nameLower.includes('withdrawal') || nameLower.includes('withdraw') || codeLower.includes('wd')) {
    return 'withdrawal';
  }

  if (nameLower.includes('transfer') || nameLower.includes('tf') || codeLower.includes('tf')) {
    return 'transfer';
  }

  return transaction.type;
};

export const formatAmount = (amount: string): string => {
  // Remove any non-digit characters
  const cleanAmount = amount.replace(/[^\d]/g, '');

  // If empty, return empty string
  if (!cleanAmount) {
    return '';
  }

  // Format with thousand separators
  const formatted = Number(cleanAmount).toLocaleString('id-ID');
  return formatted;
};
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    minHeight: '100%',
  },

  // Welcome Section
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  avatar: {
    backgroundColor: '#6366f1',
  },

  // Balance Card
  balanceCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientBackground: {
    borderRadius: 16,
    padding: 0,
  },
  balanceCardContent: {
    padding: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  incomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d1fae5',
    marginBottom: 4,
  },
  expenseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fee2e2',
    marginBottom: 4,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  actionCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 8,
  },

  // Recent Transactions
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  transactionsCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Loading & Empty States
  loginButton: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontSize: 14,
  },

  // Transaction Colors
  transactionColors: {
    income: '#10b981',
    expense: '#ef4444',
    transfer: '#3b82f6',
    withdrawal: '#f59e0b',
  } as const,
});

// Helper functions
export const getTransactionColor = (type: string) => {
  switch (type) {
    case 'income': return styles.transactionColors.income;
    case 'expense': return styles.transactionColors.expense;
    case 'transfer': return styles.transactionColors.transfer;
    default: return styles.transactionColors.withdrawal;
  }
};

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'income': return 'arrow-down';
    case 'expense': return 'arrow-up';
    case 'transfer': return 'swap-horizontal';
    default: return 'arrow-down';
  }
};
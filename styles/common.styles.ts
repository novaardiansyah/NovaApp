import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerIcon: {
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },

  authText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 24,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardContent: {
    paddingVertical: 16,
  },

  totalBalanceCard: {
    backgroundColor: '#4338ca',
    borderRadius: 16,
    marginBottom: 24,
  },

  totalBalanceContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  totalBalanceLabel: {
    color: '#e0e7ff',
    fontSize: 16,
    marginBottom: 8,
  },

  totalBalanceAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  totalBalanceSubtitle: {
    color: '#c7d2fe',
    fontSize: 14,
  },

  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 8,
  },

  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },

  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  accountLogo: {
    marginRight: 16,
    backgroundColor: '#f3f4f6',
  },

  accountInfo: {
    flex: 1,
  },

  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },

  accountBalance: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Welcome section styles
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
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },

  avatar: {
    backgroundColor: '#e5e7eb',
  },

  // Balance card styles
  balanceCard: {
    marginBottom: 24,
    borderRadius: 16,
  },

  gradientBackground: {
    borderRadius: 16,
    padding: 20,
  },

  balanceCardContent: {
    alignItems: 'center',
  },

  balanceLabel: {
    color: '#e0e7ff',
    fontSize: 16,
    marginBottom: 8,
  },

  balanceAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  balanceItem: {
    alignItems: 'flex-start',
  },

  balanceItemRight: {
    alignItems: 'flex-end',
  },

  incomeText: {
    color: '#86efac',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  expenseText: {
    color: '#fca5a5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  balanceItemLabel: {
    color: '#c7d2fe',
    fontSize: 14,
  },

  // Quick actions styles
  quickActionsSection: {
    marginBottom: 24,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  actionCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
    marginTop: 8,
  },

  // Transactions styles
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },

  transactionDate: {
    fontSize: 14,
    color: '#6b7280',
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },

  // Profile styles
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },

  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },

  profileButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },

  profileButton: {
    flex: 1,
  },

  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 24,
  },

  settingsSection: {
    marginBottom: 24,
  },

  logoutButton: {
    backgroundColor: '#ef4444',
    borderWidth: 0,
  },

  logoutButtonLabel: {
    color: '#ffffff',
  },

  // Additional styles for ProfileScreen
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },

  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },

  userId: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

// Helper function for currency formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function for scroll container with safe area
export const getScrollContainerStyle = (insets: { top: number }) => [
  commonStyles.scrollContainer,
  { paddingTop: insets.top + 4 }
];

// Helper function for status bar config
export const statusBarConfig = {
  barStyle: 'dark-content' as const,
  backgroundColor: '#f9fafb',
  translucent: Platform.OS === 'ios',
};
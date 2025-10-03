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
  });


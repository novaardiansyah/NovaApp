import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import RecentTransactionsSkeleton from './RecentTransactionsSkeleton';

interface RecentTransactionsProps {
  transactions: any[];
  loading: boolean;
  onSeeAll: () => void;
  style?: any;
}

// Helper functions
const getTransactionColor = (type: string): string => {
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

const getTransactionIcon = (type: string): any => {
  switch (type) {
    case 'income': return 'arrow-down';
    case 'expense': return 'arrow-up';
    case 'transfer': return 'swap-horizontal';
    default: return 'arrow-down';
  }
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading,
  onSeeAll,
  style
}) => {
  return (
    <View style={[styles.transactionsSection, style]}>
      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Text style={styles.seeAllText} onPress={onSeeAll}>See all</Text>
      </View>
      {loading ? (
        <RecentTransactionsSkeleton count={3} />
      ) : (
        <Card style={styles.transactionsCard}>
          <Card.Content style={styles.transactionsCardContent}>
            {transactions.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No transactions yet</Text>
              </View>
            ) : (
              transactions.map((transaction, index) => (
                <View key={transaction.id}>
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon,
                        { backgroundColor: getTransactionColor(transaction.type) }
                      ]}>
                        <Ionicons
                          name={getTransactionIcon(transaction.type) as any}
                          size={16}
                          color="white"
                        />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionName} numberOfLines={1} ellipsizeMode="tail">{transaction.name || transaction.title}</Text>
                        <Text style={styles.transactionDate}>{transaction.formatted_date}</Text>
                      </View>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text style={[
                        styles.transactionAmount,
                        { color: getTransactionColor(transaction.type) }
                      ]}>
                        {transaction.formatted_amount}
                      </Text>
                    </View>
                  </View>
                  {index < transactions.length - 1 && (
                    <Divider style={styles.transactionDivider} />
                  )}
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
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
  transactionsCardContent: {
    paddingVertical: 8,
  },
  emptyCard: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    maxWidth: '60%',
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionDivider: {
    marginVertical: 0,
  },
});

export default RecentTransactions;
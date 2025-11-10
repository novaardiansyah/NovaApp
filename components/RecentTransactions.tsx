import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import RecentTransactionsSkeleton from './RecentTransactionsSkeleton';
import EmptyTransactionsCard from './EmptyTransactionsCard';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactionColor, getTransactionIcon } from '@/utils/transactionUtils';
import transactionService from '@/services/transactionService';

interface RecentTransactionsProps {
  limit?: number;
  onSeeAll?: () => void;
  style?: any;
  refreshTrigger?: boolean | number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  limit = 5,
  onSeeAll,
  style,
  refreshTrigger
}) => {
  const { token, validateToken, logout } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [lastRefreshTrigger, setLastRefreshTrigger] = useState<boolean | number | undefined>(undefined);

  const validateSession = async (): Promise<boolean> => {
    if (!token || hasValidated) return false;

    try {
      const isValid = await validateToken();
      setHasValidated(true);

      if (!isValid) {
        await logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      setHasValidated(true);
      return false;
    }
  };

  const loadTransactions = async () => {
    if (!token) return;

    try {
      const isValid = await validateSession();
      if (!isValid) {
        setLoading(false);
        return;
      }

      if (!isRefreshing) {
        setLoading(true);
      }

      const data = await transactionService.getRecentTransactions(token, limit);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      setTransactions([]);
    } finally {
      if (!isRefreshing) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    if (!token) return;

    setIsRefreshing(true);
    setLoading(true);

    try {
      const data = await transactionService.getRecentTransactions(token, limit);
      setTransactions(data);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
      setTransactions([]);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadTransactions();
    }
  }, [limit, token]);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger !== false) {
      if (refreshTrigger !== lastRefreshTrigger) {
        setLastRefreshTrigger(refreshTrigger);
        handleRefresh();
      }
    }
  }, [refreshTrigger, lastRefreshTrigger]);

  return (
    <View style={[styles.transactionsSection, style]}>
      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
        {onSeeAll && (
          <Text style={styles.seeAllText} onPress={onSeeAll}>Lihat semua</Text>
        )}
      </View>
      {loading || isRefreshing ? (
        <RecentTransactionsSkeleton count={4} />
      ) : (
        <Card style={styles.transactionsCard}>
          <Card.Content style={styles.transactionsCardContent}>
            {transactions.length === 0 ? (
              <EmptyTransactionsCard withoutCard={true} style={styles.emptyCardContent} />
            ) : (
              transactions.map((transaction, index) => (
                <View key={transaction.id}>
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon,
                        { backgroundColor: getTransactionColor(transaction.type_id) }
                      ]}>
                        <Ionicons
                          name={getTransactionIcon(transaction.type_id) as any}
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
                      <View style={styles.transactionAmountContainer}>
                        <Text style={[
                          styles.transactionAmount,
                          { color: getTransactionColor(transaction.type_id) }
                        ]}>
                          {transaction.formatted_amount}
                        </Text>
                        {transaction.has_items && (
                          <Ionicons
                            name="list-outline"
                            size={14}
                            color="#6b7280"
                            style={styles.transactionItemsIcon}
                          />
                        )}
                      </View>
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
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionItemsIcon: {
    marginTop: 2,
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
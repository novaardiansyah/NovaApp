import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { AllTransactionsSkeleton } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { styles } from '@/styles/AllTransactionsScreen.styles';
import APP_CONFIG from '@/config/app';

interface Transaction {
  id: number;
  code: string;
  name: string;
  date: string;
  formatted_date: string;
  amount: number;
  formatted_amount: string;
  type: 'income' | 'expense';
  type_id: number;
  updated_at: string;
}

interface Pagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data: Transaction[];
  pagination: Pagination;
}

interface AllTransactionsScreenProps {
  navigation: any;
}

const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async (page: number = 1) => {
    if (!isAuthenticated || loading || loadingMore) return;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments?page=${page}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        if (page === 1) {
          setTransactions(data.data);
        } else {
          setTransactions(prev => [...prev, ...data.data]);
        }
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTransactions([]); // Clear transactions to show skeleton
    setLoading(true); // Set loading to show skeleton
    await fetchTransactions(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page && !loading && !loadingMore) {
      fetchTransactions(currentPage + 1);
    }
  };

  const getTransactionColor = (type: string) => {
    return type === 'income' ? '#10b981' : '#ef4444';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'income' ? 'arrow-down' : 'arrow-up';
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Text style={commonStyles.authText}>Please login first</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {/* Header */}
          <View style={commonStyles.header}>
            <Ionicons name="receipt" size={24} color="#6366f1" style={commonStyles.headerIcon} />
            <Text style={commonStyles.headerTitle}>All Transactions</Text>
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsSection}>
            {loading || (refreshing && transactions.length === 0) ? (
              <AllTransactionsSkeleton count={10} />
            ) : (
              <View style={styles.transactionsList}>
                {transactions.length === 0 ? (
                  <Card style={styles.emptyCard}>
                    <Card.Content style={styles.emptyCardContent}>
                      <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
                      <Text style={styles.emptyText}>No transactions yet</Text>
                      <Text style={styles.emptySubtext}>Your transactions will appear here</Text>
                    </Card.Content>
                  </Card>
                ) : (
                  transactions.map((transaction, index) => (
                    <View key={transaction.id}>
                      <Card
                        style={[
                          commonStyles.card,
                          styles.transactionCard
                        ]}
                      >
                        <Card.Content style={styles.transactionContent}>
                        <View style={styles.transactionLeft}>
                          <View style={[
                            styles.transactionIcon,
                            { backgroundColor: getTransactionColor(transaction.type) }
                          ]}>
                            <Ionicons
                              name={getTransactionIcon(transaction.type)}
                              size={16}
                              color="white"
                            />
                          </View>
                          <View style={styles.transactionInfo}>
                            <Text style={styles.transactionTitle} numberOfLines={1} ellipsizeMode="tail">
                              {transaction.name}
                            </Text>
                            <Text style={styles.transactionDate}>
                              {transaction.formatted_date}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.transactionRight}>
                          <Text style={[
                            styles.transactionAmount,
                            { color: getTransactionColor(transaction.type) }
                          ]}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {transaction.formatted_amount}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                    {index < transactions.length - 1 && (
                      <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />
                    )}
                    </View>
                  ))
                )}
              </View>
            )}

            {loadingMore && (
              <View style={styles.loadingMoreContent}>
                <ActivityIndicator size={30} color="#9ca3af" />
              </View>
            )}

            {/* End of List */}
            { pagination && currentPage >= pagination.last_page && transactions.length > 0 ? (
                <View style={styles.endOfList}>
                  <Text style={styles.endOfListText}>
                    Showing {transactions.length} of {pagination.total} transactions
                  </Text>
                </View>
              ) : loadingMore ? (
                <></>
              ) : (
                <View style={styles.endOfList}>
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={handleLoadMore}
                  >
                    <Ionicons name="add" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default AllTransactionsScreen;
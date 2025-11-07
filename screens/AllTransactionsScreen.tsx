import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, ActivityIndicator, StatusBar, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, FAB, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { Notification } from '@/components';
import { TransactionsSkeleton } from '@/components';
import TransactionFilter, { FilterOptions } from '@/components/TransactionFilter';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { styles } from '@/styles/AllTransactionsScreen.styles';
import { getTransactionColor, getTransactionIcon, getTransactionType } from '@/utils/transactionUtils';
import transactionService from '@/services/transactionService';
import paymentService from '@/services/paymentService';

type Transaction = import('@/services/transactionService').Transaction;

type Pagination = import('@/services/transactionService').Pagination;

type ApiResponse = import('@/services/transactionService').TransactionsResponse;

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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [pressedCardId, setPressedCardId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    transactionType: null,
    accountId: null,
  });

  const fetchTransactions = async (page: number = 1) => {
    if (!isAuthenticated || loading || loadingMore || !token) return;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data: ApiResponse = await transactionService.getAllTransactions(token, page);

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
    setTransactions([]);
    setLoading(true);
    await fetchTransactions(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page && !loading && !loadingMore) {
      const hasActiveFilters = !!(activeFilters.dateFrom || activeFilters.dateTo || activeFilters.transactionType || activeFilters.accountId);
      if (hasActiveFilters) {
        fetchTransactionsWithFilters(currentPage + 1, activeFilters);
      } else {
        fetchTransactions(currentPage + 1);
      }
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setActionSheetVisible(true);
  };

  const handleActionSelect = (action: string) => {
    if (!selectedTransaction) return;

    setActionSheetVisible(false);

    switch (action) {
      case 'view_items':
        navigation.navigate('ViewPaymentItems', {
          paymentId: selectedTransaction.id,
          refresh: new Date().getTime()
        });
        break;
      // 'add_items' case removed - feature moved to ViewItemsScreen
      case 'view_details':
        navigation.navigate('ViewPaymentDetails', {
          paymentId: selectedTransaction.id
        });
        break;
      // 'edit_payment' case removed - feature not implemented yet
      case 'delete_payment':
        handleDeletePayment(selectedTransaction);
        break;
      case 'view_attachment':
        navigation.navigate('CurrentAttachments', {
          paymentId: selectedTransaction.id
        });
        break;
    }
  };

  const handleDeletePayment = (transaction: Transaction) => {
    if (!token) return;

    Alert.alert(
      'Hapus Pembayaran',
      `Apakah Anda yakin ingin menghapus "${transaction.name}"? Tindakan ini tidak dapat dibatalkan.`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => confirmDeletePayment(transaction.id),
        },
      ]
    );
  };

  const confirmDeletePayment = async (paymentId: number) => {
    if (!token) return;

    setDeleting(true);
    try {
      const response = await paymentService.deletePayment(token, paymentId);

      if (response.success) {
        setTransactions(prev => prev.filter(t => t.id !== paymentId));

        setPagination((prev: Pagination | null) => prev ? {
          ...prev,
          total: prev.total - 1,
          to: Math.max(0, prev.to - 1)
        } : null);

        setNotification('Pembayaran berhasil dihapus!');
      } else {
        Alert.alert(
          'Kesalahan',
          response.message || 'Gagal menghapus pembayaran. Silakan coba lagi.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      Alert.alert(
        'Kesalahan',
        'Gagal menghapus pembayaran. Silakan periksa koneksi Anda dan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setDeleting(false);
    }
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const handleApplyFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setTransactions([]);
    setCurrentPage(1);
    fetchTransactionsWithFilters(1, filters);
  };

  const handleResetFilter = () => {
    const emptyFilters: FilterOptions = {
      dateFrom: null,
      dateTo: null,
      transactionType: null,
      accountId: null,
    };
    setActiveFilters(emptyFilters);
    setTransactions([]);
    setCurrentPage(1);
    fetchTransactionsWithFilters(1, emptyFilters);
  };

  const fetchTransactionsWithFilters = async (page: number = 1, filters: FilterOptions) => {
    if (!isAuthenticated || loading || loadingMore || !token) return;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const queryParams: any = { page };

      if (filters.dateFrom) queryParams.date_from = filters.dateFrom;
      if (filters.dateTo) queryParams.date_to = filters.dateTo;
      if (filters.transactionType) queryParams.type = filters.transactionType;
      if (filters.accountId) queryParams.account_id = filters.accountId;

      const data: ApiResponse = await transactionService.getAllTransactions(token, page, queryParams);

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
      console.error('Error fetching transactions with filters:', error);
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
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
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="receipt" size={24} color="#6366f1" style={{ marginRight: 12 }} />
              <Text style={commonStyles.headerTitle}>Transaksi</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: (activeFilters.dateFrom || activeFilters.dateTo || activeFilters.transactionType || activeFilters.accountId) ? '#f59e0b' : '#f3f4f6',
                  shadowColor: (activeFilters.dateFrom || activeFilters.dateTo || activeFilters.transactionType || activeFilters.accountId) ? '#f59e0b' : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: (activeFilters.dateFrom || activeFilters.dateTo || activeFilters.transactionType || activeFilters.accountId) ? 0.2 : 0,
                  shadowRadius: 4,
                  elevation: (activeFilters.dateFrom || activeFilters.dateTo || activeFilters.transactionType || activeFilters.accountId) ? 3 : 0
                }}
                onPress={() => setFilterVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="filter"
                  size={18}
                  color={(activeFilters.dateFrom || activeFilters.dateTo || activeFilters.transactionType || activeFilters.accountId) ? '#ffffff' : '#6b7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  shadowColor: 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0,
                  shadowRadius: 4,
                  elevation: 0
                }}
                onPress={() => navigation.navigate('Reports')}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.transactionsSection}>
            {loading || (refreshing && transactions.length === 0) ? (
              <TransactionsSkeleton count={10} />
            ) : (
              <View style={styles.transactionsList}>
                {transactions.length === 0 ? (
                  <Card style={styles.emptyCard}>
                    <Card.Content style={styles.emptyCardContent}>
                      <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
                      <Text style={styles.emptyText}>Belum ada transaksi</Text>
                      <Text style={styles.emptySubtext}>Transaksi Anda akan muncul di sini</Text>
                    </Card.Content>
                  </Card>
                ) : (
                  <Card style={styles.transactionsCard}>
                    <Card.Content style={styles.transactionsCardContent}>
                      {transactions.map((transaction, index) => {
                        const transactionType = getTransactionType(transaction);
                        return (
                          <View key={transaction.id}>
                            <Pressable
                              onPress={() => handleTransactionPress(transaction)}
                              onPressIn={() => setPressedCardId(transaction.id)}
                              onPressOut={() => setPressedCardId(null)}
                              style={pressedCardId === transaction.id && styles.transactionCardPressed}
                            >
                              <View style={styles.transactionItem}>
                                <View style={styles.transactionLeft}>
                                  <View style={[
                                    styles.transactionIcon,
                                    { backgroundColor: getTransactionColor(transactionType) }
                                  ]}>
                                    <Ionicons
                                      name={getTransactionIcon(transactionType) as any}
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
                                  <View style={styles.transactionAmountContainer}>
                                    <Text style={[
                                      styles.transactionAmount,
                                      { color: getTransactionColor(transactionType) }
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
                            </Pressable>
                            {index < transactions.length - 1 && (
                              <Divider style={styles.transactionDivider} />
                            )}
                          </View>
                        );
                      })}
                    </Card.Content>
                  </Card>
                )}
              </View>
            )}

            {loadingMore && (
              <View style={styles.loadingMoreContent}>
                <ActivityIndicator size={30} color="#6366f1" />
              </View>
            )}

              { pagination && currentPage >= pagination.last_page && transactions.length > 0 ? (
                <View style={styles.endOfList}>
                  <Text style={styles.endOfListText}>
                    Menampilkan {transactions.length} dari {pagination.total} transaksi
                  </Text>
                </View>
              ) : loadingMore ? (
                <></>
              ) : transactions.length > 0 && pagination && currentPage < pagination.last_page ? (
                <View style={styles.endOfList}>
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={handleLoadMore}
                  >
                    <Ionicons name="chevron-down" size={16} color="#6366f1" />
                  </TouchableOpacity>
                </View>
              ) : null
            }
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeActionSheet}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeActionSheet}
          />

          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 }}>
            <Text style={{ textAlign: 'center', padding: 16, color: '#6b7280', fontSize: 13 }}>
              Aksi Pembayaran
            </Text>

            <View style={{ paddingHorizontal: 20 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#f9fafb', marginBottom: 8 }}
                onPress={() => handleActionSelect('view_details')}
              >
                <Ionicons name="eye-outline" size={24} color="#6366f1" style={{ marginRight: 16 }} />
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>Lihat Detail</Text>
              </TouchableOpacity>

              {/* Edit payment button removed - feature not implemented yet */}

              {selectedTransaction?.has_items && (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#f9fafb', marginBottom: 8 }}
                  onPress={() => handleActionSelect('view_items')}
                >
                  <Ionicons name="list-outline" size={24} color="#f59e0b" style={{ marginRight: 16 }} />
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>Lihat Item</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#f0f9ff', marginBottom: 8 }}
                onPress={() => handleActionSelect('view_attachment')}
              >
                <Ionicons name="attach-outline" size={24} color="#3b82f6" style={{ marginRight: 16 }} />
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>Lihat Lampiran</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#fef2f2', marginBottom: 8 }}
                onPress={() => handleActionSelect('delete_payment')}
              >
                <Ionicons name="trash-outline" size={24} color="#ef4444" style={{ marginRight: 16 }} />
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#ef4444' }}>Hapus Pembayaran</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginHorizontal: 20, marginTop: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#6366f1', alignItems: 'center' }}
              onPress={closeActionSheet}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#6366f1' }}>Batal</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <FAB
          icon="plus"
          color="#ffffff"
          style={[styles.fab, {
            bottom: -6
          }]}
          onPress={() => navigation.navigate('AddPayment')}
        />

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
        }}
        type="success"
        duration={2000}
      />

      <TransactionFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
        currentFilters={activeFilters}
      />
    </PaperProvider>
  );
};

export default AllTransactionsScreen;
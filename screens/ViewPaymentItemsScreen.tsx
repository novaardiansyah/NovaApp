import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Button, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { commonStyles, formatCurrency, getScrollContainerStyle } from '@/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentItemsSkeleton, PaymentSummarySkeleton } from '@/components/Skeleton';
import paymentService from '@/services/paymentService';

interface PaymentItem {
  id: number;
  name: string;
  type_id: number;
  type: string;
  code: string;
  price: number;
  quantity: number;
  total: number;
  formatted_price: string;
  formatted_total: string;
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

interface PaymentSummary {
  payment_id: number;
  payment_code: string;
  total_items: number;
  total_qty: number;
  total_amount: number;
  formatted_amount: string;
}

interface ViewPaymentItemsScreenProps {
  navigation: any;
  route?: any;
}

const ViewPaymentItemsScreen: React.FC<ViewPaymentItemsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const { paymentId, paymentTitle } = route?.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPaymentItems = async (page: number = 1) => {
    if (!isAuthenticated || !token || !paymentId) return;

    if (page === 1) {
      setLoadingItems(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await paymentService.getPaymentItems(token, paymentId, page);

      if (response.success) {
        if (page === 1) {
          setPaymentItems(response.data);
        } else {
          setPaymentItems(prev => [...prev, ...response.data]);
        }
        setPagination(response.pagination);
        setCurrentPage(page);
      } else {
        Alert.alert('Error', 'Failed to fetch payment items');
      }
    } catch (error) {
      console.error('Error fetching payment items:', error);
      Alert.alert('Error', 'Failed to fetch payment items. Please try again.');
    } finally {
      if (page === 1) {
        setLoadingItems(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const fetchPaymentSummary = async () => {
    if (!isAuthenticated || !token || !paymentId) return;

    setLoadingSummary(true);
    try {
      const response = await paymentService.getPaymentItemsSummary(token, paymentId);

      if (response.success) {
        setPaymentSummary(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch payment summary');
      }
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      Alert.alert('Error', 'Failed to fetch payment summary. Please try again.');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && paymentId) {
      const loadInitialData = async () => {
        try {
          await Promise.all([fetchPaymentSummary(), fetchPaymentItems(1)]);
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      };

      loadInitialData();
    }
  }, [isAuthenticated, paymentId]);

  // Sync overall loading state with individual loading states
  useEffect(() => {
    setLoading(loadingSummary || loadingItems);
  }, [loadingSummary, loadingItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchPaymentSummary(), fetchPaymentItems(1)]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page && !loadingItems && !loadingMore) {
      fetchPaymentItems(currentPage + 1);
    }
  };

  const handleItemPress = (item: PaymentItem) => {
    setSelectedItem(item);
    setActionSheetVisible(true);
  };

  const handleActionSelect = (action: string) => {
    if (!selectedItem) return;

    setActionSheetVisible(false);

    switch (action) {
      case 'edit_item':
        Alert.alert('Edit Item', `Edit ${selectedItem.name} feature coming soon!`);
        break;
      case 'delete_item':
        Alert.alert(
          'Delete Item',
          `Are you sure you want to delete ${selectedItem.name}?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                // Remove item from list
                setPaymentItems(prev => prev.filter(i => i.id !== selectedItem.id));
                Alert.alert('Success', 'Item deleted successfully');
              },
              style: 'destructive',
            },
          ]
        );
        break;
    }
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };

  const getTotalAmount = () => {
    return paymentSummary ? paymentSummary.total_amount : 0;
  };

  const getItemsCount = () => {
    return paymentSummary ? paymentSummary.total_qty : 0;
  };

  const getUniqueItemsCount = () => {
    return paymentSummary ? paymentSummary.total_items : 0;
  };

  const getTypeColor = (type: string) => {
    return type === 'Product' ? '#10b981' : '#3b82f6';
  };

  const getTypeIcon = (type: string) => {
    return type === 'Product' ? 'cube-outline' : 'briefcase-outline';
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="receipt-outline" size={20} color="#6366f1" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Payment Items</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {refreshing || loadingSummary ? '...' : paymentSummary?.payment_code || ''}
          </Text>
        </View>

        {/* Items List */}
        <ScrollView
          contentContainerStyle={[getScrollContainerStyle(insets), { paddingTop: 0 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={styles.itemsSection}>
            {/* Summary Card */}
            {loading || refreshing ? (
              <PaymentSummarySkeleton />
            ) : paymentSummary ? (
              <Card style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryTitle}>{getUniqueItemsCount()} Items</Text>
                    <Text style={styles.summarySubtitle}>{getItemsCount()} Total Quantity</Text>
                  </View>
                  <View style={styles.summaryRight}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalAmount}>
                      {paymentSummary.formatted_amount || formatCurrency(getTotalAmount())}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ) : null}
            {loading || refreshing ? (
              <PaymentItemsSkeleton count={5} />
            ) : paymentItems.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyCardContent}>
                  <Ionicons name="cube-outline" size={48} color="#d1d5db" />
                  <Text style={styles.emptyText}>No items found</Text>
                  <Text style={styles.emptySubtext}>Add items to this payment</Text>
                </Card.Content>
              </Card>
            ) : (
              <Card style={styles.itemsCard}>
                <Card.Content style={styles.itemsCardContent}>
                  {paymentItems.map((item, index) => (
                    <View key={item.id}>
                      <TouchableOpacity
                        onPress={() => handleItemPress(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.itemContainer}>
                          <View style={styles.itemLeft}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.itemMeta}>
                              <View style={[
                                styles.itemType,
                                item.type === 'Product' ? styles.itemTypeProduct : styles.itemTypeService
                              ]}>
                                <Text style={[
                                  styles.itemTypeText,
                                  item.type === 'Product' ? styles.itemTypeTextProduct : styles.itemTypeTextService
                                ]}>
                                  {item.type}
                                </Text>
                              </View>
                              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                            </View>
                          </View>
                          <View style={styles.itemRight}>
                            <Text style={styles.itemTotal}>{item.formatted_total}</Text>
                            <Text style={styles.itemPrice}>{item.formatted_price}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {index < paymentItems.length - 1 && (
                        <View style={styles.itemDivider} />
                      )}
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}

            {loadingMore && (
              <View style={styles.loadingMoreContent}>
                <ActivityIndicator size={30} color="#6366f1" />
              </View>
            )}

            {pagination && currentPage >= pagination.last_page && paymentItems.length > 0 ? (
              <View style={styles.endOfList}>
                <Text style={styles.endOfListText}>
                  Showing {paymentItems.length} of {pagination.total} items
                </Text>
              </View>
            ) : loadingMore ? (
              <></>
            ) : paymentItems.length > 0 && pagination && currentPage < pagination.last_page ? (
              <View style={styles.endOfList}>
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                >
                  <Ionicons name="chevron-down" size={16} color="#6366f1" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <FAB
          icon="plus"
          color="#ffffff"
          style={[styles.fab, {
            bottom: -6
          }]}
          onPress={() => navigation.navigate('AddPaymentItem', { paymentId })}
        />

        {/* Action Sheet Modal */}
        <Modal
          visible={actionSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={closeActionSheet}
        >
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeActionSheet}
            />

            <View style={styles.actionSheet}>
              <Text style={styles.actionSheetTitle}>Item Actions</Text>

              <View style={styles.actionSheetContent}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleActionSelect('edit_item')}
                >
                  <Ionicons name="create-outline" size={24} color="#10b981" style={styles.actionIcon} />
                  <Text style={styles.actionText}>Edit Item</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleActionSelect('delete_item')}
                >
                  <Ionicons name="trash-outline" size={24} color="#ef4444" style={styles.actionIcon} />
                  <Text style={styles.actionText}>Delete Item</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{ marginHorizontal: 20, marginTop: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#6366f1', alignItems: 'center' }}
                onPress={closeActionSheet}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#6366f1' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerIcon: {
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 16,
  },

  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  summaryLeft: {
    flex: 1,
  },

  summaryRight: {
    alignItems: 'flex-end',
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },

  summarySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  summaryTotalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },

  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
  },

  summaryCode: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    marginTop: 2,
  },

  itemsSection: {
    gap: 12,
  },

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  emptyButton: {
    marginTop: 16,
    borderRadius: 8,
  },

  itemsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },

  itemsCardContent: {
    paddingVertical: 8,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  itemLeft: {
    flex: 1,
    marginRight: 12,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },

  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  itemQuantity: {
    fontSize: 11,
    color: '#6b7280',
  },

  itemRight: {
    alignItems: 'flex-end',
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },

  itemPrice: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },

  itemType: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },

  itemTypeText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  itemTypeProduct: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },

  itemTypeTextProduct: {
    color: '#166534',
  },

  itemTypeService: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },

  itemTypeTextService: {
    color: '#1e40af',
  },

  itemDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 0,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalOverlay: {
    flex: 1,
  },

  actionSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },

  actionSheetTitle: {
    textAlign: 'center',
    padding: 16,
    color: '#6b7280',
    fontSize: 13,
  },

  actionSheetContent: {
    paddingHorizontal: 20,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },

  actionIcon: {
    marginRight: 16,
  },

  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },

  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },

  loadingMoreContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  endOfList: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  endOfListText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },

  loadMoreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  });

export default ViewPaymentItemsScreen;
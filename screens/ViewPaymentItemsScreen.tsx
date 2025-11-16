import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { commonStyles, formatCurrency, getScrollContainerStyle } from '@/styles';
import { paymentItemsStyles as styles } from '@/styles/ViewPaymentItemsStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentItemsSkeleton, PaymentSummarySkeleton, Notification } from '@/components';
import paymentService, { PaymentItemsSummary, PaymentItem, Pagination, DeleteItemResponse } from '@/services/paymentService';
import EmptyPaymentItemCard from '@/components/EmptyPaymentItemCard';

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
  const { paymentId } = route?.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
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
        Alert.alert('Error', 'Gagal mengambil item pembayaran');
      }
    } catch (error) {
      console.error('Error fetching payment items:', error);
      Alert.alert('Error', 'Gagal mengambil item pembayaran. Silakan coba lagi.');
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
        Alert.alert('Error', response.message || 'Gagal mengambil ringkasan pembayaran');
      }
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      Alert.alert('Error', 'Gagal mengambil ringkasan pembayaran. Silakan coba lagi.');
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
      Alert.alert('Error', 'Gagal memperbarui data. Silakan coba lagi.');
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
        navigation.navigate('EditPaymentItem', {
          paymentId,
          item: selectedItem
        });
        break;
      case 'delete_item':
        Alert.alert(
          'Hapus Item',
          `Apakah Anda yakin ingin menghapus ${selectedItem.name}?`,
          [
            {
              text: 'Batal',
              style: 'cancel',
            },
            {
              text: 'Hapus',
              onPress: () => handleDeleteItem(selectedItem),
              style: 'destructive',
            },
          ]
        );
        break;
    }
  };

  const handleDeleteItem = async (item: PaymentItem) => {
    if (!token || !item.id || !paymentSummary) {
      Alert.alert('Error', 'Gagal menghapus item. Data tidak lengkap.');
      return;
    }

    try {
      const response = await paymentService.deleteItem(token, paymentId, item.id);

      if (response.success) {
        setPaymentItems(prev => prev.filter(i => i.id !== item.id));

        setPaymentSummary(prev => prev ? {
          ...prev,
          total_items: prev.total_items - 1,
          total_qty: prev.total_qty - item.quantity,
          total_amount: prev.total_amount - response.data.amount,
          formatted_amount: response.data.formatted_amount,
        } : null);

        setNotification(`Item pembayaran berhasil dihapus.`);
      } else {
        Alert.alert('Error', response.message || 'Gagal menghapus item.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Gagal menghapus item. Silakan coba lagi.');
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
            <Text style={styles.headerTitle}>Item Pembayaran</Text>
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
                    <Text style={styles.summaryTitle}>{getUniqueItemsCount()} Item</Text>
                    <Text style={styles.summarySubtitle}>{getItemsCount()} Jumlah Total</Text>
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
              <PaymentItemsSkeleton count={3} />
            ) : paymentItems.length === 0 ? (
              <EmptyPaymentItemCard />
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
                                  {item.type === 'Product' ? 'Produk' : 'Layanan'}
                                </Text>
                              </View>
                              <Text style={styles.itemQuantity}>Jml: {item.quantity}</Text>
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
                  Menampilkan {paymentItems.length} dari {pagination.total} item
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
              <Text style={styles.actionSheetTitle}>Aksi Item</Text>

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
                  <Text style={styles.actionText}>Hapus Item</Text>
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

        <Notification
          visible={!!notification}
          message={notification || ''}
          type="success"
          onDismiss={() => setNotification(null)}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ViewPaymentItemsScreen;
import React, { useState } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Button, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { commonStyles, formatCurrency } from '@/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PaymentItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: 'Product' | 'Service';
  notes?: string;
}

interface ViewPaymentItemsScreenProps {
  navigation: any;
  route?: any;
}

const ViewPaymentItemsScreen: React.FC<ViewPaymentItemsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { paymentId, paymentTitle } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  // Dummy data untuk payment items
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([
    {
      id: '1',
      name: 'Laptop ASUS ROG',
      quantity: 1,
      price: 15000000,
      type: 'Product',
      notes: 'Gaming laptop with RGB keyboard'
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      quantity: 2,
      price: 350000,
      type: 'Product',
      notes: 'Bluetooth gaming mouse'
    },
    {
      id: '3',
      name: 'Website Development',
      quantity: 1,
      price: 5000000,
      type: 'Service',
      notes: 'Custom website development service'
    },
    {
      id: '4',
      name: 'SEO Optimization',
      quantity: 1,
      price: 2500000,
      type: 'Service',
    }
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulasi loading data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
    return paymentItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemsCount = () => {
    return paymentItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTypeColor = (type: 'Product' | 'Service') => {
    return type === 'Product' ? '#10b981' : '#3b82f6';
  };

  const getTypeIcon = (type: 'Product' | 'Service') => {
    return type === 'Product' ? 'cube-outline' : 'briefcase-outline';
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="receipt-outline" size={20} color="#6366f1" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Payment Items</Text>
          </View>
          <Text style={styles.headerSubtitle}>{paymentTitle || 'Payment Details'}</Text>
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryTitle}>{paymentItems.length} Items</Text>
              <Text style={styles.summarySubtitle}>{getItemsCount()} Total Quantity</Text>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalAmount}>{formatCurrency(getTotalAmount())}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Items List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.itemsSection}>
            {paymentItems.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyCardContent}>
                  <Ionicons name="cube-outline" size={48} color="#d1d5db" />
                  <Text style={styles.emptyText}>No items found</Text>
                  <Text style={styles.emptySubtext}>Add items to this payment</Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('AddPaymentItem', { paymentId })}
                    style={styles.emptyButton}
                    icon="plus"
                  >
                    Add First Item
                  </Button>
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
                            <Text style={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</Text>
                            <Text style={styles.itemPrice}>{formatCurrency(item.price)} each</Text>
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
          </View>
        </ScrollView>

        {paymentItems.length > 0 && (
          <FAB
            icon="plus"
            color="#ffffff"
            style={[styles.fab, {
              bottom: -6
            }]}
            onPress={() => navigation.navigate('AddPaymentItem', { paymentId })}
          />
        )}

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
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16,
    marginTop: 16,
  },

  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  summaryLeft: {
    flex: 1,
  },

  summaryRight: {
    alignItems: 'flex-end',
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  summarySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  summaryTotalLabel: {
    fontSize: 12,
    color: '#6b7280',
  },

  summaryTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginTop: 2,
  },

  itemsSection: {
    gap: 8,
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
    marginVertical: 16,
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

  });

export default ViewPaymentItemsScreen;
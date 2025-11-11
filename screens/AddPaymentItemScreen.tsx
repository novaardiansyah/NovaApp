import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, Platform, Alert, RefreshControl, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { FormButton, Notification, SearchResultsSkeleton } from '@/components';
import { commonStyles } from '@/styles';
import { styles } from '@/styles/AddPaymentItemScreen.styles';
import { useAuth } from '@/contexts/AuthContext';
import paymentService, { SearchItem, AttachMultipleItemsData } from '@/services/paymentService';
import { formatAmount } from '@/utils/transactionUtils';

interface PaymentItem {
  name: string;
  amount: string;
  qty: string;
  item_id?: number;
}

interface AddPaymentItemScreenProps {
  navigation?: any;
  route?: {
    params?: {
      paymentId?: number;
    };
  };
}

const AddPaymentItemScreen: React.FC<AddPaymentItemScreenProps> = ({ navigation, route }) => {
  const { paymentId } = route?.params || {};
  const { token } = useAuth();

  if (!token || !paymentId) return null;

  // No navigation listeners needed for this screen


  const [items, setItems] = useState<PaymentItem[]>([
    { name: '', amount: '', qty: '1' }
  ]);

  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState('0');
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Load initial items when modal opens
  useEffect(() => {
    if (showSearchModal && searchResults.length === 0 && !searchQuery) {
      loadInitialItems();
    }
  }, [showSearchModal]);

  const loadInitialItems = async () => {
    setSearchLoading(true);
    try {
      const results = await paymentService.getNotAttachedItems(token, paymentId, 10);
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
      console.error('Error loading initial items:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { name: '', amount: '', qty: '1' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      calculateTotal(newItems);
    }
  };

  const updateItem = (index: number, field: keyof PaymentItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);

    if (field === 'amount' || field === 'qty') {
      calculateTotal(newItems);
    }
  };

  const calculateTotal = (itemsList: PaymentItem[]) => {
    const total = itemsList.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      const qty = parseFloat(item.qty) || 1;
      return sum + (amount * qty);
    }, 0);
    setTotalAmount(total.toString());
  };

  const resetForm = useCallback(() => {
    setItems([{ name: '', amount: '', qty: '1' }]);
    setTotalAmount('0');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    resetForm();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Search functionality
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      Alert.alert('Validation Error', 'Please enter at least 2 characters to search');
      return;
    }

    setSearchLoading(true);
    try {
      const results = await paymentService.searchNotAttachedItems(token, paymentId, searchQuery, 10);
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
      Alert.alert('Search Error', 'Failed to search items. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchItemSelect = (item: SearchItem) => {
    // Check if item already exists in the form
    const existingItemIndex = items.findIndex(existingItem => existingItem.item_id === item.id);

    if (existingItemIndex !== -1) {
      Alert.alert(
        'Item Already Added',
        'This item has already been added to the form. Please adjust the quantity instead.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Update the first empty item or add new item
    const emptyItemIndex = items.findIndex(item => !item.name.trim());
    let newItems;

    if (emptyItemIndex !== -1) {
      newItems = [...items];
      newItems[emptyItemIndex] = {
        name: item.name,
        amount: item.amount.toString(),
        qty: '1',
        item_id: item.id
      };
    } else {
      newItems = [...items, {
        name: item.name,
        amount: item.amount.toString(),
        qty: '1',
        item_id: item.id
      }];
    }

    setItems(newItems);
    calculateTotal(newItems);
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadInitialItems(); // Reload initial items when clearing search
  };

  const validateItems = () => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name.trim()) {
        Alert.alert('Validation Error', `Item name is required for item ${i + 1}`);
        return false;
      }
      if (!item.amount || parseFloat(item.amount) <= 0) {
        Alert.alert('Validation Error', `Valid amount is required for item ${i + 1}`);
        return false;
      }
      if (!item.qty || parseFloat(item.qty) <= 0) {
        Alert.alert('Validation Error', `Valid quantity is required for item ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const savePaymentItems = async () => {
    if (!validateItems()) return;

    if (loading) return;

    setLoading(true);

    const formData: AttachMultipleItemsData = {
      items: items.map(item => ({
        name: item.name,
        amount: parseFloat(item.amount),
        qty: parseInt(item.qty),
        item_id: item.item_id || null
      })),
      totalAmount: parseFloat(totalAmount)
    };

    try {
      const response = await paymentService.attachMultipleItems(token, paymentId, formData);

      if (response.success) {
        setNotification('Payment items added successfully!');
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to save payment items',
          [{ text: 'OK' }]
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save payment items. Please try again.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="document-text-outline" size={24} color="#6366f1" style={styles.headerIcon} />
              <Text style={styles.headerTitle}>Tambah produk / layanan</Text>
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowSearchModal(true)}
            >
              <Ionicons name="search" size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#6366f1']}
                  tintColor="#6366f1"
                />
              }
            >
              <Text style={styles.description}>
                Anda dapat menambahkan beberapa produk / layanan sekaligus.
              </Text>

              {/* Items List */}
              <View style={styles.itemsSection}>
                {items.map((item, index) => (
                  <Card key={index} style={styles.itemCard}>
                    <Card.Content style={styles.itemContent}>
                      <View style={styles.itemHeader}>
                        <View style={styles.itemHeaderLeft}>
                          <Text style={styles.itemNumber}>Item {index + 1}</Text>
                          {item.item_id && (
                            <View style={styles.searchedIndicator}>
                              <Ionicons name="search" size={12} color="#6366f1" />
                              <Text style={styles.searchedText}>Searched</Text>
                            </View>
                          )}
                        </View>
                        {items.length > 1 && (
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#ef4444"
                            onPress={() => removeItem(index)}
                          />
                        )}
                      </View>

                      <TextInput
                        label="Nama produk / layanan"
                        value={item.name}
                        onChangeText={(value) => updateItem(index, 'name', value)}
                        mode="outlined"
                        style={styles.input}
                        outlineColor="#e5e7eb"
                        activeOutlineColor="#6366f1"
                      />

                      <TextInput
                        label={'Nominal (Rp' + (item.amount ? ` ${formatAmount(item.amount)}` : '') + ')'}
                        value={item.amount}
                        onChangeText={(value) => updateItem(index, 'amount', value)}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#e5e7eb"
                        activeOutlineColor="#6366f1"
                      />

                      <TextInput
                        label="Kuantitas"
                        value={item.qty}
                        onChangeText={(value) => updateItem(index, 'qty', value)}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        outlineColor="#e5e7eb"
                        activeOutlineColor="#6366f1"
                      />
                    </Card.Content>
                  </Card>
                ))}
              </View>

              {/* Add Item Button */}
              <Button
                mode="outlined"
                onPress={addItem}
                style={styles.addItemButton}
                icon={() => <Ionicons name="add" size={18} color="#6366f1" />}
                labelStyle={styles.addItemButtonText}
              >
                Tambah produk / layanan
              </Button>

              {/* Total Amount */}
              <Card style={styles.totalCard}>
                <Card.Content style={styles.totalContent}>
                  <Text style={styles.totalLabel}>Total Nominal</Text>
                  <Text style={styles.totalAmount}>Rp {parseFloat(totalAmount).toLocaleString('id-ID')}</Text>
                </Card.Content>
              </Card>

              {/* Save Button */}
              <FormButton
                title="Simpan"
                onPress={savePaymentItems}
                loading={loading}
                icon="cash-plus"
                style={styles.saveButton}
              />

              <FormButton
                title="Batal"
                onPress={() => {
                  navigation?.navigate('TransactionsMain', { refresh: Date.now() })
                }}
                variant="outline"
                style={styles.cancelButton}
                loading={loading}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowSearchModal(false);
          clearSearch();
        }}
      >
        <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
          <View style={styles.searchModalContainer}>
            {/* Search Header */}
            <View style={styles.searchModalHeader}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  placeholder="Search items..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  mode="outlined"
                  style={styles.searchInput}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                  dense
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowSearchModal(false);
                  clearSearch();
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Search Button */}
            {searchQuery.trim().length > 0 && (
              <View style={styles.searchButtonContainer}>
                <Button
                  mode="contained"
                  onPress={handleSearch}
                  loading={searchLoading}
                  disabled={searchLoading || searchQuery.trim().length < 2}
                  style={styles.searchActionButton}
                  buttonColor="#6366f1"
                  textColor="#ffffff"
                  icon={() => <Ionicons name="search" size={18} color="#ffffff" />}
                >
                  Search Items
                </Button>
              </View>
            )}

            {/* Search Results */}
            <ScrollView style={styles.searchResultsContainer}>
              {searchLoading ? (
                <SearchResultsSkeleton count={5} />
              ) : searchResults.length > 0 ? (
                <View>
                  {searchQuery.length > 0 && (
                    <View style={styles.searchResultsHeader}>
                      <Text style={styles.searchResultsText}>
                        {searchResults.length} item{searchResults.length !== 1 ? 's' : ''} found
                      </Text>
                    </View>
                  )}

                  <View style={{ marginTop: 16, paddingBottom: 50 }}>
                    {searchResults.map((item) => {
                      const isItemAdded = items.some(existingItem => existingItem.item_id === item.id);

                      return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.searchResultItem,
                          isItemAdded && styles.searchResultItemDisabled
                        ]}
                        onPress={() => handleSearchItemSelect(item)}
                        disabled={isItemAdded}
                      >
                        <View style={styles.searchResultContent}>
                          <Text style={styles.searchResultName}>{item.name}</Text>
                          <View style={styles.searchResultDetails}>
                            <Text style={styles.searchResultCode}>{item.code}</Text>
                            <Text style={styles.searchResultPrice}>{item.formatted_amount}</Text>
                          </View>
                          <View style={[styles.searchResultType, !item.code && styles.searchResultTypeNoSku]}>
                            <Text style={[styles.searchResultTypeText, !item.code && styles.searchResultTypeTextNoSku]}>
                              {item.type}
                            </Text>
                          </View>
                          {isItemAdded && (
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" style={styles.addedIcon} />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                    })}
                  </View>
                </View>
              ) : searchQuery.length > 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search" size={48} color="#d1d5db" />
                  <Text style={styles.emptyText}>No items found</Text>
                  <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search" size={48} color="#d1d5db" />
                  <Text style={styles.emptyText}>Available Items</Text>
                  <Text style={styles.emptySubtext}>No items available or search for specific items</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null)
          navigation?.navigate('TransactionsMain', { refresh: Date.now() })
        }}
        type="success"
      />
    </PaperProvider>
  );
};

export default AddPaymentItemScreen;
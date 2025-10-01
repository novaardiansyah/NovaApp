import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, Platform, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { FormButton } from '@/components';
import { commonStyles, statusBarConfig } from '@/styles';
import { styles } from '@/styles/AddPaymentItemScreen.styles';

interface PaymentItem {
  name: string;
  amount: string;
}

interface AddPaymentItemScreenProps {
  navigation: any;
  route: any;
}

const AddPaymentItemScreen: React.FC<AddPaymentItemScreenProps> = ({ navigation, route }) => {
  const { paymentId } = route.params;

  const [items, setItems] = useState<PaymentItem[]>([
    { name: '', amount: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState('0');
  const [refreshing, setRefreshing] = useState(false);

  const addItem = () => {
    setItems([...items, { name: '', amount: '' }]);
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

    if (field === 'amount') {
      calculateTotal(newItems);
    }
  };

  const calculateTotal = (itemsList: PaymentItem[]) => {
    const total = itemsList.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
    setTotalAmount(total.toString());
  };

  const resetForm = useCallback(() => {
    setItems([{ name: '', amount: '' }]);
    setTotalAmount('0');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    resetForm();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
    }
    return true;
  };

  const savePaymentItems = () => {
    if (!validateItems()) return;

    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Payment items saved successfully (UI Only)',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    }, 1500);
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="document-text-outline" size={24} color="#6366f1" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Add Payment Items</Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#6366f1']}
                  tintColor="#6366f1"
                />
              }
            >
              {/* Items List */}
              <View style={styles.itemsSection}>
                {items.map((item, index) => (
                  <Card key={index} style={styles.itemCard}>
                    <Card.Content style={styles.itemContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemNumber}>Item {index + 1}</Text>
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
                        label="Item Name"
                        value={item.name}
                        onChangeText={(value) => updateItem(index, 'name', value)}
                        mode="outlined"
                        style={styles.input}
                        outlineColor="#e5e7eb"
                        activeOutlineColor="#6366f1"
                      />

                      <TextInput
                        label="Amount"
                        value={item.amount}
                        onChangeText={(value) => updateItem(index, 'amount', value)}
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
                Add Item
              </Button>

              {/* Total Amount */}
              <Card style={styles.totalCard}>
                <Card.Content style={styles.totalContent}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>Rp {parseFloat(totalAmount).toLocaleString('id-ID')}</Text>
                </Card.Content>
              </Card>

              {/* Save Button */}
              <FormButton
                title="Save Payment Items"
                onPress={savePaymentItems}
                loading={loading}
                icon="cash-plus"
                style={styles.saveButton}
              />

              <FormButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.cancelButton}
                loading={loading}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default AddPaymentItemScreen;
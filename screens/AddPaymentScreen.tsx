import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';

// Register the locale
registerTranslation('en', enGB);

import { useAuth } from '@/contexts/AuthContext';
import APP_CONFIG from '@/config/app';
import { Theme } from '@/constants/colors';
import { FormButton, FormInput } from '@/components';

interface AddPaymentScreenProps {
  navigation: any;
}

const AddPaymentScreen: React.FC<AddPaymentScreenProps> = ({ navigation }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(true);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    typeId: '1',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    description: '',
  });

  useEffect(() => {
    loadPaymentTypes();
  }, []);

  const loadPaymentTypes = async () => {
    if (!token) {
      setLoadingPaymentTypes(false);
      return;
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payment-types`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentTypes(data.data);
        // Set default type ID based on expense type
        const defaultExpenseType = data.data.find((t: any) => t.type === 'expense');
        if (defaultExpenseType) {
          setFormData(prev => ({ ...prev, typeId: defaultExpenseType.id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error loading payment types:', error);
    } finally {
      setLoadingPaymentTypes(false);
    }
  };

  const validateForm = () => {
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentTypeChange = (typeId: string) => {
    const selectedType = paymentTypes.find(t => t.id.toString() === typeId);
    setFormData(prev => ({
      ...prev,
      typeId: typeId,
      type: selectedType?.type || 'expense'
    }));
    setMenuVisible(false);
  };

  const getSelectedPaymentTypeName = () => {
    const selectedType = paymentTypes.find(t => t.id.toString() === formData.typeId);
    return selectedType ? selectedType.name : 'Select payment type';
  };

  const handleDateConfirm = (params: any) => {
    // Format date locally to avoid timezone issues
    const year = params.date.getFullYear();
    const month = String(params.date.getMonth() + 1).padStart(2, '0');
    const day = String(params.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({ ...prev, date: formattedDate }));
    setDatePickerVisible(false);
  };

  const handleDateDismiss = () => {
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        name: formData.name.trim(),
        amount: Number(formData.amount),
        type: formData.type,
        type_id: parseInt(formData.typeId) || 1,
        date: formData.date,
        description: formData.description.trim() || undefined,
      };

      // ! DON'T UNCOMMENT THIS, NOT USED YET!
      // const success = await addPayment(paymentData);

      // if (success) {
      //   Alert.alert(
      //     'Success',
      //     'Payment added successfully!',
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => navigation.goBack(),
      //       },
      //     ]
      //   );
      // } else {
      //   Alert.alert('Error', 'Failed to add payment. Please try again.');
      // }
    } catch (error) {
      console.error('Error adding payment:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Add Payment" />
        </Appbar.Header>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.description}>
              Add a new payment record. Fill in the required information below.
            </Text>

            {/* Amount */}
            <FormInput
              label="Amount (IDR)"
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              error={''}
              leftIcon="currency-usd"
              numeric
              required
            />

            {/* Date */}
            <TouchableOpacity onPress={() => setDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Date *"
                value={formData.date}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                error={false}
                style={[styles.input, { marginBottom: 16 }]}
                editable={false}
                placeholder="Select date"
                left={<TextInput.Icon icon="calendar" />}
              />
            </TouchableOpacity>
  
            {loadingPaymentTypes ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setMenuVisible(!menuVisible)}
                  activeOpacity={0.7}
                >
                  <TextInput
                    label="Payment Type *"
                    value={getSelectedPaymentTypeName()}
                    onChangeText={() => {}}
                    mode="outlined"
                    outlineColor="#e5e7eb"
                    activeOutlineColor="#6366f1"
                    error={false}
                    style={[styles.input, { marginBottom: 16 }]}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                  />
                </TouchableOpacity>

                {menuVisible && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                      {paymentTypes.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          style={styles.dropdownItem}
                          onPress={() => handlePaymentTypeChange(type.id.toString())}
                        >
                          <Text style={styles.dropdownItemText}>
                            {type.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}

  
            {/* Description */}
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              multiline
              numberOfLines={4}
              style={[styles.input, { marginBottom: 16 }]}
              placeholder="Optional description..."
            />

            <FormButton
              title="Add Payment"
              onPress={handleSubmit}
              loading={loading}
              icon="cash-plus"
            />

            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  
      <DatePickerModal
          visible={datePickerVisible}
          onDismiss={handleDateDismiss}
          onConfirm={handleDateConfirm}
          date={formData.date ? new Date(formData.date) : new Date()}
          mode="single"
          saveLabel="Save"
          label="Select date"
          animationType="slide"
          presentationStyle="pageSheet"
          locale="en"
        />
      </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
    maxHeight: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
  },
  cancelButton: {
    marginTop: -10,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 4,
  },
});

export default AddPaymentScreen;
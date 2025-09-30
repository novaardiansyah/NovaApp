import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { PaperProvider, Appbar, TextInput, Button, HelperText } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';

registerTranslation('en', enGB);

import { useAuth } from '@/contexts/AuthContext';
import APP_CONFIG from '@/config/app';
import { Theme } from '@/constants/colors';
import { FormButton } from '@/components';

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
    type_id: '1',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({
    name: '',
    amount: '',
    type_id: '',
    date: '',
    payment_account_id: '',
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
        
        const defaultExpenseType = data.data.find((t: any) => t.type === 'expense');
        if (defaultExpenseType) {
          setFormData(prev => ({ ...prev, type_id: defaultExpenseType.id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error loading payment types:', error);
    } finally {
      setLoadingPaymentTypes(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };

  const handlePaymentTypeChange = (typeId: string) => {
    const selectedType = paymentTypes.find(t => t.id.toString() === typeId);
    setFormData(prev => ({
      ...prev,
      type_id: typeId,
      type: selectedType?.type || 'expense'
    }));
    if (errors.type_id) {
      setErrors(prev => ({ ...prev, type_id: '' }));
    }
    setMenuVisible(false);
  };

  const getSelectedPaymentTypeName = () => {
    const selectedType = paymentTypes.find(t => t.id.toString() === formData.type_id);
    return selectedType ? selectedType.name : 'Select payment type';
  };

  const handleDateConfirm = (params: any) => {
    const year          = params.date.getFullYear();
    const month         = String(params.date.getMonth() + 1).padStart(2, '0');
    const day           = String(params.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({ ...prev, date: formattedDate }));
    setDatePickerVisible(false);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleDateDismiss = () => {
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const paymentData = {
        name: formData.name.trim(),
        amount: Number(formData.amount),
        type: formData.type,
        type_id: parseInt(formData.type_id) || 1,
        date: formData.date,
        payment_account_id: 1,
        has_items: false,
        has_charge: false,
        is_scheduled: false,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          'Success',
          'Payment added successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        // Handle validation errors
        if (data.errors) {
          const newErrors = { ...errors };

          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
              newErrors[field as keyof typeof errors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', data.message || 'Failed to add payment. Please try again.');
        }
      }
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

            <TextInput
              label="Amount (IDR) *"
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              placeholder="Amount (IDR) *"
              left={<TextInput.Icon icon="currency-usd" />}
            />
            {errors.amount && <HelperText type="error" style={styles.helperText}>{errors.amount}</HelperText>}

            <TouchableOpacity onPress={() => setDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Date *"
                value={formData.date}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                editable={false}
                placeholder="Select date"
                left={<TextInput.Icon icon="calendar" />}
              />
            </TouchableOpacity>
            {errors.date && <HelperText type="error" style={styles.helperText}>{errors.date}</HelperText>}
  
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
                    style={styles.input}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                  />
                </TouchableOpacity>
                {errors.type_id && <HelperText type="error" style={styles.helperText}>{errors.type_id}</HelperText>}

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

            <TextInput
              label="Description *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              placeholder="Description *"
              multiline
              numberOfLines={4}
            />
            {errors.name && <HelperText type="error" style={styles.helperText}>{errors.name}</HelperText>}

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
    marginBottom: 16,
  },
  helperText: {
    marginTop: -14, 
    marginLeft: -6, 
    marginBottom: 14
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
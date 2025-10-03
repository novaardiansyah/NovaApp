import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { PaperProvider, Appbar, TextInput, HelperText, Switch, List } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';

registerTranslation('en', enGB);

import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton, Select, Notification } from '@/components';
import { styles } from '@/styles/AddPaymentScreen.styles';
import paymentService, { PaymentData } from '@/services/paymentService';

interface AddPaymentScreenProps {
  navigation: any;
}

const AddPaymentScreen: React.FC<AddPaymentScreenProps> = ({ navigation }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [optionsExpanded, setOptionsExpanded] = useState(false);

  // No navigation listeners needed for this screen
  
  const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(false);
  const [loadingPaymentAccounts, setLoadingPaymentAccounts] = useState(false);

  const [isTransferOrWidrawal, setIsTransferOrWithdrawal] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const initialFormData = {
    name: '',
    amount: '',
    type_id: '',
    date: new Date().toISOString().split('T')[0],
    payment_account_id: '',
    payment_account_to_id: '',
    has_items: false,
    has_charge: false,
    is_scheduled: false,
  };

  const initialErrors = {
    name: '',
    amount: '',
    type_id: '',
    date: '',
    payment_account_id: '',
    payment_account_to_id: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    loadPaymentTypes();
    loadPaymentAccounts();
  }, []);

  const loadPaymentTypes = async () => {
    setLoadingPaymentTypes(true);

    if (!token) {
      setLoadingPaymentTypes(false);
      return;
    }

    try {
      const types = await paymentService.getPaymentTypes(token);
      setPaymentTypes(types);

      if (types.length > 0) {
        const defaultType = types.find((type) => type.is_default) || types[0];
        const selected = defaultType.id.toString();

        setFormData(prev => ({ ...prev, type_id: selected }));
      }
    } catch (error) {
      console.error('Error loading payment types:', error);
    } finally {
      setLoadingPaymentTypes(false);
    }
  };

  const loadPaymentAccounts = async () => {
    setLoadingPaymentAccounts(true);

    if (!token) {
      setLoadingPaymentAccounts(false);
      return;
    }

    try {
      const accounts = await paymentService.getPaymentAccounts(token);
      setPaymentAccounts(accounts);

      if (accounts.length > 0) {
        const defaultAccount = accounts.find((account) => account.is_default) || accounts[0];
        const selected = defaultAccount.id.toString();

        setFormData(prev => ({ ...prev, payment_account_id: selected }));
      }
    } catch (error) {
      console.error('Error loading payment accounts:', error);
    } finally {
      setLoadingPaymentAccounts(false);
    }
  };

  const resetForm = () => {
    setLoading(false);
    setFormData({ ...initialFormData });
    setErrors({ ...initialErrors });
    setIsTransferOrWithdrawal(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      resetForm();
      
      await Promise.all([
        loadPaymentTypes(),
        loadPaymentAccounts()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
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

    if (typeId === '3' || typeId === '4') {
      setIsTransferOrWithdrawal(true);
    } else {
      setIsTransferOrWithdrawal(false);
    }
  };

  const handlePaymentAccountChange = (accountId: string) => {
    setFormData(prev => ({
      ...prev,
      payment_account_id: accountId
    }));
    if (errors.payment_account_id) {
      setErrors(prev => ({ ...prev, payment_account_id: '' }));
    }
  };

  const handlePaymentAccountToChange = (accountId: string) => {
    setFormData(prev => ({
      ...prev,
      payment_account_to_id: accountId
    }));
    if (errors.payment_account_to_id) {
      setErrors(prev => ({ ...prev, payment_account_to_id: '' }));
    }
  };

  const handleToggleChange = (field: 'has_items' | 'has_charge' | 'is_scheduled', value: boolean) => {
    if (field === 'has_items' && value) {
      setIsTransferOrWithdrawal(false)

      const defaultType = paymentTypes.find((type) => type.is_default) || paymentTypes[0];
      setFormData(prev => ({
        ...prev,
        [field]: value,
        amount: '',
        name: '',
        type_id: defaultType ? defaultType.id.toString() : prev.type_id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      let payment_account_to_id = isTransferOrWidrawal ? parseInt(formData.payment_account_to_id) : null;

      const paymentData: PaymentData = {
        name: formData.has_items ? '' : formData.name.trim(),
        amount: formData.has_items ? 0 : Number(formData.amount),
        type_id: parseInt(formData.type_id) || 1,
        date: formData.date,
        payment_account_id: parseInt(formData.payment_account_id) || 1,
        payment_account_to_id,
        has_items: formData.has_items,
        has_charge: formData.has_charge,
        is_scheduled: formData.is_scheduled,
      };

      const response = await paymentService.createPayment(token, paymentData);

      if (response.success) {
        setPaymentId(response.data.id)
        setNotification('Payment added successfully!')
      } else {
        setLoading(false);

        if (response.errors) {
          const newErrors = { ...errors };

          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
              newErrors[field as keyof typeof errors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', response.message || 'Failed to add payment. Please try again.');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error adding payment:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshData}
                colors={['#6366f1']}
                tintColor="#6366f1"
              />
            }
          >
            <Text style={styles.description}>
              Add a new payment record. Fill in the required information below.
            </Text>

            <TextInput
              label={'Amount (IDR)' + (formData.has_items ? '' : ' *')}
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              placeholder={'Amount (IDR)' + (formData.has_items ? '' : ' *')}
              keyboardType="numeric"
              editable={!formData.has_items}
            />
            {errors.amount && <HelperText type="error" style={styles.helperText}>{errors.amount}</HelperText>}

            <TextInput
              label={'Description' + (formData.has_items ? '' : ' *')}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              placeholder={'Description' + (formData.has_items ? '' : ' *')}
              multiline
              numberOfLines={4}
              editable={!formData.has_items}
            />
            {errors.name && <HelperText type="error" style={styles.helperText}>{errors.name}</HelperText>}
            
            <TouchableOpacity onPress={() => setDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Date *"
                value={formData.date}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                placeholder="Select date"
                editable={false}
              />
            </TouchableOpacity>
            {errors.date && <HelperText type="error" style={styles.helperText}>{errors.date}</HelperText>}

            <Select
              label="Category"
              value={formData.type_id}
              onValueChange={handlePaymentTypeChange}
              options={paymentTypes}
              loading={loadingPaymentTypes}
              error={errors.type_id}
              style={styles.input}
              errorStyle={styles.helperText}
              disabled={formData.has_items}
            />

            <Select
              label="Payment Account"
              value={formData.payment_account_id}
              onValueChange={handlePaymentAccountChange}
              options={paymentAccounts}
              loading={loadingPaymentAccounts}
              error={errors.payment_account_id}
              style={styles.input}
              errorStyle={styles.helperText}
            />

            <Select
              label="To Payment Account"
              value={formData.payment_account_to_id}
              onValueChange={handlePaymentAccountToChange}
              options={paymentAccounts}
              loading={loadingPaymentAccounts}
              error={errors.payment_account_to_id}
              style={styles.input}
              errorStyle={styles.helperText}
              visible={isTransferOrWidrawal}
            />

            {/* Collapsible Options Section */}
            <List.Accordion
              title="Payment Options"
              description="Additional payment settings"
              left={props => <List.Icon {...props} icon="tune" />}
              expanded={optionsExpanded}
              onPress={() => setOptionsExpanded(!optionsExpanded)}
              style={styles.accordion}
            >
              <List.Item
                title="Has Items"
                description="Include products / services"
                left={props => <List.Icon {...props} icon="format-list-bulleted" />}
                right={() => (
                  <Switch
                    value={formData.has_items}
                    onValueChange={(value) => handleToggleChange('has_items', value)}
                    color="#6366f1"
                  />
                )}
                style={styles.accordionItem}
              />

              <List.Item
                title="Has Charge"
                description="Payment already charge"
                left={props => <List.Icon {...props} icon="cash-plus" />}
                right={() => (
                  <Switch
                    value={formData.has_charge}
                    onValueChange={(value) => handleToggleChange('has_charge', value)}
                    color="#6366f1"
                  />
                )}
                style={styles.accordionItem}
              />

              <List.Item
                title="Is Scheduled"
                description="Set as scheduled payment"
                left={props => <List.Icon {...props} icon="calendar-clock" />}
                right={() => (
                  <Switch
                    value={formData.is_scheduled}
                    onValueChange={(value) => handleToggleChange('is_scheduled', value)}
                    color="#6366f1"
                  />
                )}
                style={styles.accordionItem}
              />
            </List.Accordion>


            <FormButton
              title="Add Payment"
              onPress={handleSubmit}
              loading={loading}
              icon="cash-plus"
              style={styles.addButton}
            />

            <FormButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              loading={loading}
              style={styles.cancelButton}
            />
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

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null)

          if (formData.has_items) {
            navigation.navigate('AddPaymentItem', {
              paymentId
            });
          } else {
            navigation.goBack()
          }
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  );
};

export default AddPaymentScreen;
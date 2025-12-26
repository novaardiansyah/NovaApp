import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { PaperProvider, Appbar, TextInput, HelperText } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';

registerTranslation('en', enGB);

import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton, Select, Notification } from '@/components';
import { styles } from '@/styles/EditPaymentScreen.styles';
import { typography } from '@/styles';
import paymentService from '@/services/paymentService';
import { formatAmount } from '@/utils/transactionUtils';

interface EditPaymentScreenProps {
  navigation: any;
  route: any;
}

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#e5e7eb',
          borderRadius: 4,
          opacity,
        },
        style,
      ]}
    />
  );
};

const EditPaymentFormSkeleton: React.FC = () => {
  return (
    <>
      {/* Amount Field */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton width="100%" height={56} style={{ borderRadius: 4 }} />
      </View>

      {/* Description Field */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton width="100%" height={100} style={{ borderRadius: 4 }} />
      </View>

      {/* Date Field */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton width="100%" height={56} style={{ borderRadius: 4 }} />
      </View>

      {/* Category Field */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton width="100%" height={56} style={{ borderRadius: 4 }} />
      </View>

      {/* Account Field */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton width="100%" height={56} style={{ borderRadius: 4 }} />
      </View>
    </>
  );
};

const EditPaymentScreen: React.FC<EditPaymentScreenProps> = ({ navigation, route }) => {
  const { paymentId } = route.params || {};
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string>('Loading...');
  const [paymentAccountId, setPaymentAccountId] = useState<number | null>(null);
  const [paymentAccountToId, setPaymentAccountToId] = useState<number | null>(null);
  const [hasItems, setHasItems] = useState<boolean>(false);

  const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(false);
  const [loadingPaymentAccounts, setLoadingPaymentAccounts] = useState(false);

  const initialFormData = {
    name: '',
    amount: '',
    type_id: '',
    date: new Date().toISOString().split('T')[0],
    payment_account_id: '',
  };

  const initialErrors = {
    name: '',
    amount: '',
    date: '',
    type_id: '',
    payment_account_id: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([
        loadPaymentTypes(),
        loadPaymentAccounts(),
        loadPaymentDetails(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadPaymentDetails = async () => {
    if (!token || !paymentId) {
      return;
    }

    try {
      const response = await paymentService.getPaymentDetails(token, paymentId);

      if (response.success && response.data) {
        const payment = response.data;
        setFormData({
          name: payment.name || '',
          amount: payment.amount?.toString() || '',
          type_id: payment.type_id?.toString() || '',
          date: payment.date || new Date().toISOString().split('T')[0],
          payment_account_id: payment.account?.id?.toString() || '',
        });

        if (payment.account?.name) {
          setAccountName(payment.account.name);
        } else {
          setAccountName('Tidak tersedia');
        }

        if (payment.account?.id) {
          setPaymentAccountId(payment.account.id);
        }

        if (payment.account_to?.id) {
          setPaymentAccountToId(payment.account_to.id);
        }

        setHasItems(payment.has_items || false);
      }
    } catch (error) {
      console.error('Error loading payment details:', error);
    }
  };

  const loadPaymentTypes = async () => {
    setLoadingPaymentTypes(true);

    if (!token) {
      setLoadingPaymentTypes(false);
      return;
    }

    try {
      const types = await paymentService.getPaymentTypes(token);
      setPaymentTypes(types);
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
    } catch (error) {
      console.error('Error loading payment accounts:', error);
    } finally {
      setLoadingPaymentAccounts(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
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

  const handleDateConfirm = (params: any) => {
    const year = params.date.getFullYear();
    const month = String(params.date.getMonth() + 1).padStart(2, '0');
    const day = String(params.date.getDate()).padStart(2, '0');
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

  const handlePaymentTypeChange = (typeId: string) => {
    setFormData(prev => ({ ...prev, type_id: typeId }));
    if (errors.type_id) {
      setErrors(prev => ({ ...prev, type_id: '' }));
    }
  };

  const handlePaymentAccountChange = (accountId: string) => {
    setFormData(prev => ({ ...prev, payment_account_id: accountId }));
    if (errors.payment_account_id) {
      setErrors(prev => ({ ...prev, payment_account_id: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please login again.');
      return;
    }

    if (loading) {
      return;
    }

    if (!formData.payment_account_id) {
      Alert.alert('Error', 'Payment account not found. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        amount: Number(formData.amount),
        name: formData.name.trim(),
        date: formData.date,
        type_id: parseInt(formData.type_id) || 1,
        payment_account_id: parseInt(formData.payment_account_id),
        payment_account_to_id: paymentAccountToId,
      };

      const response = await paymentService.updatePayment(token, paymentId, updateData);

      if (response.success) {
        setNotification('Pembayaran berhasil diperbarui!');
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
          Alert.alert('Error', response.message || 'Gagal memperbarui pembayaran. Silakan coba lagi.');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating payment:', error);
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const getCategoryName = () => {
    const category = paymentTypes.find(t => t.id.toString() === formData.type_id);
    return category?.name || 'Loading...';
  };

  const getAccountName = () => {
    return accountName;
  };

  if (loadingData) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Edit Pembayaran" titleStyle={typography.appbar.titleNormal} />
          </Appbar.Header>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <EditPaymentFormSkeleton />
          </ScrollView>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Pembayaran" titleStyle={typography.appbar.titleNormal} />
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
            <TextInput
              label={'Jumlah (Rp' + (formData.amount ? ` ${formatAmount(formData.amount)}` : '') + ')' + (hasItems ? '' : ' *')}
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              mode="outlined"
              outlineColor={hasItems ? '#d1d5db' : '#e5e7eb'}
              activeOutlineColor={hasItems ? '#d1d5db' : '#6366f1'}
              style={hasItems ? styles.inputDisabled : styles.input}
              placeholder={'Jumlah (Rp)' + (hasItems ? '' : ' *')}
              keyboardType="numeric"
              editable={!hasItems}
              textColor={hasItems ? '#6b7280' : undefined}
            />
            {errors.amount && <HelperText type="error" style={styles.helperText}>{errors.amount}</HelperText>}

            <TextInput
              label="Deskripsi *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              placeholder="Deskripsi *"
              multiline
              numberOfLines={4}
            />
            {errors.name && <HelperText type="error" style={styles.helperText}>{errors.name}</HelperText>}

            <TouchableOpacity onPress={() => setDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Tanggal *"
                value={formData.date}
                onChangeText={() => { }}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                placeholder="Pilih tanggal"
                editable={false}
              />
            </TouchableOpacity>
            {errors.date && <HelperText type="error" style={styles.helperText}>{errors.date}</HelperText>}

            <Select
              label="Kategori"
              value={formData.type_id}
              onValueChange={handlePaymentTypeChange}
              options={paymentTypes}
              loading={loadingPaymentTypes}
              error={errors.type_id}
              style={styles.input}
              errorStyle={styles.helperText}
            />

            <Select
              label="Akun Pembayaran"
              value={formData.payment_account_id}
              onValueChange={handlePaymentAccountChange}
              options={paymentAccounts}
              loading={loadingPaymentAccounts}
              error={errors.payment_account_id}
              style={styles.input}
              errorStyle={styles.helperText}
            />

            <FormButton
              title="Simpan Perubahan"
              onPress={handleSubmit}
              loading={loading}
              icon="content-save"
              style={styles.saveButton}
            />

            <FormButton
              title="Batal"
              onPress={() => {
                if (!loading) {
                  navigation.goBack();
                }
              }}
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
        saveLabel="Simpan"
        label="Pilih tanggal"
        animationType="slide"
        presentationStyle="pageSheet"
        locale="en"
      />

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
          navigation.navigate('TransactionsMain', { refresh: Date.now() });
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  );
};

export default EditPaymentScreen;

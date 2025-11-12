import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { PaperProvider, Appbar, TextInput, HelperText } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency, statusBarConfig } from '@/styles';
import { formatAmount } from '@/utils/transactionUtils';
import { FormButton, Notification } from '@/components';
import { styles } from '@/styles/AddGoalScreen.styles';
import PaymentGoalsService, { CreatePaymentGoalData } from '@/services/paymentGoalsService';

registerTranslation('en', enGB);

interface AddGoalScreenProps {
  navigation: any;
  route?: any;
}

interface FormData {
  name: string;
  description: string;
  amount: string;
  target_amount: string;
  start_date: string;
  target_date: string;
}

interface FormErrors {
  name: string;
  description: string;
  amount: string;
  target_amount: string;
  start_date: string;
  target_date: string;
}


const AddGoalScreen: React.FC<AddGoalScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [targetDatePickerVisible, setTargetDatePickerVisible] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const getInitialFormData = (): FormData => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // First day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);

    // Last day of current month (day 0 of next month = last day of current month)
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      name: '',
      description: '',
      amount: '0',
      target_amount: '',
      start_date: formatDate(firstDay),
      target_date: formatDate(lastDay),
    };
  };

  const initialFormData = getInitialFormData();

  const initialErrors: FormErrors = {
    name: '',
    description: '',
    amount: '',
    target_amount: '',
    start_date: '',
    target_date: '',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'Token autentikasi tidak ditemukan. Silakan masuk kembali.');
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    try {
      const goalData: CreatePaymentGoalData = {
        name: formData.name,
        description: formData.description,
        amount: 0,
        target_amount: parseFloat(formData.target_amount),
        start_date: formData.start_date,
        target_date: formData.target_date,
      };

      const response = await PaymentGoalsService.createPaymentGoal(token, goalData);

      if (response.success) {
        setNotification(response?.message || 'Success');
      } else {
        setSubmitting(false);

        if (response.errors) {
          const newErrors = { ...initialErrors };

          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
              newErrors[field as keyof typeof initialErrors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', response.message || 'Gagal membuat tujuan keuangan. Silakan coba lagi.');
        }
      }

    } catch (error: any) {
      setSubmitting(false);

      if (error.response?.data?.errors) {
        const newErrors = { ...initialErrors };

        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
            newErrors[field as keyof typeof initialErrors] = messages[0] as string;
          }
        });

        setErrors(newErrors);
      } else {
        Alert.alert('Error', 'Gagal membuat tujuan keuangan. Silakan coba lagi.');
      }
    }
  };

  const handleStartDateConfirm = (params: any) => {
    const year = params.date.getFullYear();
    const month = String(params.date.getMonth() + 1).padStart(2, '0');
    const day = String(params.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({ ...prev, start_date: formattedDate }));
    setStartDatePickerVisible(false);
  };

  const handleTargetDateConfirm = (params: any) => {
    const year = params.date.getFullYear();
    const month = String(params.date.getMonth() + 1).padStart(2, '0');
    const day = String(params.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({ ...prev, target_date: formattedDate }));
    setTargetDatePickerVisible(false);
  };

  const handleDateDismiss = () => {
    setStartDatePickerVisible(false);
    setTargetDatePickerVisible(false);
  };

  
  const handleRefresh = () => {
    // Reset form
    setFormData(getInitialFormData());
    setErrors(initialErrors);
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Buat Tujuan Keuangan" />
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
                refreshing={false}
                onRefresh={handleRefresh}
                colors={['#6366f1']}
                tintColor="#6366f1"
              />
            }
          >
            <Text style={styles.description}>
              Buat tujuan keuangan baru untuk melacak target tabungan Anda dan mencapai impian finansial Anda.
            </Text>

            <TextInput
              label="Nama Tujuan *"
              placeholder="Masukkan nama tujuan"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              autoCapitalize="words"
              left={<TextInput.Icon icon="flag" color="#6b7280" />}
            />
            {errors.name && <HelperText type="error" style={styles.helperText}>{errors.name}</HelperText>}

            <TextInput
              label="Deskripsi"
              placeholder="Masukkan deskripsi tujuan"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="file-document-outline" color="#6b7280" />}
            />
            {errors.description && <HelperText type="error" style={styles.helperText}>{errors.description}</HelperText>}

  
            <TextInput
              label={'Target Jumlah (Rp' + (formData.target_amount ? ` ${formatAmount(formData.target_amount)}` : '') + ') *'}
              placeholder="Masukkan target jumlah"
              value={formData.target_amount}
              onChangeText={(value) => handleInputChange('target_amount', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="cash" color="#6b7280" />}
            />
            {errors.target_amount && <HelperText type="error" style={styles.helperText}>{errors.target_amount}</HelperText>}

            <TouchableOpacity onPress={() => setStartDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Tanggal Mulai *"
                value={formData.start_date ? new Date(formData.start_date).toLocaleDateString() : ''}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                placeholder="Pilih tanggal mulai"
                editable={false}
                left={<TextInput.Icon icon="calendar" color="#6b7280" />}
              />
            </TouchableOpacity>
            {errors.start_date && <HelperText type="error" style={styles.helperText}>{errors.start_date}</HelperText>}

            <TouchableOpacity onPress={() => setTargetDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Tanggal Target *"
                value={formData.target_date ? new Date(formData.target_date).toLocaleDateString() : ''}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                placeholder="Pilih tanggal target"
                editable={false}
                left={<TextInput.Icon icon="calendar" color="#6b7280" />}
              />
            </TouchableOpacity>
            {errors.target_date && <HelperText type="error" style={styles.helperText}>{errors.target_date}</HelperText>}

            <FormButton
              title="Buat Tujuan"
              onPress={handleSubmit}
              loading={submitting}
              icon="trophy"
              style={styles.createButton}
            />

            <FormButton
              title="Batal"
              onPress={() => navigation.goBack()}
              variant="outline"
              loading={submitting}
              style={styles.cancelButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Start Date Picker Modal */}
      <DatePickerModal
        visible={startDatePickerVisible}
        onDismiss={handleDateDismiss}
        onConfirm={handleStartDateConfirm}
        date={formData.start_date ? new Date(formData.start_date) : new Date()}
        mode="single"
        saveLabel="Simpan"
        label="Pilih tanggal mulai"
        animationType="slide"
        presentationStyle="pageSheet"
        locale="en"
      />

      {/* Target Date Picker Modal */}
      <DatePickerModal
        visible={targetDatePickerVisible}
        onDismiss={handleDateDismiss}
        onConfirm={handleTargetDateConfirm}
        date={formData.target_date ? new Date(formData.target_date) : new Date()}
        mode="single"
        saveLabel="Simpan"
        label="Pilih tanggal target"
        animationType="slide"
        presentationStyle="pageSheet"
        locale="en"
      />

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
          navigation.navigate('GoalsMain', { refresh: Date.now() });
        }}
        type="success"
        duration={1500}
      />
    </PaperProvider>
  );
};

export default AddGoalScreen;
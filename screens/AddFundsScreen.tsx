import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { PaperProvider, Appbar, TextInput, HelperText } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton, Select, Notification } from '@/components';
import { styles } from '@/styles/AddFundsScreen.styles';
import PaymentService, { PaymentAccount } from '@/services/paymentService';
import PaymentGoalsService, { PaymentGoal, AddFundsData } from '@/services/paymentGoalsService';
import { formatAmount } from '@/utils/transactionUtils';

interface AddFundsScreenProps {
  navigation?: any;
  route?: {
    params?: {
      goal?: PaymentGoal;
    };
  };
}

const AddFundsScreen: React.FC<AddFundsScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const { goal } = route?.params || {};

  if (!token || !goal) {
    return null;
  }
  const [loading, setLoading] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [loadingPaymentAccounts, setLoadingPaymentAccounts] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const initialFormData = {
    amount: '',
    payment_account_id: '',
  };

  const initialErrors = {
    amount: '',
    payment_account_id: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    loadPaymentAccounts();
  }, []);

  const loadPaymentAccounts = async () => {
    setLoadingPaymentAccounts(true);

    if (!token) {
      setLoadingPaymentAccounts(false);
      return;
    }

    try {
      const accounts = await PaymentService.getPaymentAccounts(token);
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };

  
  const handleSubmit = async () => {
    if (!token || loading) {
      return;
    }

    setLoading(true);
    try {
      const fundsData: AddFundsData = {
        amount: parseFloat(formData.amount),
        payment_account_id: parseInt(formData.payment_account_id)
      };

      // Call API to add funds to goal
      const response = await PaymentGoalsService.addFundsToGoal(token, goal.id, fundsData);

      if (response.success) {
        setNotification('Dana berhasil ditambahkan ke tujuan keuangan!');
      } else {
        setLoading(false);

        if (response.errors) {
          const newErrors = { ...initialErrors };

          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
              newErrors[field as keyof typeof errors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', response.message || 'Gagal menambahkan dana. Silakan coba lagi.');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error adding funds:', error);
      Alert.alert('Error', 'Terjadi kesalahan tak terduga. Silakan coba lagi.');
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation?.goBack()} />
          <Appbar.Content title="Tambah Dana" />
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
            {/* Goal Information */}
            <View style={styles.goalInfoCard}>
              <Text style={styles.goalName}>{goal.name}</Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>

              <View style={styles.goalProgress}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Saat Ini</Text>
                  <Text style={styles.progressValue}>{goal.formatted.amount}</Text>
                </View>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Target</Text>
                  <Text style={styles.progressValue}>{goal.formatted.target_amount}</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: parseInt(goal.formatted.progress) }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{goal.formatted.progress}</Text>
              </View>
            </View>

            <Select
              label="Akun Pembayaran"
              value={formData.payment_account_id}
              onValueChange={(value) => handleInputChange('payment_account_id', value)}
              options={paymentAccounts}
              loading={loadingPaymentAccounts}
              error={errors.payment_account_id}
              style={styles.input}
              errorStyle={styles.helperText}
            />

            <TextInput
              label={'Jumlah (Rp' + (formData.amount ? ` ${formatAmount(formData.amount)}` : '') + ') *'}
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              placeholder="Jumlah (Rp) *"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="currency-usd" color="#6b7280" />}
            />
            {errors.amount && <HelperText type="error" style={styles.helperText}>{errors.amount}</HelperText>}

            <FormButton
              title="Tambah Dana"
              onPress={handleSubmit}
              loading={loading}
              icon="plus"
              style={styles.addButton}
            />

            <FormButton
              title="Batal"
              onPress={() => {
                if (!loading) {
                  navigation?.goBack();
                }
              }}
              variant="outline"
              loading={loading}
              style={styles.cancelButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
          navigation?.navigate('Goals', { refresh: Date.now() });
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  );
};

export default AddFundsScreen;
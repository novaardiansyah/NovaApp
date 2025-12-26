import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { PaperProvider, Appbar, Card, TextInput, HelperText } from 'react-native-paper';
import { FormButton, Notification } from '@/components';
import { AuditFormSkeleton } from '@/components';
import { Theme } from '@/constants/colors';
import { formatCurrency, typography } from '@/styles';
import { styles } from '@/styles/AuditScreen.styles';
import { formatAmount } from '@/utils/transactionUtils';
import { useAuth } from '@/contexts/AuthContext';
import PaymentService, { PaymentAccount } from '@/services/paymentService';

interface AuditScreenProps {
  navigation?: any;
  route?: {
    params?: {
      accountId?: number;
    };
  };
}

const AuditScreen: React.FC<AuditScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const { accountId } = route?.params || {};

  const [accountData, setAccountData] = useState<PaymentAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [diffDepositValue, setDiffDepositValue] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const initialFormData = {
    deposit: 0,
    currentValue: 0
  };

  const initialErrors = {
    deposit: ''
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState(initialErrors)

  useEffect(() => {
    if (accountId && token) {
      fetchAccountData();
    }
  }, [accountId, token]);

  useEffect(() => {
    checkDiffDeposit()
  }, [formData.deposit]);

  const checkDiffDeposit = () => {
    const current = formData.currentValue || 0;
    const deposit = formData.deposit || 0;
    const diff = deposit - current;

    setDiffDepositValue(diff.toString());
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };

  const fetchAccountData = async () => {
    if (!accountId || !token) return;

    try {
      setLoading(true);
      const response = await PaymentService.getPaymentAccount(token, accountId);

      if (response.success && response.data) {
        const { deposit } = response.data

        setAccountData(response.data);
        setFormData(prev => ({ ...prev, deposit, currentValue: deposit }))
      } else {
        Alert.alert('Error', 'Failed to fetch account data');
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
      Alert.alert('Error', 'Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAccountData();
    setRefreshing(false);
  };

  const handleSaveAudit = async () => {
    if (!token || !accountId || submitting) return;

    const depositValue = parseFloat(formData.deposit.toString());
    if (isNaN(depositValue) || depositValue < 0) {
      setErrors(prev => ({ ...prev, deposit: 'Please enter a valid deposit amount' }));
      return;
    }

    try {
      setSubmitting(true);
      const response = await PaymentService.auditPaymentAccount(token, accountId, depositValue);

      if (response.success) {
        setNotification('Account audit completed successfully')
      } else {
        setSubmitting(false);
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
      console.error('Error auditing account:', error);
      setSubmitting(false);
      Alert.alert('Error', 'Failed to audit account');
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation?.goBack()} />
          <Appbar.Content title="Audit Saldo" titleStyle={typography.appbar.titleNormal} />
        </Appbar.Header>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
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
            <View style={styles.contentSection}>
              {loading ? (
                <AuditFormSkeleton />
              ) : accountData ? (
                <>
                  <Text style={styles.description}>
                    Sesuaikan saldo akun dengan saldo aktual. Masukkan nominal saldo yang benar di bawah ini.
                  </Text>

                  <TextInput
                    label="Saldo Saat Ini"
                    value={formatCurrency(formData.currentValue)}
                    editable={false}
                    mode="outlined"
                    outlineColor="#e5e7eb"
                    activeOutlineColor="#6366f1"
                    style={styles.input}
                    contentStyle={styles.inputContent}
                    textColor="#6b7280"
                    left={<TextInput.Icon icon="lock" color="#9ca3af" />}
                  />

                  <TextInput
                    label={'Saldo aktual (Rp' + (formData.deposit ? ` ${formatAmount(formData.deposit.toString())}` : '') + ')'}
                    value={formData.deposit === 0 ? '' : formData.deposit.toString()}
                    onChangeText={(value) => handleInputChange('deposit', value)}
                    placeholder="Masukkan nominal saldo"
                    mode="outlined"
                    outlineColor="#e5e7eb"
                    activeOutlineColor="#6366f1"
                    style={styles.input}
                    contentStyle={styles.inputContent}
                    keyboardType="numeric"
                    left={<TextInput.Icon icon="wallet-outline" color="#9ca3af" />}
                  />
                  {errors.deposit && <HelperText type="error" style={styles.helperText}>{errors.deposit}</HelperText>}

                  <Card style={styles.summaryCard}>
                    <Card.Content style={styles.summaryContent}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Selisih:</Text>
                        <Text style={[
                          styles.summaryValue,
                          parseFloat(diffDepositValue) >= 0
                            ? { color: '#059669' }
                            : { color: '#dc2626' }
                        ]}>
                          {formatCurrency(parseFloat(diffDepositValue))}
                        </Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Status:</Text>
                        <Text style={[
                          styles.summaryStatus,
                          parseFloat(diffDepositValue) >= 0
                            ? { color: '#059669', backgroundColor: '#dcfce7' }
                            : { color: '#dc2626', backgroundColor: '#fee2e2' }
                        ]}>
                          {parseFloat(diffDepositValue) >= 0 ? 'Surplus' : 'Defisit'}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>

                  <FormButton
                    title="Simpan Perubahan"
                    onPress={handleSaveAudit}
                    loading={submitting}
                    icon="content-save"
                    style={styles.saveButton}
                  />

                  <FormButton
                    title="Batal"
                    onPress={() => navigation?.goBack()}
                    variant="outline"
                    loading={submitting}
                    style={styles.cancelButton}
                  />
                </>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null)
          setSubmitting(false)
          navigation.navigate('BudgetMain', { refresh: Date.now() })
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  );
};

export default AuditScreen;
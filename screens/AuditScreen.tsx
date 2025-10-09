import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { PaperProvider, Appbar, Card, TextInput, HelperText } from 'react-native-paper';
import { FormButton, Notification } from '@/components';
import { AuditAccountCardSkeleton, AuditFormSkeleton } from '@/components/Skeleton';
import { Theme } from '@/constants/colors';
import { formatCurrency } from '@/styles';
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

  // Fetch account data on component mount
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
    const diff    = deposit - current;

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

    // Validate deposit value
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
          <Appbar.Content title="Audit Deposit" />
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
            {/* Account Info Card */}
            {loading ? (
              <AuditAccountCardSkeleton />
            ) : accountData ? (
              <Card style={styles.accountCard}>
                <Card.Content style={styles.accountCardContent}>
                  <View style={styles.accountInfo}>
                    <View style={styles.accountInfoLeft}>
                      <Text style={styles.accountName}>{accountData.name || 'Account Name'}</Text>
                      <Text style={styles.accountLabel}>Account ID: {accountData.id || 'N/A'}</Text>
                    </View>
                    <View style={styles.accountInfoRight}>
                      <Text style={styles.accountStatus}>Active</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ) : null}

            {/* Audit Form */}
            {loading ? (
              <AuditFormSkeleton />
            ) : accountData ? (
              <>
                <Text style={styles.formTitle}>Audit Information</Text>

                {/* Current Deposit */}
                <TextInput
                  label="Current Deposit"
                  value={formatCurrency(formData.currentValue)}
                  editable={false}
                  mode="outlined"
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                  style={styles.input}
                  textColor="#6b7280"
                  left={<TextInput.Icon icon="lock" color="#9ca3af" />}
                />

                {/* Deposit */}
                <TextInput
                  label="Deposit"
                  value={formData.deposit === 0 ? '' : formData.deposit.toString()}
                  onChangeText={(value) => handleInputChange('deposit', value)}
                  placeholder="Enter deposit amount"
                  mode="outlined"
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                  style={styles.input}
                  keyboardType="numeric"
                  left={<TextInput.Icon icon="wallet-outline" color="#9ca3af" />}
                />
                {errors.deposit && <HelperText type="error" style={styles.helperText}>{errors.deposit}</HelperText>}

                {/* Summary */}
                <Card style={styles.summaryCard}>
                  <Card.Content style={styles.summaryContent}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Difference:</Text>
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
                        {parseFloat(diffDepositValue) >= 0 ? 'Surplus' : 'Deficit'}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>

                {/* Action Buttons */}
                <FormButton
                  title="Save Audit"
                  onPress={handleSaveAudit}
                  loading={submitting}
                  icon="content-save"
                  style={styles.saveButton}
                />

                <FormButton
                  title="Cancel"
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
    paddingBottom: 20,
  },
  contentSection: {
    gap: 24,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  accountCardContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoLeft: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  accountLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  accountInfoRight: {
    alignItems: 'flex-end',
  },
  accountStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
    marginTop: -12
  },
  input: {
    backgroundColor: '#ffffff',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveButton: {
    marginTop: 12,
    marginBottom: 0
  },
  cancelButton: {
    marginTop: -10,
    borderColor: '#e5e7eb',
  },
  refreshOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f9fafb',
    zIndex: 1,
    paddingTop: 48, // Account appbar height (24) + top padding (24)
    paddingHorizontal: 24, // Match scrollContent padding
    paddingBottom: 20, // Match scrollContent paddingBottom
  },
  helperText: {
    marginTop: -24,
    marginLeft: -6,
    marginBottom: 0
  },
});

export default AuditScreen;
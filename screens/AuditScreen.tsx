import React, { useState } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert, Modal, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, Card, TextInput, Button } from 'react-native-paper';
import { FormButton } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { commonStyles, formatCurrency, getScrollContainerStyle } from '@/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

interface AuditScreenProps {
  navigation?: any;
  route?: {
    params?: {
      accountId?: number;
    };
  };
}

const AuditScreen: React.FC<AuditScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { accountId } = route?.params || {};

  // Dummy data
  const dummyAccounts = [
    { id: 1, name: 'BCA Savings', deposit: 15000000, logo: 'https://via.placeholder.com/48x48/3b82f6/ffffff?text=BCA' },
    { id: 2, name: 'Mandiri Checking', deposit: 25000000, logo: 'https://via.placeholder.com/48x48/f59e0b/ffffff?text=MND' },
    { id: 3, name: 'BRI Business', deposit: 45000000, logo: 'https://via.placeholder.com/48x48/10b981/ffffff?text=BRI' },
    { id: 4, name: 'BNI Corporate', deposit: 75000000, logo: 'https://via.placeholder.com/48x48/8b5cf6/ffffff?text=BNI' },
    { id: 5, name: 'CIMB Niaga', deposit: 35000000, logo: 'https://via.placeholder.com/48x48/ef4444/ffffff?text=CIMB' },
  ];

  const currentAccount = dummyAccounts.find(acc => acc.id === accountId) || dummyAccounts[0];
  const { name: accountName, deposit: currentDeposit } = currentAccount;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDepositValue, setCurrentDepositValue] = useState(currentDeposit.toString());
  const [depositValue, setDepositValue] = useState('');
  const [diffDepositValue, setDiffDepositValue] = useState('');

  // Calculate diff deposit automatically when current or deposit changes
  React.useEffect(() => {
    const current = parseFloat(currentDepositValue) || 0;
    const deposit = parseFloat(depositValue) || 0;
    const diff = deposit - current;
    setDiffDepositValue(diff.toString());
  }, [currentDepositValue, depositValue]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleSaveAudit = () => {
    if (!depositValue.trim()) {
      Alert.alert('Validation Error', 'Please enter deposit amount');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        `Audit saved successfully!\n\nAccount: ${accountName}\nCurrent Deposit: ${formatCurrency(parseFloat(currentDepositValue))}\nNew Deposit: ${formatCurrency(parseFloat(depositValue))}\nDifference: ${formatCurrency(parseFloat(diffDepositValue))}`,
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack()
          }
        ]
      );
    }, 1500);
  };

  const formatNumberInput = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue;
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
            <Card style={styles.accountCard}>
              <Card.Content style={styles.accountCardContent}>
                <View style={styles.accountInfo}>
                  <View style={styles.accountInfoLeft}>
                    <Text style={styles.accountName}>{accountName || 'Account Name'}</Text>
                    <Text style={styles.accountLabel}>Account ID: {accountId || 'N/A'}</Text>
                  </View>
                  <View style={styles.accountInfoRight}>
                    <Text style={styles.accountStatus}>Active</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Audit Form */}
            <Text style={styles.formTitle}>Audit Information</Text>

            {/* Current Deposit */}
            <TextInput
              label="Current Deposit"
              value={formatCurrency(parseFloat(currentDepositValue))}
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
              value={depositValue}
              onChangeText={(text) => setDepositValue(formatNumberInput(text))}
              placeholder="Enter deposit amount"
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="wallet-outline" color="#9ca3af" />}
            />

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
              loading={loading}
              icon="content-save"
              style={styles.saveButton}
            />

            <FormButton
              title="Cancel"
              onPress={() => navigation?.goBack()}
              variant="outline"
              loading={loading}
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
    marginBottom: 16,
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
});

export default AuditScreen;
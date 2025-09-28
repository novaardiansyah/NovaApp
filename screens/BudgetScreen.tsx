import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { AccountsListSkeleton } from '@/components';

interface PaymentAccount {
  id: number;
  name: string;
  deposit: number;
  formatted_deposit: string;
  logo: string;
}

interface BudgetScreenProps {
  navigation: any;
}

const BudgetScreen: React.FC<BudgetScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentAccounts = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://100.108.9.46:8000/api/payment-accounts', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment accounts');
      }

      const data = await response.json();
      setPaymentAccounts(data);
    } catch (error) {
      console.error('Error fetching payment accounts:', error);
      // Fallback to sample data for development
      setPaymentAccounts([
        {
          id: 2,
          name: 'Dana',
          deposit: 11600,
          formatted_deposit: 'Rp11.600',
          logo: 'http://100.108.9.46:8000/storage/images/payment_account/01J1WY6C5XMT27PHDKGF9FH82D.jpg'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPaymentAccounts();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentAccounts();
    setRefreshing(false);
  };

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Text style={styles.authText}>Please login first</Text>
        </View>
      </PaperProvider>
    );
  }

  // formatCurrency is imported from shared styles

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Header */}
          <View style={commonStyles.header}>
            <Ionicons name="wallet" size={24} color="#6366f1" style={commonStyles.headerIcon} />
            <Text style={commonStyles.headerTitle}>Budget & Accounts</Text>
          </View>

          {/* Total Balance */}
          <Card style={commonStyles.totalBalanceCard}>
            <Card.Content style={commonStyles.totalBalanceContent}>
              <Text style={commonStyles.totalBalanceLabel}>Total Balance</Text>
              <Text style={commonStyles.totalBalanceAmount}>
                {formatCurrency(paymentAccounts.reduce((sum, account) => sum + account.deposit, 0))}
              </Text>
              <Text style={commonStyles.totalBalanceSubtitle}>
                {paymentAccounts.length} {paymentAccounts.length === 1 ? 'Account' : 'Accounts'}
              </Text>
            </Card.Content>
          </Card>

          {/* Accounts List */}
          <View style={styles.accountsSection}>
            <Text style={commonStyles.sectionTitle}>Payment Accounts</Text>

            {loading ? (
              <AccountsListSkeleton count={3} />
            ) : (
              <View style={styles.accountsList}>
                {paymentAccounts.map((account, index) => (
                  <Card
                    key={account.id}
                    style={[
                      commonStyles.accountCard,
                      index < paymentAccounts.length - 1 ? { marginBottom: 0 } : { marginBottom: 0 }
                    ]}
                  >
                    <Card.Content style={commonStyles.accountCardContent}>
                      <View style={commonStyles.accountLeft}>
                        <Avatar.Image
                          size={48}
                          source={{ uri: account.logo }}
                          style={commonStyles.accountLogo}
                        />
                        <View style={commonStyles.accountInfo}>
                          <Text style={commonStyles.accountName}>{account.name}</Text>
                          <Text style={commonStyles.accountBalance}>{account.formatted_deposit}</Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = {
  accountsSection: {
    marginBottom: 24,
  },
  accountsList: {
    gap: 12,
  },
};

export default BudgetScreen;
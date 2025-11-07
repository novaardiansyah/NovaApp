import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, StatusBar, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import TransactionService from '@/services/transactionService';
import PaymentService, { PaymentAccount } from '@/services/paymentService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { AccountsListSkeleton, BalanceCardSkeleton } from '@/components';
import { Alert } from 'react-native';

interface BudgetScreenProps {
  navigation: any;
}

const BudgetScreen: React.FC<BudgetScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [financialData, setFinancialData] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<PaymentAccount | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const fetchFinancialData = async () => {
    if (!isAuthenticated || !token) return;

    try {
      const financial = await TransactionService.fetchFinancialData(token);
      setFinancialData(financial);
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  };

  const fetchPaymentAccounts = async () => {
    if (!isAuthenticated || !token) return;

    setLoading(true);
    try {
      const data = await PaymentService.getPaymentAccounts(token);
      setPaymentAccounts(data);
    } catch (error) {
      console.error('Error fetching payment accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFinancialData();
      fetchPaymentAccounts();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setFinancialData(null);
    await fetchFinancialData();
    await fetchPaymentAccounts();
    setRefreshing(false);
  };

  const handleAccountPress = (account: PaymentAccount) => {
    setSelectedAccount(account);
    setActionSheetVisible(true);
  };

  const handleActionSelect = (action: string) => {
    if (!selectedAccount) return;

    setActionSheetVisible(false);

    switch (action) {
      case 'audit':
        navigation.navigate('AuditPaymentAccount', {
          accountId: selectedAccount.id
        });
        break;
      case 'view_transactions':
        Alert.alert('Transactions', `View transactions for ${selectedAccount.name} feature coming soon!`);
        break;
    }
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };

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
            <Text style={commonStyles.headerTitle}>Anggaran Keuangan</Text>
          </View>

          {/* Total Balance */}
          {financialData ? (
            <Card style={commonStyles.totalBalanceCard}>
              <Card.Content style={commonStyles.totalBalanceContent}>
                <Text style={commonStyles.totalBalanceLabel}>Total Saldo</Text>
                <Text style={commonStyles.totalBalanceAmount}>
                  {formatCurrency(financialData.total_balance)}
                </Text>
                <View style={styles.scheduledExpenseContainer}>
                  <Text style={styles.afterScheduledLabel}>
                    Total saldo tersisa
                  </Text>
                  <Text style={styles.totalAfterScheduledText}>
                    {formatCurrency(financialData.total_after_scheduled)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <BalanceCardSkeleton style={commonStyles.totalBalanceCard} />
          )}

          {/* Accounts List */}
          <View style={styles.accountsSection}>
            <Text style={commonStyles.sectionTitle}>Akun Keuangan</Text>

            {loading ? (
              <AccountsListSkeleton count={5} />
            ) : (
              <View style={styles.accountsList}>
                <Card style={styles.accountsCard}>
                  <Card.Content style={styles.accountsCardContent}>
                    {paymentAccounts.map((account, index) => (
                      <View key={account.id}>
                        <TouchableOpacity
                          onPress={() => handleAccountPress(account)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.accountContainer}>
                            <View style={styles.accountLeft}>
                              <Avatar.Image
                                size={48}
                                source={{ uri: account.logo }}
                                style={styles.accountLogo}
                              />
                              <View style={styles.accountInfo}>
                                <Text style={styles.accountName}>{account.name}</Text>
                                <Text style={[
                                  styles.accountBalance,
                                  account.deposit >= 50000
                                    ? { color: '#10b981' }
                                    : account.deposit > 0 && account.deposit < 50000
                                      ? { color: '#f59e0b' }
                                      : { color: '#ef4444' }
                                ]}>
                                  {account.formatted_deposit}
                                </Text>
                              </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                          </View>
                        </TouchableOpacity>
                        {index < paymentAccounts.length - 1 && (
                          <View style={styles.accountDivider} />
                        )}
                      </View>
                    ))}
                  </Card.Content>
                </Card>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Sheet Modal */}
        <Modal
          visible={actionSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={closeActionSheet}
        >
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeActionSheet}
            />

            <View style={styles.actionSheet}>
              <Text style={styles.actionSheetTitle}>Account Actions</Text>

              <View style={styles.actionSheetContent}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleActionSelect('audit')}
                >
                  <Ionicons name="resize-outline" size={24} color="#ef4444" style={styles.actionIcon} />
                  <Text style={styles.actionText}>Audit Deposit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleActionSelect('view_transactions')}
                >
                  <Ionicons name="list-outline" size={24} color="#f59e0b" style={styles.actionIcon} />
                  <Text style={styles.actionText}>View Transactions</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeActionSheet}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  scheduledExpenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#6366f1',
    width: '100%',
  },
  afterScheduledLabel: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  totalAfterScheduledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  accountsSection: {
    marginBottom: 24,
  },
  accountsList: {
    gap: 12,
  },
  accountsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accountsCardContent: {
    paddingVertical: 8,
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  accountLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountLogo: {
    marginRight: 16,
    backgroundColor: '#ffffff',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '500',
  },
  accountDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 0,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalOverlay: {
    flex: 1,
  },

  actionSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },

  actionSheetTitle: {
    textAlign: 'center',
    padding: 16,
    color: '#6b7280',
    fontSize: 13,
  },

  actionSheetContent: {
    paddingHorizontal: 20,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },

  actionIcon: {
    marginRight: 16,
  },

  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  cancelButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
});

export default BudgetScreen;
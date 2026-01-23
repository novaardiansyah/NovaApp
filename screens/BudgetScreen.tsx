import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Avatar, FAB, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import TransactionService from '@/services/transactionService';
import PaymentService, { PaymentAccount } from '@/services/paymentService';
import accountService from '@/services/accountService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, typography } from '@/styles';
import { styles } from '@/styles/BudgetScreen.styles';
import { AccountsListSkeleton, BalanceCardSkeleton, Notification } from '@/components';
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
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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
      setPaymentAccounts(data.data);
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
      case 'delete':
        handleDeleteAccount(selectedAccount.id);
        break;
    }
  };

  const closeActionSheet = () => {
    setActionSheetVisible(false);
  };


  const handleDeleteAccount = async (accountId: number) => {
    if (deletingAccountId) return; // Prevent double request
    if (!isAuthenticated || !token) return;

    Alert.alert(
      'Hapus Akun',
      'Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setDeletingAccountId(accountId);
            setActionSheetVisible(false);

            try {
              await accountService.deleteAccount(token, accountId);

              // Remove from local state
              setPaymentAccounts(prev => prev.filter(account => account.id !== accountId));

              setNotification('Akun berhasil dihapus');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
            } finally {
              setDeletingAccountId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={commonStyles.container}>
        <Appbar.Header>
          <Appbar.Content title="Anggaran Keuangan" titleStyle={typography.appbar.titleBold} />
        </Appbar.Header>
        <ScrollView
          contentContainerStyle={[getScrollContainerStyle(insets), { paddingTop: 0 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >

          {/* Total Balance */}
          {financialData ? (
            <Card style={commonStyles.totalBalanceCard}>
              <Card.Content style={commonStyles.totalBalanceContent}>
                <Text style={[commonStyles.totalBalanceLabel, { fontSize: typography.label.large }]}>Total Saldo</Text>
                <Text style={[commonStyles.totalBalanceAmount, { fontSize: 28 }]}>
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
            <Text style={[commonStyles.sectionTitle, { fontSize: typography.heading.medium }]}>Akun Keuangan</Text>

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
                                source={{ uri: account.formatted.logo }}
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
                                  {account.formatted.deposit}
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
              <Text style={styles.actionSheetTitle}>Aksi Kelola Akun</Text>

              <View style={styles.actionSheetContent}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleActionSelect('audit')}
                >
                  <Ionicons name="resize-outline" size={20} color="#6366f1" style={styles.actionIcon} />
                  <Text style={styles.actionText}>Audit Saldo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleActionSelect('delete')}
                  disabled={deletingAccountId === selectedAccount?.id}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#6366f1"
                    style={styles.actionIcon}
                  />
                  <Text style={styles.actionText}>
                    {deletingAccountId === selectedAccount?.id ? 'Menghapus...' : 'Hapus Akun'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeActionSheet}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        <Notification
          visible={!!notification}
          message={notification || ''}
          onDismiss={() => setNotification(null)}
          type="success"
        />

        <FAB
          icon="plus"
          color="#ffffff"
          style={[styles.fab, {
            bottom: -6
          }]}
          onPress={() => navigation.navigate('AddAccount')}
        />
      </View>
    </PaperProvider>
  );
};

export default BudgetScreen;
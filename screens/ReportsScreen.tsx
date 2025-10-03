import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, StatusBar, TouchableOpacity, Alert, Modal, Pressable, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Button, Divider, TextInput, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { ReportsPeriodSkeleton, ReportsSummarySkeleton, ReportsTransactionsSkeleton, FormButton } from '@/components';

interface ReportsScreenProps {
  navigation: any;
}

interface FinancialItem {
  id: number;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

interface Transaction {
  id: number;
  name: string;
  date: string;
  formatted_date: string;
  amount: number;
  formatted_amount: string;
  type: 'income' | 'expense';
  category: string;
}

interface MonthlyData {
  income: number;
  expenses: number;
  transfers: number;
  withdrawals: number;
  balance: number;
  financialItems: FinancialItem[];
  recentTransactions: Transaction[];
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  // Generate month options (3 months back, 3 months forward from current month)
  const getMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

    const options = [];

    // Add 3 months back
    for (let i = 3; i >= 1; i--) {
      const date = new Date(currentYear, currentMonth - i - 1, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      options.push(`${year}-${month}`);
    }

    // Add current month
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    options.push(currentMonthStr);

    // Add 3 months forward
    for (let i = 1; i <= 3; i++) {
      const date = new Date(currentYear, currentMonth + i - 1, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      options.push(`${year}-${month}`);
    }

    return options;
  };

  // Generate sample data for all months
  const generateMonthlyData = () => {
    const monthOptions = getMonthOptions();
    const data: Record<string, MonthlyData> = {};

    // Generate dynamic base data based on current date
    const baseData: Record<string, Omit<MonthlyData, 'financialItems' | 'recentTransactions'>> = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Generate data for 3 months back, current month, and 3 months forward
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentYear, currentMonth + i - 1, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;

      // Generate varied but realistic data
      const baseIncome = 8000000 + Math.random() * 2000000;
      const baseExpenses = 6000000 + Math.random() * 1500000;
      const transfers = 1000000 + Math.random() * 800000;
      const withdrawals = 600000 + Math.random() * 300000;

      baseData[monthKey] = {
        income: Math.round(baseIncome),
        expenses: Math.round(baseExpenses),
        transfers: Math.round(transfers),
        withdrawals: Math.round(withdrawals),
        balance: Math.round(baseIncome - baseExpenses)
      };
    }

    monthOptions.forEach(monthYear => {
      const base = baseData[monthYear];
      if (!base) return; // Skip if no data for this month
      const total = base.income + base.expenses + base.transfers + base.withdrawals;

      data[monthYear] = {
        ...base,
        financialItems: [
          {
            id: 1,
            name: 'Income',
            amount: base.income,
            percentage: Math.round((base.income / total) * 100),
            color: '#10b981',
            icon: 'arrow-down'
          },
          {
            id: 2,
            name: 'Expenses',
            amount: base.expenses,
            percentage: Math.round((base.expenses / total) * 100),
            color: '#ef4444',
            icon: 'arrow-up'
          },
          {
            id: 3,
            name: 'Transfers',
            amount: base.transfers,
            percentage: Math.round((base.transfers / total) * 100),
            color: '#3b82f6',
            icon: 'swap-horizontal-outline'
          },
          {
            id: 4,
            name: 'Withdrawals',
            amount: base.withdrawals,
            percentage: Math.round((base.withdrawals / total) * 100),
            color: '#f59e0b',
            icon: 'arrow-down-circle-outline'
          },
        ],
        recentTransactions: generateSampleTransactions(monthYear)
      };
    });

    return data;
  };

  // Generate sample transactions for a specific month
  const generateSampleTransactions = (monthYear: string): Transaction[] => {
    const [year, month] = monthYear.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];

    const baseTransactions = [
      { name: 'Grocery Shopping', amount: 450000, type: 'expense' as const, category: 'Food & Dining' },
      { name: 'Salary', amount: 8500000, type: 'income' as const, category: 'Income' },
      { name: 'Gas Station', amount: 200000, type: 'expense' as const, category: 'Transportation' },
      { name: 'Online Shopping', amount: 350000, type: 'expense' as const, category: 'Shopping' },
      { name: 'Movie Ticket', amount: 80000, type: 'expense' as const, category: 'Entertainment' },
    ];

    return baseTransactions.map((transaction, index) => ({
      id: index + 1,
      name: transaction.name,
      date: `${year}-${month}-${String(25 - index).padStart(2, '0')}`,
      formatted_date: `${monthName} ${25 - index}, ${year}`,
      amount: transaction.amount,
      formatted_amount: formatCurrency(transaction.amount),
      type: transaction.type,
      category: transaction.category
    }));
  };

  const monthlyData: Record<string, MonthlyData> = generateMonthlyData();

  // Helper function untuk format bulan
  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setDataLoaded(false); // Show skeleton during refresh

    // Simulate API call with 2 second timeout
    setTimeout(() => {
      setDataLoaded(true);
      setRefreshing(false);
    }, 2000);
  };

  
  const handleMonthSelect = (monthYear: string) => {
    setSelectedMonth(monthYear);
    setPeriodModalVisible(false);
    setDataLoaded(false); // Show skeleton during month change

    // Simulate loading new data with 2 second timeout
    setTimeout(() => {
      setDataLoaded(true);
    }, 2000);
  };

  const handleExportReport = () => {
    setEmailModalVisible(true);
    // Set default email from user data
    if (user?.email) {
      setEmailInput(user.email);
    }
  };

  const handleSendEmail = () => {
    if (!emailInput.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setEmailModalVisible(false);

    // Show loading state
    Alert.alert('Sending Report', `Sending financial report to ${emailInput}...`);

    // Simulate sending email
    setTimeout(() => {
      Alert.alert(
        'Success',
        `Financial report for ${formatMonthYear(selectedMonth)} has been sent to ${emailInput}`,
        [{ text: 'OK' }]
      );
      setEmailInput('');
    }, 2000);
  };

  const getTransactionColor = (type: 'income' | 'expense') => {
    return type === 'income' ? '#10b981' : '#ef4444';
  };

  const getTransactionIcon = (type: 'income' | 'expense'): string => {
    return type === 'income' ? 'arrow-down' : 'arrow-up';
  };

  // Get current month data
  const currentMonthData: MonthlyData = monthlyData[selectedMonth] || monthlyData[Object.keys(monthlyData)[0]];

  // Simulate initial data loading
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setDataLoaded(true);
      }, 2000); // 2 second initial load simulation

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.authText}>Please login first</Text>
        </View>
      </PaperProvider>
    );
  }

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
            <Ionicons name="document-text" size={24} color="#6366f1" style={commonStyles.headerIcon} />
            <Text style={commonStyles.headerTitle}>Financial Reports</Text>
          </View>

          {/* Period Selector */}
          {dataLoaded ? (
            <Card style={styles.periodCard}>
              <Card.Content style={styles.periodContent}>
                <TouchableOpacity
                  style={styles.periodSelector}
                  onPress={() => setPeriodModalVisible(true)}
                >
                  <View style={styles.periodInfo}>
                    <Ionicons name="calendar" size={20} color="#6366f1" />
                    <Text style={styles.periodText}>{formatMonthYear(selectedMonth)}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ) : (
            <ReportsPeriodSkeleton style={styles.periodCard} />
          )}

          {/* Financial Summary */}
          <View style={styles.summarySection}>
            {dataLoaded ? (
              <Card style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                  {currentMonthData.financialItems.map((item, index) => (
                    <View key={item.id}>
                      <View style={styles.financialItem}>
                        <View style={styles.financialLeft}>
                          <View style={[styles.financialIcon, { backgroundColor: item.color }]}>
                            <Ionicons name={item.icon as any} size={16} color="white" />
                          </View>
                          <View style={styles.financialInfo}>
                            <Text style={styles.financialName}>{item.name}</Text>
                            <Text style={styles.financialAmount}>
                              {formatCurrency(item.amount)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.financialRight}>
                          <Text style={styles.financialPercentage}>{item.percentage}%</Text>
                        </View>
                      </View>
                      {index < currentMonthData.financialItems.length - 1 && (
                        <Divider style={styles.financialDivider} />
                      )}
                    </View>
                  ))}
                </Card.Content>
              </Card>
            ) : (
              <ReportsSummarySkeleton style={styles.summaryCard} />
            )}
          </View>

  
          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              {dataLoaded && (
                <TouchableOpacity onPress={() => navigation.navigate('AllTransactions')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              )}
            </View>

            {dataLoaded ? (
              <Card style={styles.transactionsCard}>
                <Card.Content style={styles.transactionsCardContent}>
                  {currentMonthData.recentTransactions.map((transaction, index) => (
                    <View key={transaction.id}>
                      <View style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                          <View style={[
                            styles.transactionIcon,
                            { backgroundColor: getTransactionColor(transaction.type) }
                          ]}>
                            <Ionicons
                              name={getTransactionIcon(transaction.type) as any}
                              size={16}
                              color="white"
                            />
                          </View>
                          <View style={styles.transactionInfo}>
                            <Text style={styles.transactionName}>{transaction.name}</Text>
                            <Text style={styles.transactionDate}>
                              {transaction.formatted_date}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.transactionRight}>
                          <Text style={[
                            styles.transactionAmount,
                            { color: getTransactionColor(transaction.type) }
                          ]}>
                            {transaction.formatted_amount}
                          </Text>
                        </View>
                      </View>
                      {index < currentMonthData.recentTransactions.length - 1 && (
                        <Divider style={styles.transactionDivider} />
                      )}
                    </View>
                  ))}
                </Card.Content>
              </Card>
            ) : (
              <ReportsTransactionsSkeleton style={styles.transactionsCard} />
            )}
          </View>

        </ScrollView>
      </SafeAreaView>

      <FAB
        icon="send"
        color="#ffffff"
        style={[styles.fab, {
          bottom: -6
        }]}
        onPress={handleExportReport}
      />

      {/* Period Selection Modal */}
      <Modal
        visible={periodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPeriodModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setPeriodModalVisible(false)}
          />

          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20 }}>
            <Text style={{ textAlign: 'center', padding: 16, color: '#6b7280', fontSize: 13 }}>
              Select Month
            </Text>

            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 12, marginLeft: 4 }}>Select Month</Text>
              {Object.keys(monthlyData).map((monthYear) => (
                <TouchableOpacity
                  key={monthYear}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: selectedMonth === monthYear ? '#f0f9ff' : '#f9fafb', marginBottom: 8 }}
                  onPress={() => handleMonthSelect(monthYear)}
                >
                  <Ionicons name={selectedMonth === monthYear ? 'checkmark-circle' : 'radio-button-off'} size={24} color={selectedMonth === monthYear ? '#3b82f6' : '#9ca3af'} style={{ marginRight: 16 }} />
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{formatMonthYear(monthYear)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
              <FormButton
                title="Cancel"
                variant="outline"
                fullWidth
                onPress={() => setPeriodModalVisible(false)}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Email Modal */}
      <Modal
        visible={emailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setEmailModalVisible(false)}
          />

          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 14 }}>
            <Text style={{ textAlign: 'center', padding: 16, color: '#6b7280', fontSize: 13 }}>
              Send Report via Email
            </Text>

            <View style={{ paddingHorizontal: 20 }}>
              <TextInput
                label="Email Address"
                value={emailInput}
                onChangeText={setEmailInput}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.emailInput}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                left={<TextInput.Icon icon="email-outline" color="#6b7280" />}
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <FormButton
                  title="Cancel"
                  variant="outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => setEmailModalVisible(false)}
                />
                <FormButton
                  title="Send"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={handleSendEmail}
                  icon="send"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  emailInput: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  periodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  periodContent: {
    paddingVertical: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  summarySection: {
    marginBottom: 24,
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
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  financialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  financialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  financialInfo: {
    flex: 1,
  },
  financialName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  financialAmount: {
    fontSize: 12,
    color: '#6b7280',
  },
  financialRight: {
    alignItems: 'flex-end',
  },
  financialPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  financialDivider: {
    marginVertical: 0,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionsCardContent: {
    paddingVertical: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
    maxWidth: '60%',
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionDivider: {
    marginVertical: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 30,
  },
  transactionItemLast: {
    paddingBottom: 0,
  },
});

export default ReportsScreen;
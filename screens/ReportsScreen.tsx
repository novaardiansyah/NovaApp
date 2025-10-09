import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, StatusBar, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Divider, TextInput, FAB, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { ReportsPeriodSkeleton, ReportsSummarySkeleton, FormButton, Notification } from '@/components';
import { styles } from '@/styles/ReportScreen.styles'
import PaymentService from '@/services/paymentService';

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

interface DailySummary {
  date: string;
  income: number;
  expenses: number;
  transfers: number;
  withdrawals: number;
  balance: number;
}

interface WeeklySummary {
  week: string;
  income: number;
  expenses: number;
  transfers: number;
  withdrawals: number;
  balance: number;
}

interface MonthlyData {
  income: number;
  expenses: number;
  transfers: number;
  withdrawals: number;
  balance: number;
  financialItems: FinancialItem[];
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const { isAuthenticated, user, token } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [periodModalVisible, setPeriodModalVisible] = useState(false)
  const [emailModalVisible, setEmailModalVisible] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const initialFormData = {
    email: '',
    periode: '',
    periodeStr: ''
  };

  const initialErrors = {
    email: '',
    periode: '',
    periodeStr: ''
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState(initialErrors)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };
  
  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    const year        = currentDate.getFullYear();
    const month       = String(currentDate.getMonth() + 1).padStart(2, '0');

    const selected = `${year}-${month}`
    setFormData(prev => ({ ...prev, periode: selected, periodeStr: formatMonthYear(selected) }))
    
    return selected
  });

  const getMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 

    const options = [];

    for (let i = 3; i >= 1; i--) {
      const date = new Date(currentYear, currentMonth - i - 1, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      options.push(`${year}-${month}`);
    }

    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    options.push(currentMonthStr);

    for (let i = 1; i <= 3; i++) {
      const date = new Date(currentYear, currentMonth + i - 1, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      options.push(`${year}-${month}`);
    }

    return options;
  };

  const generateMonthlyData = () => {
    const monthOptions = getMonthOptions();
    const data: Record<string, MonthlyData> = {};

    const baseData: Record<string, Omit<MonthlyData, 'financialItems' | 'recentTransactions'>> = {};

    const currentDate  = new Date();
    const currentYear  = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentYear, currentMonth + i - 1, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;

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
      
      if (!base) return;
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
        };
    });

    return data;
  };

  const monthlyData: Record<string, MonthlyData> = generateMonthlyData();

  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateDailySummary = (): DailySummary[] => {
    const today = getCurrentDate();
    const income = 2500000;
    const expenses = 1200000;
    const transfers = 800000;
    const withdrawals = 500000;
    const balance = income - expenses - transfers - withdrawals;

    return [
      { date: today, income, expenses, transfers, withdrawals, balance }
    ];
  };

  const generateWeeklySummary = (): WeeklySummary[] => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalTransfers = 0;
    let totalWithdrawals = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayIncome = i === 6 ? 8500000 : Math.random() > 0.7 ? 2500000 : 0;
      const dayExpenses = 800000 + Math.random() * 1500000;
      const dayTransfers = Math.random() > 0.5 ? 500000 + Math.random() * 1000000 : 0;
      const dayWithdrawals = Math.random() > 0.6 ? 300000 + Math.random() * 700000 : 0;

      totalIncome += dayIncome;
      totalExpenses += dayExpenses;
      totalTransfers += dayTransfers;
      totalWithdrawals += dayWithdrawals;
    }

    const balance = totalIncome - totalExpenses - totalTransfers - totalWithdrawals;

    return [
      {
        week: 'Last 7 Days',
        income: Math.round(totalIncome),
        expenses: Math.round(totalExpenses),
        transfers: Math.round(totalTransfers),
        withdrawals: Math.round(totalWithdrawals),
        balance: Math.round(balance)
      }
    ];
  };

  const dailySummary: DailySummary[] = generateDailySummary();
  const weeklySummary: WeeklySummary[] = generateWeeklySummary();

  const handleRefresh = async () => {
    setRefreshing(true);
    setDataLoaded(false);

    setTimeout(() => {
      setDataLoaded(true);
      setRefreshing(false);
    }, 100);
  };

  const handleMonthSelect = (monthYear: string) => {
    setSelectedMonth(monthYear);
    setPeriodModalVisible(false);
    setDataLoaded(false);

    setTimeout(() => {
      setDataLoaded(true);
    }, 100);
  };

  const handleExportReport = () => {
    setEmailModalVisible(true);
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }))
    }
  };

  const handleSendEmail = async () => {
    if (!token || submitting) return;

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      return
    }

    try {
      setSubmitting(true);
      const response = await PaymentService.submitMonthlyReport(token, formData.email, formData.periode);

      if (response.success) {
        setNotification('Monthly report submitted successfully');
        setEmailModalVisible(false);
        setFormData(initialFormData);
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
          Alert.alert('Error', response.message || 'Failed to submit report. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting monthly report:', error);
      setSubmitting(false);
      Alert.alert('Error', 'Failed to submit report');
    }
  }

  const currentMonthData: MonthlyData = monthlyData[selectedMonth] || monthlyData[Object.keys(monthlyData)[0]];

  useEffect(() => {
    if (isAuthenticated) {
      setDataLoaded(true);
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
          <View style={commonStyles.header}>
            <Ionicons name="document-text" size={24} color="#6366f1" style={commonStyles.headerIcon} />
            <Text style={commonStyles.headerTitle}>Financial Reports</Text>
          </View>

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

          <View style={styles.dailySection}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            {dataLoaded ? (
              <Card style={styles.dailyCard}>
                <Card.Content style={styles.dailyContent}>
                  {dailySummary.map((day, index) => (
                    <View key={day.date}>
                      <View style={styles.dailyItem}>
                        <View style={styles.dailyLeft}>
                          <View style={styles.dailyIconContainer}>
                            <Ionicons name="arrow-down" size={16} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Income</Text>
                        </View>
                        <View style={styles.dailyRight}>
                          <Text style={[styles.dailyAmount, { color: '#10b981' }]}>
                            {formatCurrency(day.income)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.dailyDivider} />

                      <View style={styles.dailyItem}>
                        <View style={styles.dailyLeft}>
                          <View style={[styles.dailyIconContainer, { backgroundColor: '#ef4444' }]}>
                            <Ionicons name="arrow-up" size={16} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Expenses</Text>
                        </View>
                        <View style={styles.dailyRight}>
                          <Text style={[styles.dailyAmount, { color: '#ef4444' }]}>
                            {formatCurrency(day.expenses)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.dailyDivider} />

                      <View style={styles.dailyItem}>
                        <View style={styles.dailyLeft}>
                          <View style={[styles.dailyIconContainer, { backgroundColor: '#3b82f6' }]}>
                            <Ionicons name="swap-horizontal-outline" size={16} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Transfers</Text>
                        </View>
                        <View style={styles.dailyRight}>
                          <Text style={[styles.dailyAmount, { color: '#3b82f6' }]}>
                            {formatCurrency(day.transfers)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.dailyDivider} />

                      <View style={styles.dailyItem}>
                        <View style={styles.dailyLeft}>
                          <View style={[styles.dailyIconContainer, { backgroundColor: '#f59e0b' }]}>
                            <Ionicons name="arrow-down-circle-outline" size={16} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Withdrawals</Text>
                        </View>
                        <View style={styles.dailyRight}>
                          <Text style={[styles.dailyAmount, { color: '#f59e0b' }]}>
                            {formatCurrency(day.withdrawals)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.dailyDivider} />

                      <View style={styles.dailyItem}>
                        <View style={styles.dailyLeft}>
                          <Text style={styles.dailyLabel}>Balance</Text>
                        </View>
                        <View style={styles.dailyRight}>
                          <Text style={[styles.dailyBalance, day.balance >= 0 ? { color: '#10b981' } : { color: '#ef4444' }]}>
                            {formatCurrency(day.balance)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            ) : (
              <ReportsSummarySkeleton style={styles.dailyCard} />
            )}
          </View>

          <View style={styles.weeklySection}>
            <Text style={styles.sectionTitle}>Last 7 Days Summary</Text>
            {dataLoaded ? (
              <Card style={styles.weeklyCard}>
                <Card.Content style={styles.weeklyContent}>
                  {weeklySummary.map((week, index) => (
                    <View key={week.week}>
                      <View style={styles.weeklyItem}>
                        <View style={styles.weeklyLeft}>
                          <View style={styles.weeklyIconContainer}>
                            <Ionicons name="arrow-down" size={16} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Income</Text>
                        </View>
                        <View style={styles.weeklyRight}>
                          <Text style={[styles.weeklyAmount, { color: '#10b981' }]}>
                            {formatCurrency(week.income)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.weeklyDivider} />

                      <View style={styles.weeklyItem}>
                        <View style={styles.weeklyLeft}>
                          <View style={[styles.weeklyIconContainer, { backgroundColor: '#ef4444' }]}>
                            <Ionicons name="arrow-up" size={16} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Expenses</Text>
                        </View>
                        <View style={styles.weeklyRight}>
                          <Text style={[styles.weeklyAmount, { color: '#ef4444' }]}>
                            {formatCurrency(week.expenses)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.weeklyDivider} />

                      <View style={styles.weeklyItem}>
                        <View style={styles.weeklyLeft}>
                          <View style={[styles.weeklyIconContainer, { backgroundColor: '#3b82f6' }]}>
                            <Ionicons name="swap-horizontal-outline" size={16} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Transfers</Text>
                        </View>
                        <View style={styles.weeklyRight}>
                          <Text style={[styles.weeklyAmount, { color: '#3b82f6' }]}>
                            {formatCurrency(week.transfers)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.weeklyDivider} />

                      <View style={styles.weeklyItem}>
                        <View style={styles.weeklyLeft}>
                          <View style={[styles.weeklyIconContainer, { backgroundColor: '#f59e0b' }]}>
                            <Ionicons name="arrow-down-circle-outline" size={16} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Withdrawals</Text>
                        </View>
                        <View style={styles.weeklyRight}>
                          <Text style={[styles.weeklyAmount, { color: '#f59e0b' }]}>
                            {formatCurrency(week.withdrawals)}
                          </Text>
                        </View>
                      </View>
                      <Divider style={styles.weeklyDivider} />

                      <View style={styles.weeklyItem}>
                        <View style={styles.weeklyLeft}>
                          <Text style={styles.weeklyLabel}>Balance</Text>
                        </View>
                        <View style={styles.weeklyRight}>
                          <Text style={[styles.weeklyBalance, week.balance >= 0 ? { color: '#10b981' } : { color: '#ef4444' }]}>
                            {formatCurrency(week.balance)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            ) : (
              <ReportsSummarySkeleton style={styles.weeklyCard} />
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
                label="Report periode"
                placeholder="Report periode"
                value={formData.periodeStr}
                onChangeText={(value) => handleInputChange('periodeStr', value)}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                left={<TextInput.Icon icon="calendar-month" color="#6b7280" />}
              />
              {errors.periodeStr && <HelperText type="error" style={styles.helperText}>{errors.periodeStr}</HelperText>}

              <TextInput
                label="Email address"
                placeholder="Email address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                left={<TextInput.Icon icon="email-outline" color="#6b7280" />}
              />
              {errors.email && <HelperText type="error" style={styles.helperText}>{errors.email}</HelperText>}

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <FormButton
                  title="Cancel"
                  variant="outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => setEmailModalVisible(false)}
                  loading={submitting}
                />

                <FormButton
                  title="Send"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={handleSendEmail}
                  icon="send"
                  loading={submitting}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null)
          setSubmitting(false)
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  );
};

export default ReportsScreen;
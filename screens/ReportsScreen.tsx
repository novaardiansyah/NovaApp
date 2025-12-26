import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Divider, FAB, Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-gifted-charts';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { commonStyles, formatCurrency, typography } from '@/styles';
import { ReportsPeriodSkeleton, ReportsSummarySkeleton, ReportsListSkeleton, FormButton } from '@/components';
import { styles } from '@/styles/ReportScreen.styles'
import PaymentService, { PaymentSummaryData } from '@/services/paymentService';

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

interface SummaryData {
  monthly: PaymentSummaryData | null;
  weekly: PaymentSummaryData | null;
  daily: PaymentSummaryData | null;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ navigation }) => {
  const { isAuthenticated, token } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [periodModalVisible, setPeriodModalVisible] = useState(false)
  const [summaryData, setSummaryData] = useState<SummaryData>({
    monthly: null,
    weekly: null,
    daily: null
  })
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false)

  const [formData, setFormData] = useState({
    periode: '',
    periodeStr: ''
  })

  const formatMonthYear = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const saveSelectedMonth = (selected: string) => {
    setFormData(prev => ({ ...prev, periode: selected, periodeStr: formatMonthYear(selected) }))
  }

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    const selected = `${year}-${month}`
    saveSelectedMonth(selected)
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

  const fetchPaymentSummary = async (startDate: string, endDate: string): Promise<PaymentSummaryData | null> => {
    if (!token) return null;

    try {
      const response = await PaymentService.getPaymentSummary(token, startDate, endDate);
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching payment summary:', error);
    }
    return null;
  };

  const fetchAllSummaries = async () => {
    if (!token) return;

    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      const [selectedYear, selectedMonthNum] = selectedMonth.split('-');
      const monthStart = new Date(parseInt(selectedYear), parseInt(selectedMonthNum) - 1, 1);
      const monthEnd = new Date(parseInt(selectedYear), parseInt(selectedMonthNum), 0);
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const monthEndStr = monthEnd.toISOString().split('T')[0];

      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        fetchPaymentSummary(todayStr, todayStr),
        fetchPaymentSummary(sevenDaysAgoStr, todayStr),
        fetchPaymentSummary(monthStartStr, monthEndStr)
      ]);

      setSummaryData({
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData
      });
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };

  const convertPaymentSummaryToMonthlyData = (summary: PaymentSummaryData): MonthlyData => {
    return {
      income: summary.income,
      expenses: summary.expenses,
      transfers: summary.transfer,
      withdrawals: summary.withdrawal,
      balance: summary.total_balance,
      financialItems: [
        {
          id: 1,
          name: 'Pemasukan',
          amount: summary.income,
          percentage: summary.percents.income,
          color: '#10b981',
          icon: 'arrow-down'
        },
        {
          id: 2,
          name: 'Pengeluaran',
          amount: summary.expenses,
          percentage: summary.percents.expenses,
          color: '#ef4444',
          icon: 'arrow-up'
        },
        {
          id: 3,
          name: 'Transfer',
          amount: summary.transfer,
          percentage: summary.percents.transfer,
          color: '#3b82f6',
          icon: 'swap-horizontal-outline'
        },
        {
          id: 4,
          name: 'Penarikan',
          amount: summary.withdrawal,
          percentage: summary.percents.withdrawal,
          color: '#f59e0b',
          icon: 'arrow-down-circle-outline'
        },
      ],
    };
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDailySummaryFromData = (): DailySummary[] => {
    if (!summaryData.daily) return [];

    const today = getCurrentDate();
    const { income, expenses, transfer: transfers, withdrawal: withdrawals, initial_balance: balance } = summaryData.daily;

    return [
      { date: today, income, expenses, transfers, withdrawals, balance }
    ];
  };

  const getWeeklySummaryFromData = (): WeeklySummary[] => {
    if (!summaryData.weekly) return [];

    const { income, expenses, transfer: transfers, withdrawal: withdrawals, initial_balance: balance } = summaryData.weekly;

    return [
      {
        week: '7 Hari Terakhir',
        income,
        expenses,
        transfers,
        withdrawals,
        balance
      }
    ];
  };

  const dailySummary: DailySummary[] = getDailySummaryFromData();
  const weeklySummary: WeeklySummary[] = getWeeklySummaryFromData();

  const handleRefresh = async () => {
    setRefreshing(true);
    setIsDataLoading(true);
    setIsMonthlyLoading(true);

    try {
      await fetchAllSummaries();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
      setIsDataLoading(false);
      setIsMonthlyLoading(false);
    }
  };

  const handleMonthSelect = async (monthYear: string) => {
    setPeriodModalVisible(false)
    setIsMonthlyLoading(true)

    saveSelectedMonth(monthYear)
    setSelectedMonth(monthYear)

    if (token) {
      const [year, month] = monthYear.split('-');
      const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthEnd = new Date(parseInt(year), parseInt(month), 0);
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const monthEndStr = monthEnd.toISOString().split('T')[0];

      const monthlyData = await fetchPaymentSummary(monthStartStr, monthEndStr);

      setSummaryData(prev => ({
        ...prev,
        monthly: monthlyData
      }));
    }

    setIsMonthlyLoading(false)
  };

  const currentMonthData: MonthlyData = summaryData.monthly ? convertPaymentSummaryToMonthlyData(summaryData.monthly) : {
    income: 0,
    expenses: 0,
    transfers: 0,
    withdrawals: 0,
    balance: 0,
    financialItems: []
  };

  useEffect(() => {
    if (isAuthenticated) {
      const initializeData = async () => {
        setIsDataLoading(true);
        setIsMonthlyLoading(true);
        await fetchAllSummaries();
        setIsDataLoading(false);
        setIsMonthlyLoading(false);
      };

      initializeData();
    }
  }, [isAuthenticated]);


  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.authText}>Silakan login terlebih dahulu</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={Theme}>
      <View style={commonStyles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Laporan Keuangan" titleStyle={typography.appbar.titleNormal} />
        </Appbar.Header>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >

          {!isMonthlyLoading ? (
            <Card style={styles.periodCard}>
              <Card.Content style={styles.periodContent}>
                <TouchableOpacity
                  style={styles.periodSelector}
                  onPress={() => setPeriodModalVisible(true)}
                >
                  <View style={styles.periodInfo}>
                    <Ionicons name="calendar" size={18} color="#6366f1" />
                    <Text style={styles.periodText}>{formatMonthYear(selectedMonth)}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ) : (
            <ReportsPeriodSkeleton style={styles.periodCard} />
          )}

          <View style={styles.summarySection}>
            {!isMonthlyLoading ? (
              <Card style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={currentMonthData.financialItems.map(item => ({
                        value: item.percentage > 0 ? item.percentage : 0,
                        color: item.color,
                        text: `${item.percentage}%`,
                      }))}
                      donut
                      radius={80}
                      innerRadius={55}
                      innerCircleColor={'#ffffff'}
                      centerLabelComponent={() => (
                        <View style={styles.chartCenter}>
                          <Text style={styles.chartCenterLabel}>Total</Text>
                          <Text style={styles.chartCenterValue}>
                            {formatCurrency(currentMonthData.balance)}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                  <View style={styles.chartLegend}>
                    {currentMonthData.financialItems.map((item) => (
                      <View key={item.id} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <View style={styles.legendTextContainer}>
                          <Text style={styles.legendLabel}>{item.name}</Text>
                          <Text style={styles.legendValue}>{formatCurrency(item.amount)}</Text>
                        </View>
                        <Text style={styles.legendPercentage}>{item.percentage}%</Text>
                      </View>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            ) : (
              <ReportsSummarySkeleton style={styles.summaryCard} />
            )}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.sectionTitle}>Ringkasan Hari Ini</Text>
            {!isDataLoading && !refreshing ? (
              <Card style={styles.dailyCard}>
                <Card.Content style={styles.dailyContent}>
                  {dailySummary.map((day, index) => (
                    <View key={day.date}>
                      <View style={styles.dailyItem}>
                        <View style={styles.dailyLeft}>
                          <View style={styles.dailyIconContainer}>
                            <Ionicons name="arrow-down" size={14} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Pemasukan</Text>
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
                            <Ionicons name="arrow-up" size={14} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Pengeluaran</Text>
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
                            <Ionicons name="swap-horizontal-outline" size={14} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Transfer</Text>
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
                            <Ionicons name="arrow-down-circle-outline" size={14} color="white" />
                          </View>
                          <Text style={styles.dailyLabel}>Penarikan</Text>
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
                          <Text style={styles.dailyLabel}>Saldo</Text>
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
              <ReportsListSkeleton style={styles.dailyCard} />
            )}
          </View>

          <View style={styles.weeklySection}>
            <Text style={styles.sectionTitle}>Ringkasan 7 Hari Terakhir</Text>
            {!isDataLoading && !refreshing ? (
              <Card style={styles.weeklyCard}>
                <Card.Content style={styles.weeklyContent}>
                  {weeklySummary.map((week, index) => (
                    <View key={week.week}>
                      <View style={styles.weeklyItem}>
                        <View style={styles.weeklyLeft}>
                          <View style={styles.weeklyIconContainer}>
                            <Ionicons name="arrow-down" size={14} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Pemasukan</Text>
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
                            <Ionicons name="arrow-up" size={14} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Pengeluaran</Text>
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
                            <Ionicons name="swap-horizontal-outline" size={14} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Transfer</Text>
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
                            <Ionicons name="arrow-down-circle-outline" size={14} color="white" />
                          </View>
                          <Text style={styles.weeklyLabel}>Penarikan</Text>
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
                          <Text style={styles.weeklyLabel}>Saldo</Text>
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
              <ReportsListSkeleton style={styles.weeklyCard} />
            )}
          </View>


        </ScrollView>
      </View>

      <FAB
        icon="file-document-outline"
        color="#ffffff"
        style={[styles.fab, {
          bottom: -6
        }]}
        onPress={() => navigation.navigate('GenerateReport')}
      />

      <Modal
        visible={periodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPeriodModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setPeriodModalVisible(false)}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Pilih Bulan
            </Text>

            <View style={styles.modalActionsContainer}>
              {getMonthOptions().map((monthYear) => (
                <TouchableOpacity
                  key={monthYear}
                  style={[styles.modalActionButton, selectedMonth === monthYear && styles.modalActionButtonSelected]}
                  onPress={() => handleMonthSelect(monthYear)}
                >
                  <Ionicons name={selectedMonth === monthYear ? 'checkmark-circle' : 'radio-button-off'} size={20} color={selectedMonth === monthYear ? '#3b82f6' : '#9ca3af'} style={styles.modalActionIcon} />
                  <Text style={styles.modalActionText}>{formatMonthYear(monthYear)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setPeriodModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </PaperProvider>
  );
};

export default ReportsScreen;
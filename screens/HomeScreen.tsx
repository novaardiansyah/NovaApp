import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, RefreshControl, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Button, Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/colors';
import { BalanceCardSkeleton, HomeTransactionsSkeleton } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { styles as homeStyles, getTransactionColor, getTransactionIcon } from '@/styles/HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, fetchFinancialData, fetchRecentTransactions } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [financialData, setFinancialData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFinancialData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const [financial, transactions] = await Promise.all([
        fetchFinancialData(),
        fetchRecentTransactions(5)
      ]);

      setFinancialData(financial);
      setRecentTransactions(transactions || []);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFinancialData();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setFinancialData(null); // Reset financial data to show skeleton
    setRecentTransactions([]); // Reset transactions
    setLoading(true); // Set loading state
    await loadFinancialData();
    setRefreshing(false);
  };

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Text>Please login first</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            Go to Login
          </Button>
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
          {/* Welcome Header */}
          <View style={commonStyles.welcomeSection}>
            <View>
              <Text style={commonStyles.welcomeText}>Welcome back,</Text>
              <Text style={commonStyles.userName}>{user?.name || 'User'}</Text>
            </View>
            {user?.avatar_url ? (
              <Avatar.Image size={48} source={{ uri: user.avatar_url }} style={commonStyles.avatar} />
            ) : (
              <Avatar.Icon size={48} icon="account" style={commonStyles.avatar} />
            )}
          </View>

          {/* Balance Card */}
          {financialData ? (
            <Card style={homeStyles.balanceCard}>
              <LinearGradient
                colors={['#4338ca', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={homeStyles.gradientBackground}
              >
                <Card.Content style={homeStyles.balanceCardContent}>
                  <Text style={homeStyles.balanceLabel}>Total Balance</Text>
                  <Text style={homeStyles.balanceAmount}>
                    {formatCurrency(financialData.total_balance)}
                  </Text>
                  <View style={homeStyles.balanceRow}>
                    <View style={homeStyles.balanceItem}>
                      <Text style={homeStyles.incomeText}>
                        {formatCurrency(financialData.income)}
                      </Text>
                      <Text style={homeStyles.balanceItemLabel}>Income</Text>
                    </View>
                    <View style={homeStyles.balanceItemRight}>
                      <Text style={homeStyles.expenseText}>
                        {formatCurrency(financialData.expenses)}
                      </Text>
                      <Text style={homeStyles.balanceItemLabel}>Expenses</Text>
                    </View>
                  </View>
                </Card.Content>
              </LinearGradient>
            </Card>
          ) : (
            <BalanceCardSkeleton style={homeStyles.balanceCard} />
          )}

          {/* Quick Actions */}
          <View style={commonStyles.quickActionsSection}>
            <Text style={commonStyles.sectionTitle}>Quick Actions</Text>
            <View style={commonStyles.quickActionsGrid}>
              <Card style={commonStyles.actionCard} onPress={() => Alert.alert('Info', 'Add Transaction feature coming soon!')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="add-circle" size={24} color="#6366f1" />
                  <Text style={commonStyles.actionText}>Add</Text>
                </Card.Content>
              </Card>

              <Card style={commonStyles.actionCard} onPress={() => Alert.alert('Info', 'Transfer feature coming soon!')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="swap-horizontal" size={24} color="#6366f1" />
                  <Text style={commonStyles.actionText}>Transfer</Text>
                </Card.Content>
              </Card>

              <Card style={commonStyles.actionCard} onPress={() => Alert.alert('Info', 'Reports feature coming soon!')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="bar-chart" size={24} color="#6366f1" />
                  <Text style={commonStyles.actionText}>Reports</Text>
                </Card.Content>
              </Card>

              <Card style={commonStyles.actionCard} onPress={() => navigation.navigate('Budget')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="wallet" size={24} color="#6366f1" />
                  <Text style={commonStyles.actionText}>Budget</Text>
                </Card.Content>
              </Card>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={homeStyles.transactionsSection}>
            <View style={homeStyles.transactionsHeader}>
              <Text style={homeStyles.sectionTitle}>Recent Transactions</Text>
              <Text style={homeStyles.seeAllText} onPress={() => navigation.navigate('AllTransactions')}>See all</Text>
            </View>
            {loading ? (
              <HomeTransactionsSkeleton count={3} />
            ) : (
              <View style={homeStyles.transactionsCard}>
                {recentTransactions.length === 0 ? (
                  <View style={homeStyles.emptyCard}>
                    <Text style={homeStyles.emptyText}>No transactions yet</Text>
                  </View>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <View key={transaction.id}>
                      <Card style={homeStyles.transactionCard}>
                        <Card.Content style={homeStyles.transactionContent}>
                          <View style={homeStyles.transactionLeft}>
                            <View style={[
                              homeStyles.transactionIcon,
                              { backgroundColor: getTransactionColor(transaction.type) }
                            ]}>
                              <Ionicons
                                name={getTransactionIcon(transaction.type)}
                                size={16}
                                color="white"
                              />
                            </View>
                            <View style={homeStyles.transactionInfo}>
                              <Text style={homeStyles.transactionTitle} numberOfLines={1} ellipsizeMode="tail">{transaction.name || transaction.title}</Text>
                              <Text style={homeStyles.transactionDate}>{transaction.date}</Text>
                            </View>
                          </View>
                          <View style={homeStyles.transactionRight}>
                            <Text style={[
                              homeStyles.transactionAmount,
                              { color: getTransactionColor(transaction.type) }
                            ]}>
                              {formatCurrency(transaction.amount)}
                            </Text>
                          </View>
                        </Card.Content>
                      </Card>
                      {index < recentTransactions.length - 1 && (
                        <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default HomeScreen;
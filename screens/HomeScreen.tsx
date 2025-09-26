import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, RefreshControl } from 'react-native';
import { PaperProvider, Button, Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/colors';
import { BalanceCardSkeleton, TransactionsSkeleton } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { styles, getTransactionColor, getTransactionIcon } from '@/styles/HomeScreen.styles';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Welcome Header */}
          <View style={styles.welcomeSection}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            {user?.avatar_url ? (
              <Avatar.Image size={48} source={{ uri: user.avatar_url }} style={styles.avatar} />
            ) : (
              <Avatar.Icon size={48} icon="account" style={styles.avatar} />
            )}
          </View>

          {/* Balance Card */}
          {financialData ? (
            <Card style={styles.balanceCard}>
              <LinearGradient
                colors={['#4338ca', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
              >
                <Card.Content style={styles.balanceCardContent}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <Text style={styles.balanceAmount}>
                    {formatCurrency(financialData.total_balance)}
                  </Text>
                  <View style={styles.balanceRow}>
                    <View style={styles.balanceItem}>
                      <Text style={styles.incomeText}>
                        {formatCurrency(financialData.income)}
                      </Text>
                      <Text style={styles.balanceItemLabel}>Income</Text>
                    </View>
                    <View style={styles.balanceItemRight}>
                      <Text style={styles.expenseText}>
                        {formatCurrency(financialData.expenses)}
                      </Text>
                      <Text style={styles.balanceItemLabel}>Expenses</Text>
                    </View>
                  </View>
                </Card.Content>
              </LinearGradient>
            </Card>
          ) : (
            <BalanceCardSkeleton style={styles.balanceCard} />
          )}

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <Card style={styles.actionCard} onPress={() => Alert.alert('Info', 'Add Transaction feature coming soon!')}>
                <Card.Content style={styles.actionCardContent}>
                  <Ionicons name="add-circle" size={24} color="#6366f1" />
                  <Text style={styles.actionText}>Add</Text>
                </Card.Content>
              </Card>

              <Card style={styles.actionCard} onPress={() => Alert.alert('Info', 'Transfer feature coming soon!')}>
                <Card.Content style={styles.actionCardContent}>
                  <Ionicons name="swap-horizontal" size={24} color="#6366f1" />
                  <Text style={styles.actionText}>Transfer</Text>
                </Card.Content>
              </Card>

              <Card style={styles.actionCard} onPress={() => Alert.alert('Info', 'Reports feature coming soon!')}>
                <Card.Content style={styles.actionCardContent}>
                  <Ionicons name="bar-chart" size={24} color="#6366f1" />
                  <Text style={styles.actionText}>Reports</Text>
                </Card.Content>
              </Card>

              <Card style={styles.actionCard} onPress={() => Alert.alert('Info', 'Budget feature coming soon!')}>
                <Card.Content style={styles.actionCardContent}>
                  <Ionicons name="wallet" size={24} color="#6366f1" />
                  <Text style={styles.actionText}>Budget</Text>
                </Card.Content>
              </Card>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Text style={styles.seeAllText}>See all</Text>
            </View>
            {loading ? (
              <TransactionsSkeleton style={styles.transactionsCard} count={3} />
            ) : (
              <Card style={styles.transactionsCard}>
                {recentTransactions.length === 0 ? (
                  <Text style={styles.emptyText}>No transactions yet</Text>
                ) : (
                  recentTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon,
                        { backgroundColor: getTransactionColor(transaction.type) }
                      ]}>
                        <Ionicons
                          name={getTransactionIcon(transaction.type)}
                          size={16}
                          color="white"
                        />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionTitle} numberOfLines={1} ellipsizeMode="tail">{transaction.title}</Text>
                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(transaction.type) }
                    ]}>
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                  ))
                )}
              </Card>
            )}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default HomeScreen;
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, RefreshControl } from 'react-native';
import { PaperProvider, Button, Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/colors';
import { AppCopyright } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, token, logout, fetchUser, isAuthenticated, fetchFinancialData, fetchRecentTransactions } = useAuth();
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
    await Promise.all([
      fetchUser(),
      loadFinancialData()
    ]);
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Login');
          },
        },
      ]
    );
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
                  {financialData ? formatCurrency(financialData.total_balance) : 'Loading...'}
                </Text>
                <View style={styles.balanceRow}>
                  <View style={styles.balanceItem}>
                    <Text style={styles.incomeText}>
                      {financialData ? formatCurrency(financialData.income) : 'Loading...'}
                    </Text>
                    <Text style={styles.balanceItemLabel}>Income</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.expenseText}>
                      {financialData ? formatCurrency(financialData.expenses) : 'Loading...'}
                    </Text>
                    <Text style={styles.balanceItemLabel}>Expenses</Text>
                  </View>
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>

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
            <Card style={styles.transactionsCard}>
              {loading ? (
                <Text style={styles.loadingText}>Loading transactions...</Text>
              ) : recentTransactions.length === 0 ? (
                <Text style={styles.emptyText}>No transactions yet</Text>
              ) : (
                recentTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon,
                        {
                          backgroundColor:
                            transaction.type === 'income' ? '#10b981' : // Green for income
                            transaction.type === 'expense' ? '#ef4444' :
                            '#3b82f6' // Blue for transfer and withdrawal
                        }
                      ]}>
                        <Ionicons
                          name={
                            transaction.type === 'income' ? 'arrow-down' :
                            transaction.type === 'expense' ? 'arrow-up' :
                            transaction.type === 'transfer' ? 'swap-horizontal' :
                            'arrow-down' // Arrow down blue for withdrawal
                          }
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
                      {
                        color:
                          transaction.type === 'income' ? '#10b981' : // Green for income
                          transaction.type === 'expense' ? '#ef4444' :
                          '#3b82f6' // Blue for transfer and withdrawal
                      }
                    ]}>
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                ))
              )}
            </Card>
          </View>

          <AppCopyright />
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    minHeight: '100%',
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  avatar: {
    backgroundColor: '#6366f1',
  },
  balanceCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientBackground: {
    borderRadius: 16,
    padding: 0,
  },
  balanceCardContent: {
    padding: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  incomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d1fae5',
    marginBottom: 4,
  },
  expenseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fee2e2',
    marginBottom: 4,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  actionCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 8,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  transactionsCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
    fontSize: 14,
  },
});

export default HomeScreen;
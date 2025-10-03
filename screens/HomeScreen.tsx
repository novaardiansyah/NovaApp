import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, RefreshControl, StatusBar, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Button, Avatar, Card, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/colors';
import { BalanceCardSkeleton } from '@/components';
import RecentTransactions from '@/components/RecentTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { styles as homeStyles } from '@/styles/HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';

interface HomeScreenProps {
  navigation: any;
  route?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, fetchFinancialData, fetchRecentTransactions, validateToken, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [financialData, setFinancialData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const validateUserToken = async (): Promise<boolean> => {
    if (!isAuthenticated || hasValidated) return false;

    try {
      const isValid = await validateToken();
      setHasValidated(true); // Mark as validated to prevent repeats

      if (!isValid) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                // Navigation will be handled automatically by RootNavigator
              },
            },
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      setHasValidated(true); // Still mark as validated to prevent repeats
      // Silently fail on network errors, don't block the user
      return true;
    }
  };

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
      // Reset validation state when auth status changes
      setHasValidated(false);
      // Validate token silently in background first
      validateUserToken();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && hasValidated) {
      // Load financial data only after token validation is complete
      loadFinancialData();
    }
  }, [isAuthenticated, hasValidated, route?.params?.refresh]);

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
              <Card style={commonStyles.actionCard} onPress={() => navigation.navigate('AddPayment')}>
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

              <Card style={commonStyles.actionCard} onPress={() => navigation.navigate('Reports')}>
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
          <RecentTransactions
            transactions={recentTransactions}
            loading={loading}
            onSeeAll={() => navigation.navigate('AllTransactions')}
          />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loginButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
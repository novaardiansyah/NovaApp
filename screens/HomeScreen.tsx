import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Button, Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/colors';
import { BalanceCardSkeleton } from '@/components';
import RecentTransactions from '@/components/RecentTransactions';
import { useAuth } from '@/contexts/AuthContext';
import TransactionService from '@/services/transactionService';
import { styles as homeStyles } from '@/styles/HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';

interface HomeScreenProps {
  navigation: any;
  route?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, token, validateToken, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [financialData, setFinancialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const validateUserToken = async (): Promise<boolean> => {
    if (!isAuthenticated || hasValidated) return false;

    try {
      const isValid = await validateToken();
      setHasValidated(true);

      if (!isValid) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
              },
            },
          ]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      setHasValidated(true);
      return true;
    }
  };

  const loadFinancialData = async () => {
    if (!isAuthenticated || !token) return;

    setLoading(true);
    try {
      const financial = await TransactionService.fetchFinancialData(token);
      setFinancialData(financial);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setHasValidated(false);
      validateUserToken();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && hasValidated) {
      loadFinancialData();
    }
  }, [isAuthenticated, hasValidated, route?.params?.refresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setFinancialData(null);
    setLoading(true);

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
                    {formatCurrency(financialData.total_after_scheduled)}
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

          <View style={commonStyles.quickActionsSection}>
            <Text style={commonStyles.sectionTitle}>Quick Actions</Text>
            <View style={commonStyles.quickActionsGrid}>
              <Card style={commonStyles.actionCard} onPress={() => navigation.navigate('AddPayment')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="add-circle" size={24} color="#6366f1" />
                  <Text style={commonStyles.actionText}>Add</Text>
                </Card.Content>
              </Card>

              <Card style={commonStyles.actionCard} onPress={() => navigation.navigate('Goals')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="trophy" size={24} color="#6366f1" />
                  <Text style={commonStyles.actionText}>Goals</Text>
                </Card.Content>
              </Card>

              <Card style={commonStyles.actionCard} onPress={() => navigation.navigate('Reports')}>
                <Card.Content style={commonStyles.actionCardContent}>
                  <Ionicons name="document-text" size={24} color="#6366f1" />
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

          <RecentTransactions
            loading={loading || refreshing}
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
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Button, Avatar, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/colors';
import { HomeBalanceCardSkeleton } from '@/components';
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
  const [loadingFinancial, setLoadingFinancial] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const validateUserToken = async (): Promise<boolean> => {
    if (!isAuthenticated || hasValidated) return false;

    try {
      const isValid = await validateToken();
      setHasValidated(true);

      if (!isValid) {
        Alert.alert(
          'Sesi Berakhir',
          'Sesi Anda telah berakhir. Silakan login kembali.',
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

    setLoadingFinancial(true);
    try {
      const financial = await TransactionService.fetchFinancialData(token);
      setFinancialData(financial);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoadingFinancial(false);
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

    await loadFinancialData();

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Text>Silakan login terlebih dahulu</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            Masuk ke Halaman Login
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
              <Text style={commonStyles.welcomeText}>Selamat datang kembali,</Text>
              <Text style={commonStyles.userName}>{user?.name || 'Pengguna'}</Text>
            </View>
            {user?.avatar_url ? (
              <Avatar.Image size={48} source={{ uri: user.avatar_url }} style={commonStyles.avatar} />
            ) : (
              <Avatar.Icon size={48} icon="account" style={commonStyles.avatar} />
            )}
          </View>

          {!loadingFinancial && financialData ? (
            <Card style={homeStyles.balanceCard}>
              <LinearGradient
                colors={['#4338ca', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={homeStyles.gradientBackground}
              >
                <Card.Content style={homeStyles.balanceCardContent}>
                  <Text style={homeStyles.balanceLabel}>Total Saldo Tersisa</Text>
                  <Text style={homeStyles.balanceAmount}>
                    {formatCurrency(financialData.total_after_scheduled)}
                  </Text>
                  <View style={homeStyles.balanceRow}>
                    <View style={homeStyles.balanceItem}>
                      <Text style={homeStyles.incomeText}>
                        {formatCurrency(financialData.income)}
                      </Text>
                      <Text style={homeStyles.balanceItemLabel}>Pemasukan</Text>
                    </View>
                    <View style={homeStyles.balanceItemRight}>
                      <Text style={homeStyles.expenseText}>
                        {formatCurrency(financialData.expenses)}
                      </Text>
                      <Text style={homeStyles.balanceItemLabel}>Pengeluaran</Text>
                    </View>
                  </View>
                </Card.Content>
              </LinearGradient>
            </Card>
          ) : (
            <HomeBalanceCardSkeleton style={homeStyles.balanceCard} />
          )}

          <RecentTransactions
            onSeeAll={() => navigation.getParent()?.navigate('AllTransactions')}
            refreshTrigger={refreshing}
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
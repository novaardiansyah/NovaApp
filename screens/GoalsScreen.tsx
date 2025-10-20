import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Divider, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, formatCurrency, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { Notification } from '@/components';
import { styles } from '@/styles/GoalsScreen.styles';
import PaymentService, { PaymentGoalsOverview } from '@/services/paymentService';

interface GoalsScreenProps {
  navigation: any;
}

interface Goal {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  target_date: string;
  status: 'active' | 'completed' | 'overdue';
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsOverview, setGoalsOverview] = useState<PaymentGoalsOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Dummy data for goals
  const dummyGoals: Goal[] = [
    {
      id: 1,
      name: 'Emergency Fund',
      description: 'Build emergency fund for unexpected expenses',
      target_amount: 50000000,
      current_amount: 35000000,
      start_date: '2024-01-01',
      target_date: '2024-12-31',
      status: 'active',
    },
    {
      id: 2,
      name: 'New Laptop',
      description: 'Save for new work laptop',
      target_amount: 15000000,
      current_amount: 15000000,
      start_date: '2024-01-01',
      target_date: '2024-06-30',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Vacation Fund',
      description: 'Family vacation to Bali',
      target_amount: 10000000,
      current_amount: 2500000,
      start_date: '2024-03-01',
      target_date: '2024-08-31',
      status: 'active',
    },
    {
      id: 4,
      name: 'Down Payment',
      description: 'House down payment',
      target_amount: 100000000,
      current_amount: 15000000,
      start_date: '2024-01-01',
      target_date: '2024-12-31',
      status: 'active',
    },
  ];

  const loadGoalsOverview = async () => {
    if (!token) return;

    setOverviewLoading(true);
    try {
      const response = await PaymentService.getPaymentGoalsOverview(token);
      
      if (response.success) {
        setGoalsOverview(response.data);
      } else {
        console.error('Failed to load goals overview:', response.message);
      }
    } catch (error) {
      console.error('Error loading goals overview:', error);
    } finally {
      setOverviewLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      // Load overview data
      await loadGoalsOverview();

      // Simulate API refresh for goals list
      setTimeout(() => {
        setGoals(dummyGoals);
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error refreshing goals:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateProgress = (goal: Goal): number => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const getGoalStatus = (goal: Goal): { status: string; color: string; dotStyle: any } => {
    const today = new Date();
    const targetDate = new Date(goal.target_date);
    const progress = calculateProgress(goal);

    if (progress >= 100) {
      return { status: 'Completed', color: '#6366f1', dotStyle: styles.statusCompleted };
    } else if (today > targetDate) {
      return { status: 'Overdue', color: '#ef4444', dotStyle: styles.statusOverdue };
    } else {
      return { status: 'Active', color: '#10b981', dotStyle: styles.statusActive };
    }
  };

  const calculateDaysRemaining = (targetDate: string): number => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadGoals();
      loadGoalsOverview();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAuthenticated) {
        loadGoals();
        loadGoalsOverview();
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

  const loadGoals = () => {
    setLoading(true);
    // Simulate initial data load
    setTimeout(() => {
      setGoals(dummyGoals);
      setLoading(false);
    }, 1000);
  };

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
            <Ionicons name="trophy" size={24} color="#6366f1" style={commonStyles.headerIcon} />
            <Text style={commonStyles.headerTitle}>Financial Goals</Text>
          </View>

          {/* Goals Overview */}
          {loading ? (
            /* Goals Overview Skeleton */
            <Card style={styles.goalsOverview}>
              <Card.Content style={styles.overviewContent}>
                <View style={{ height: 20, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 16, width: '40%' }} />
                <View style={styles.overviewStats}>
                  <View style={styles.statItem}>
                    <View style={{ height: 24, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 4, width: 30 }} />
                    <View style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 4, width: 40 }} />
                  </View>
                  <View style={styles.statItem}>
                    <View style={{ height: 24, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 4, width: 30 }} />
                    <View style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 4, width: 40 }} />
                  </View>
                  <View style={styles.statItem}>
                    <View style={{ height: 24, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 4, width: 30 }} />
                    <View style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 4, width: 40 }} />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.goalsOverview}>
              <Card.Content style={styles.overviewContent}>
                <Text style={styles.overviewTitle}>Goals Overview</Text>
                <View style={styles.overviewStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {overviewLoading ? '...' : (goalsOverview?.total_goals ?? 0)}
                    </Text>
                    <Text style={styles.statLabel}>Total Goals</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {overviewLoading ? '...' : (goalsOverview?.completed ?? 0)}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {overviewLoading ? '...' : (goalsOverview?.success_rate ?? '0%')}
                    </Text>
                    <Text style={styles.statLabel}>Success Rate</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Goals List */}
          <View style={styles.goalsList}>
            {loading ? (
              <>
                {/* Goals List Skeleton */}
                <View style={{ height: 22, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 12, width: '30%' }} />
                {[1, 2].map((item) => (
                  <Card key={item} style={styles.goalCard}>
                    <Card.Content style={styles.goalContent}>
                      <View style={styles.goalHeader}>
                        <View style={styles.goalInfo}>
                          <View style={{ height: 20, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 8, width: `${80 - (item * 5)}%` }} />
                          <View style={{ height: 14, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 8, width: `${60 + (item * 5)}%` }} />
                          <View style={styles.goalDates}>
                            <View style={{ width: 14, height: 14, backgroundColor: '#f3f4f6', borderRadius: 7, marginRight: 4 }} />
                            <View style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 4, width: `${70 + (item * 5)}%` }} />
                          </View>
                        </View>
                        <View>
                          <View style={{ height: 16, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 4, width: `${60 - (item * 5)}%` }} />
                          <View style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 4, width: `${50 - (item * 5)}%` }} />
                        </View>
                      </View>
                      <View style={styles.goalProgressContainer}>
                        <View style={styles.progressInfo}>
                          <View style={{ height: 14, backgroundColor: '#f3f4f6', borderRadius: 4, width: 40 }} />
                          <View style={{ height: 14, backgroundColor: '#f3f4f6', borderRadius: 4, width: 30 }} />
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View style={{ height: 8, backgroundColor: '#f3f4f6', borderRadius: 4, width: `${100 - (item * 15)}%` }} />
                        </View>
                      </View>
                      <View style={styles.goalActions}>
                        <View style={styles.goalStatus}>
                          <View style={{ width: 8, height: 8, backgroundColor: '#f3f4f6', borderRadius: 4, marginRight: 6 }} />
                          <View style={{ height: 12, backgroundColor: '#f3f4f6', borderRadius: 4, width: 40 }} />
                        </View>
                        <View style={{ height: 24, backgroundColor: '#f3f4f6', borderRadius: 6, width: 60 }} />
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </>
            ) : goals.length === 0 ? (
              <Card style={styles.goalCard}>
                <Card.Content style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <Ionicons name="trophy" size={32} color="#9ca3af" />
                  </View>
                  <Text style={styles.emptyText}>No goals yet</Text>
                  <Text style={styles.emptySubtext}>Create your first financial goal to get started</Text>
                </Card.Content>
              </Card>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Your Goals</Text>

                {
                  goals.map(goal => {
                    const progress = calculateProgress(goal);
                    const statusInfo = getGoalStatus(goal);
                    const daysRemaining = calculateDaysRemaining(goal.target_date);

                    return (
                      <Card key={goal.id} style={styles.goalCard}>
                        <Card.Content style={styles.goalContent}>
                          <View style={styles.goalHeader}>
                            <View style={styles.goalInfo}>
                              <Text style={styles.goalName} numberOfLines={1} ellipsizeMode="tail">{goal.name}</Text>
                              <Text style={styles.goalDescription} numberOfLines={2} ellipsizeMode="tail">{goal.description}</Text>
                              <View style={styles.goalDates}>
                                <Ionicons name="calendar" size={14} color="#9ca3af" style={{ marginRight: 4 }} />
                                <Text style={styles.goalDateText}>
                                  {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.target_date).toLocaleDateString()}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <Text style={styles.goalAmount}>
                                {formatCurrency(goal.current_amount)}
                              </Text>
                              <Text style={[styles.goalAmount, { fontSize: 12, color: '#6b7280' }]}>
                                of {formatCurrency(goal.target_amount)}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.goalProgressContainer}>
                            <View style={styles.progressInfo}>
                              <Text style={styles.progressText}>Progress</Text>
                              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                            </View>
                            <View style={styles.progressBarContainer}>
                              <View style={[styles.progressBar, { width: `${progress}%` }]} />
                            </View>
                          </View>

                          <View style={styles.goalActions}>
                            <View style={styles.goalStatus}>
                              <View style={[styles.statusDot, statusInfo.dotStyle]} />
                              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                {statusInfo.status}
                              </Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                              <Text style={styles.actionButtonText}>
                                {goal.status === 'completed' ? 'View' : 'Add Funds'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </Card.Content>
                      </Card>
                    );
                  })
                }
              </>
            )}
          </View>
        </ScrollView>

        <FAB
          icon="plus"
          color="#ffffff"
          style={[styles.fab, { bottom: -6 }]}
          onPress={() => navigation.navigate('AddGoal')}
        />

    
        <Notification
          visible={!!notification}
          message={notification || ''}
          onDismiss={() => setNotification(null)}
          type="success"
          duration={2000}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default GoalsScreen;
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
import PaymentGoalsService, { PaymentGoalsOverview, PaymentGoal } from '@/services/paymentGoalsService';

interface GoalsScreenProps {
  navigation: any;
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [goals, setGoals] = useState<PaymentGoal[]>([]);
  const [goalsOverview, setGoalsOverview] = useState<PaymentGoalsOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);

  const loadGoalsOverview = async () => {
    if (!token) return;

    setOverviewLoading(true);
    try {
      const response = await PaymentGoalsService.getPaymentGoalsOverview(token);

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

  const loadGoals = async (page: number = 1, refresh: boolean = false) => {
    if (!token) return;

    if (refresh) {
      setLoading(true);
    }

    try {
      const response = await PaymentGoalsService.getPaymentGoals(token, page);

      if (response.success) {
        if (page === 1 || refresh) {
          setGoals(response.data.data);
        } else {
          setGoals(prev => [...prev, ...response.data.data]);
        }
        setHasMorePages(response.data.meta.has_more_pages);
        setCurrentPage(response.data.meta.current_page);
      } else {
        console.error('Failed to load goals:', response.message);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      // Load overview data
      await loadGoalsOverview();

      // Load goals data with refresh
      await loadGoals(1, true);
    } catch (error) {
      console.error('Error refreshing goals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getGoalStatusColor = (badgeColor: string): string => {
    switch (badgeColor) {
      case 'success':
        return '#10b981';
      case 'danger':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusDotStyle = (badgeColor: string): any => {
    switch (badgeColor) {
      case 'success':
        return styles.statusCompleted;
      case 'danger':
        return styles.statusOverdue;
      case 'warning':
        return styles.statusActive;
      case 'info':
        return styles.statusActive;
      default:
        return styles.statusActive;
    }
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
                                {goal.formatted.amount}
                              </Text>
                              <Text style={[styles.goalAmount, { fontSize: 12, color: '#6b7280' }]}>
                                of {goal.formatted.target_amount}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.goalProgressContainer}>
                            <View style={styles.progressInfo}>
                              <Text style={styles.progressText}>Progress</Text>
                              <Text style={styles.progressPercentage}>{goal.formatted.progress}</Text>
                            </View>
                            <View style={styles.progressBarContainer}>
                              <View style={[styles.progressBar, { width: `${goal.progress_percent}%` }]} />
                            </View>
                          </View>

                          <View style={styles.goalActions}>
                            <View style={styles.goalStatus}>
                              <View style={[styles.statusDot, getStatusDotStyle(goal.status.badge_color)]} />
                              <Text style={[styles.statusText, { color: getGoalStatusColor(goal.status.badge_color) }]}>
                                {goal.status.name}
                              </Text>
                            </View>
                            <TouchableOpacity style={styles.actionButton}>
                              <Text style={styles.actionButtonText}>
                                {goal.status.name === 'Completed' ? 'View' : 'Add Funds'}
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
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { styles } from '@/styles/GoalsScreen.styles';
import PaymentGoalsService, { PaymentGoalsOverview, PaymentGoal } from '@/services/paymentGoalsService';
import { GoalsScreenSkeleton } from '@/components/skeleton';

interface GoalsScreenProps {
  navigation: any;
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<PaymentGoal[]>([]);
  const [goalsOverview, setGoalsOverview] = useState<PaymentGoalsOverview | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadGoals();
      loadGoalsOverview();
    }
  }, [isAuthenticated]);

  const loadGoals = async () => {
    if (!isAuthenticated || !token) return;

    setLoading(true);
    try {
      const response = await PaymentGoalsService.getPaymentGoals(token);
      if (response.success) {
        setGoals(response.data.data);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoalsOverview = async () => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await PaymentGoalsService.getPaymentGoalsOverview(token);
      if (response.success) {
        setGoalsOverview(response.data);
      }
    } catch (error) {
      console.error('Error loading goals overview:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadGoals(),
        loadGoalsOverview()
      ]);
    } catch (error) {
      console.error('Error refreshing goals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddFunds = (goal: PaymentGoal) => {
    navigation.navigate('AddFunds', { goal });
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['top', 'left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
        >
          {/* Header */}
          <View style={commonStyles.header}>
            <Ionicons name="trophy" size={24} color="#6366f1" style={commonStyles.headerIcon} />
            <Text style={commonStyles.headerTitle}>Financial Goals</Text>
          </View>

          {/* Goals List */}
          <View style={styles.goalsList}>
            {loading ? (
              <GoalsScreenSkeleton />
            ) : (
              <>
                {/* Overview - only show when not loading */}
                {goalsOverview && (
                  <Card style={styles.goalsOverview}>
                    <Card.Content style={styles.overviewContent}>
                      <Text style={styles.overviewTitle}>Goals Overview</Text>
                      <View style={styles.overviewStats}>
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>{goalsOverview.total_goals}</Text>
                          <Text style={styles.statLabel}>Total Goals</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>{goalsOverview.completed}</Text>
                          <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statValue}>{goalsOverview.success_rate}</Text>
                          <Text style={styles.statLabel}>Success Rate</Text>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                )}

                <Text style={styles.sectionTitle}>Your Goals</Text>

                {goals.length > 0 ? (
              goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => navigation.navigate('GoalDetails', { goalId: goal.id })}
                  activeOpacity={0.7}
                >
                  <Card.Content style={styles.goalContent}>
                    <View style={styles.goalHeader}>
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalName}>{goal.name}</Text>
                        <Text style={styles.goalDescription} numberOfLines={2}>
                          {goal.description}
                        </Text>
                      </View>
                      <View style={styles.goalStatus}>
                        <View style={[
                          styles.statusDot,
                          goal.status === 'Completed' ? styles.statusCompleted :
                          goal.status === 'Active' ? styles.statusActive : styles.statusOverdue
                        ]} />
                        <Text style={styles.statusText}>{goal.status}</Text>
                      </View>
                    </View>

                    <View style={styles.goalProgressContainer}>
                      <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                          {goal.formatted.amount} / {goal.formatted.target_amount}
                        </Text>
                        <Text style={styles.progressPercentage}>{goal.formatted.progress}</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={[
                          styles.progressBar,
                          { width: `${parseInt(goal.formatted.progress.replace('%', ''))}%` }
                        ]} />
                      </View>
                    </View>

                    <View style={styles.goalActions}>
                      <View style={styles.goalDates}>
                        <Ionicons name="calendar" size={14} color="#6b7280" />
                        <Text style={styles.goalDateText}>
                          {goal.formatted.start_date} - {goal.formatted.target_date}
                        </Text>
                      </View>
                      {goal.status !== 'Completed' && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleAddFunds(goal)}
                        >
                          <Text style={styles.actionButtonText}>Add Funds</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card.Content>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="trophy-outline" size={32} color="#6b7280" />
                </View>
                <Text style={styles.emptyText}>No Goals Yet</Text>
                <Text style={styles.emptySubtext}>
                  Start by creating your first financial goal
                </Text>
              </View>
            )}
            </>
          )}
        </View>
        </ScrollView>

        <FAB
          icon="plus"
          color="#ffffff"
          style={styles.fab}
          onPress={() => navigation.navigate('AddGoal')}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default GoalsScreen;
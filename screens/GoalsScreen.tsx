import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, StatusBar, TouchableOpacity, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, FAB, TextInput, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, getScrollContainerStyle, statusBarConfig } from '@/styles';
import { FormButton, Notification } from '@/components';
import { styles } from '@/styles/GoalsScreen.styles';
import PaymentGoalsService, { PaymentGoalsOverview, PaymentGoal } from '@/services/paymentGoalsService';

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
  const [addFundModalVisible, setAddFundModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PaymentGoal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const initialFormData = {
    amount: ''
  };

  const initialErrors = {
    amount: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };

  const handleAddFunds = (goal: PaymentGoal) => {
    setSelectedGoal(goal);
    setAddFundModalVisible(true);
    setFormData(initialFormData);
    setErrors(initialErrors);
  };

  const handleSubmitAddFunds = async () => {
    if (!token || submitting || !selectedGoal) return;

    // Validate amount
    if (!formData.amount.trim()) {
      setErrors(prev => ({ ...prev, amount: 'Please enter an amount' }));
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors(prev => ({ ...prev, amount: 'Please enter a valid amount' }));
      return;
    }

    try {
      setSubmitting(true);

      // Call API to add funds to goal
      const response = await PaymentGoalsService.addFundsToGoal(token, selectedGoal.id, amount);

      if (response.success) {
        setNotification(response?.message || '');
        setAddFundModalVisible(false);
        setFormData(initialFormData);
        setErrors(initialErrors);
        setSelectedGoal(null);

        // Refresh goals data
        loadGoals(1, true);
      } else {
        setErrors(prev => ({ ...prev, amount: response?.message || '' }));
      }

    } catch (error) {
      setErrors(prev => ({ ...prev, amount: 'Failed to add funds. Please try again.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrencyInput = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');

    // Split into integer and decimal parts
    const parts = cleanValue.split('.');
    let integerPart = parts[0] || '0';
    const decimalPart = parts[1] ? `.${parts[1].slice(0, 2)}` : '';

    // Remove leading zeros
    integerPart = integerPart.replace(/^0+/, '') || '0';

    // Format with thousands separator
    const formattedInteger = parseInt(integerPart).toLocaleString('id-ID');

    return `Rp ${formattedInteger}${decimalPart}`;
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    handleInputChange('amount', cleanValue);
  };


  const loadGoals = async (page: number = 1, refresh: boolean = false) => {
    if (!token) return;

    if (page === 1 || refresh) {
      setLoading(true);
    }

    try {
      // Load both overview and goals data
      const [overviewResponse, goalsResponse] = await Promise.all([
        PaymentGoalsService.getPaymentGoalsOverview(token),
        PaymentGoalsService.getPaymentGoals(token, page)
      ]);

      // Handle overview response
      if (overviewResponse.success) {
        setGoalsOverview(overviewResponse.data);
      }

      // Handle goals response
      if (goalsResponse.success) {
        if (page === 1 || refresh) {
          setGoals(goalsResponse.data.data);
        } else {
          setGoals(prev => [...prev, ...goalsResponse.data.data]);
        }
      }
    } catch (error) {
      // Error handling without console logging
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      // Load both overview and goals data with refresh
      await loadGoals(1, true);
    } catch (error) {
      // Error handling without console logging
    } finally {
      setRefreshing(false);
    }
  };

  const getGoalStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981';
      case 'ongoing':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusDotStyle = (status: string): any => {
    switch (status.toLowerCase()) {
      case 'completed':
        return styles.statusCompleted;
      case 'ongoing':
        return styles.statusActive;
      case 'pending':
        return styles.statusActive;
      case 'cancelled':
        return styles.statusOverdue;
      default:
        return styles.statusActive;
    }
  };

  const getProgressPercent = (progressString: string): number => {
    // Extract number from percentage string like "10%"
    const match = progressString.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadGoals();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAuthenticated) {
        loadGoals();
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
                      {goalsOverview?.total_goals ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Total Goals</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {goalsOverview?.completed ?? 0}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {goalsOverview?.success_rate ?? '0%'}
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
                    const progressPercent = getProgressPercent(goal.formatted.progress);

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
                                  {goal.formatted.start_date} - {goal.formatted.target_date}
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
                              <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
                            </View>
                          </View>

                          <View style={styles.goalActions}>
                            <View style={styles.goalStatus}>
                              <View style={[styles.statusDot, getStatusDotStyle(goal.status)]} />
                              <Text style={[styles.statusText, { color: getGoalStatusColor(goal.status) }]}>
                                {goal.status}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => handleAddFunds(goal)}
                              disabled={goal.status === 'Completed'}
                            >
                              <Text style={styles.actionButtonText}>
                                {goal.status === 'Completed' ? 'View' : 'Add Funds'}
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

        <Modal
          visible={addFundModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setAddFundModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setAddFundModalVisible(false)}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1, justifyContent: 'flex-end' }}
            >
              <View style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: Platform.OS === 'ios' ? 14 : 14
              }}>
                <Text style={{ textAlign: 'center', padding: 16, color: '#6b7280', fontSize: 13 }}>
                  Add Funds to Goal
                </Text>

                {selectedGoal && (
                  <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                    <View style={{ backgroundColor: '#f0f9ff', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e40af', marginBottom: 4 }}>
                        {selectedGoal.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                        {selectedGoal.description}
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                          Current: {selectedGoal.formatted.amount}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                          Target: {selectedGoal.formatted.target_amount}
                        </Text>
                      </View>
                      <View style={{ marginTop: 8 }}>
                        <View style={{ backgroundColor: '#e5e7eb', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                          <View style={{
                            backgroundColor: '#3b82f6',
                            height: '100%',
                            width: selectedGoal?.formatted?.progress || 0,
                            borderRadius: 3
                          }} />
                        </View>
                        <Text style={{ fontSize: 11, color: '#6b7280', textAlign: 'right', marginTop: 4 }}>
                          {selectedGoal.formatted.progress}
                        </Text>
                      </View>
                    </View>

                    <TextInput
                      label="Amount"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChangeText={handleAmountChange}
                      mode="outlined"
                      outlineColor="#e5e7eb"
                      activeOutlineColor="#6366f1"
                      style={styles.input}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      autoCorrect={false}
                      left={<TextInput.Icon icon="currency-usd" color="#6b7280" />}
                    />
                    {errors.amount && <HelperText type="error" style={styles.helperText}>{errors.amount}</HelperText>}

                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                      <FormButton
                        title="Cancel"
                        variant="outline"
                        fullWidth={false}
                        style={{ flex: 1 }}
                        onPress={() => setAddFundModalVisible(false)}
                        loading={submitting}
                      />

                      <FormButton
                        title="Add Funds"
                        fullWidth={false}
                        style={{ flex: 1 }}
                        onPress={handleSubmitAddFunds}
                        icon="plus"
                        loading={submitting}
                      />
                    </View>
                  </View>
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        <Notification
          visible={!!notification}
          message={notification || ''}
          onDismiss={() => {
            setNotification(null)
            setSubmitting(false)
          }}
          type="success"
          duration={2000}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default GoalsScreen;
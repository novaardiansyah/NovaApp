import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ScrollView, RefreshControl, StatusBar, Alert, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider, Appbar, Card, Divider } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { Theme } from '@/constants/colors'
import { useAuth } from '@/contexts/AuthContext'
import { commonStyles, statusBarConfig } from '@/styles'
import paymentService, { PaymentDetailsData } from '@/services/paymentService'
import { PaymentDetailsSkeleton } from '@/components'

type PaymentData = PaymentDetailsData

interface ViewPaymentDetailsScreenProps {
  navigation: any
  route: any
}

const ViewPaymentDetailsScreen: React.FC<ViewPaymentDetailsScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth()
  const { paymentId } = route.params
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [pressedCardId, setPressedCardId] = useState<string | null>(null)

  const loadPaymentDetails = async () => {
    if (!token || !paymentId) return

    setLoading(true)
    try {
      const response = await paymentService.getPaymentDetails(token, paymentId)

      if (response.success && response.data) {
        setPaymentData(response.data)
      } else {
        Alert.alert('Error', response.message || 'Failed to load payment details')
        navigation.goBack()
      }
    } catch (error) {
      console.error('Error loading payment details:', error)
      Alert.alert('Error', 'Failed to load payment details. Please check your connection.')
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPaymentDetails()
    setRefreshing(false)
  }

  useEffect(() => {
    loadPaymentDetails()
  }, [paymentId])

  const renderInfoRow = (label: string, value: string, icon?: string, iconColor?: string) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={iconColor || '#6b7280'}
            style={styles.infoIcon}
          />
        )}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )

  
  const getTypeColor = (type: string) => {
    return type === 'income' ? '#10b981' : '#ef4444'
  }

  const getTypeName = (type: string) => {
    return type === 'income' ? 'Income' : 'Expense'
  }

  if (loading || refreshing) {
    return (
      <PaperProvider theme={Theme}>
        <SafeAreaView style={commonStyles.container} edges={['left', 'right']}>
          <StatusBar {...statusBarConfig} />
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Payment Details" />
          </Appbar.Header>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            <PaymentDetailsSkeleton />
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    )
  }

  if (!paymentData) {
    return null
  }

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Payment Details" />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Payment Name Card */}
          <Card style={styles.nameCard}>
            <Card.Content>
              <Text style={styles.nameCardTitle}>Payment Name</Text>
              <Divider style={styles.cardDivider} />
              <Text style={styles.nameCardText}>{paymentData.name}</Text>
            </Card.Content>
          </Card>

          {/* Payment Information */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoCardTitle}>Payment Information</Text>
              <Divider style={styles.cardDivider} />

              {renderInfoRow('Transaction Code', paymentData.code, 'pricetag-outline', '#6366f1')}
              {renderInfoRow('Amount', paymentData.formatted_amount, 'cash-outline', getTypeColor(paymentData.type))}
              {renderInfoRow('Date', paymentData.formatted_date, 'calendar-outline', '#6366f1')}
              {renderInfoRow('Type', getTypeName(paymentData.type), 'folder-outline', '#f59e0b')}
              {renderInfoRow('Has Items', paymentData.has_items ? 'Yes' : 'No', 'list-outline', paymentData.has_items ? '#10b981' : '#ef4444')}
            </Card.Content>
          </Card>

          {/* Timestamp Information */}
          <Card style={styles.timestampCard}>
            <Card.Content>
              <Text style={styles.infoCardTitle}>Additional Information</Text>
              <Divider style={styles.cardDivider} />

              {renderInfoRow('Last Updated', paymentData.formatted_updated_at, 'refresh-outline', '#6b7280')}
            </Card.Content>
          </Card>

          {/* View Items Button */}
          {paymentData.has_items && (
            <Card style={[styles.actionCard, styles.actionCardWithItems]}>
              <Card.Content style={styles.actionCardContent}>
                <Pressable
                  onPress={() => navigation.navigate('ViewPaymentItems', {
                    paymentId: paymentData.id
                  })}
                  onPressIn={() => setPressedCardId('items')}
                  onPressOut={() => setPressedCardId(null)}
                  style={pressedCardId === 'items' && styles.actionCardPressed}
                >
                  <View style={styles.actionItem}>
                    <View style={styles.actionLeft}>
                      <View style={styles.actionIcon}>
                        <Ionicons name="list-outline" size={24} color="#6366f1" />
                      </View>
                      <View style={styles.actionInfo}>
                        <Text style={styles.actionTitle}>View Payment Items</Text>
                        <Text style={styles.actionSubtitle}>See detailed item breakdown</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </View>
                </Pressable>
              </Card.Content>
            </Card>
          )}

          {/* View Attachments Button */}
          <Card style={[styles.actionCard, styles.lastActionCard]}>
            <Card.Content style={styles.actionCardContent}>
              <Pressable
                onPress={() => navigation.navigate('CurrentAttachments', {
                  paymentId: paymentData.id
                })}
                onPressIn={() => setPressedCardId('attachments')}
                onPressOut={() => setPressedCardId(null)}
                style={pressedCardId === 'attachments' && styles.actionCardPressed}
              >
                <View style={styles.actionItem}>
                  <View style={styles.actionLeft}>
                    <View style={[styles.actionIcon, { backgroundColor: '#3b82f6' }]}>
                      <Ionicons name="attach-outline" size={24} color="#ffffff" />
                    </View>
                    <View style={styles.actionInfo}>
                      <Text style={styles.actionTitle}>View Attachments</Text>
                      <Text style={styles.actionSubtitle}>View attached files and documents</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </Pressable>
            </Card.Content>
          </Card>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  nameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
    nameCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  nameCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 20,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 0,
  },
  cardDivider: {
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
    actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionCardContent: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  timestampCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bottomSpacing: {
    height: 16,
  },
  actionCardWithItems: {
    marginBottom: 8,
  },
  lastActionCard: {
    marginBottom: 8,
  },
  actionCardPressed: {
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
})

export default ViewPaymentDetailsScreen
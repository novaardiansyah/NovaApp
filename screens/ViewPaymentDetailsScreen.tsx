import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, RefreshControl, StatusBar, Pressable, Modal, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider, Appbar, Card, Divider, FAB } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { Theme } from '@/constants/colors'
import { useAuth } from '@/contexts/AuthContext'
import { commonStyles, statusBarConfig, typography } from '@/styles'
import { styles } from '@/styles/ViewPaymentDetailsScreen.styles'
import paymentService, { PaymentDetailsData } from '@/services/paymentService'
import { PaymentDetailsSkeleton, Notification } from '@/components'
import { showDeletePaymentAlert } from '@/utils/paymentActions'

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
  const [actionSheetVisible, setActionSheetVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

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

  const handleEditPayment = () => {
    if (!paymentData) return
    setActionSheetVisible(false)
    navigation.navigate('EditPayment', {
      paymentId: paymentData.id
    })
  }

  const handleDeletePayment = () => {
    if (!paymentData || !token) return

    showDeletePaymentAlert(paymentData.name, paymentData.id, token, {
      onSuccess: () => {
        setNotification('Pembayaran berhasil dihapus!')
        setTimeout(() => {
          navigation.goBack()
        }, 1500)
      },
      setDeleting,
      setActionSheetVisible,
    })
  }

  const closeActionSheet = () => {
    setActionSheetVisible(false)
  }

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

  if (loading || refreshing) {
    return (
      <PaperProvider theme={Theme}>
        <SafeAreaView style={commonStyles.container} edges={['left', 'right']}>
          <StatusBar {...statusBarConfig} />
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Detail Transaksi" titleStyle={typography.appbar.titleNormal} />
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
          <View style={styles.fabSkeleton} />
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
          <Appbar.Content title="Detail Transaksi" titleStyle={typography.appbar.titleNormal} />
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
              <Text style={styles.nameCardTitle}>Nama Transaksi</Text>
              <Divider style={styles.cardDivider} />
              <Text style={styles.nameCardText}>{paymentData.name}</Text>
            </Card.Content>
          </Card>

          {/* Payment Information */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoCardTitle}>Informasi Transaksi</Text>
              <Divider style={styles.cardDivider} />

              {renderInfoRow('Kode Transaksi', paymentData.code, 'pricetag-outline', '#6366f1')}
              {renderInfoRow('Jumlah', paymentData.formatted_amount, 'cash-outline', '#6366f1')}
              {renderInfoRow('Tanggal', paymentData.formatted_date, 'calendar-outline', '#6366f1')}
              {renderInfoRow('Tipe', paymentData.type === 'income' ? 'Pemasukan' : 'Pengeluaran', 'folder-outline', '#6366f1')}
              {renderInfoRow('Memiliki Item', paymentData.has_items ? 'Ya' : 'Tidak', 'list-outline', '#6366f1')}
              {renderInfoRow('Terjadwal', paymentData.is_scheduled ? 'Ya' : 'Tidak', 'newspaper-outline', '#6366f1')}
              {renderInfoRow('Draft', paymentData.is_draft ? 'Ya' : 'Tidak', 'document-text-outline', '#6366f1')}
              {renderInfoRow('Diperbarui', paymentData.formatted_updated_at, 'stopwatch-outline', '#6366f1')}
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
                        <Text style={styles.actionTitle}>Lihat Item Transaksi</Text>
                        <Text style={styles.actionSubtitle}>Lihat rincian item secara detail</Text>
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
                      <Text style={styles.actionTitle}>Lihat Lampiran</Text>
                      <Text style={styles.actionSubtitle}>Lihat file dan dokumen terlampir</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </Pressable>
            </Card.Content>
          </Card>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        <FAB
          icon="menu"
          color="#ffffff"
          style={styles.fab}
          onPress={() => setActionSheetVisible(true)}
        />
      </SafeAreaView>

      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeActionSheet}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeActionSheet}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Kelola Detail Transaksi
            </Text>

            <View style={styles.modalActionsContainer}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={handleEditPayment}
              >
                <Ionicons name="create-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Edit Pembayaran</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={handleDeletePayment}
              >
                <Ionicons name="trash-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Hapus Pembayaran</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={closeActionSheet}
            >
              <Text style={styles.modalCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null)
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  )
}

export default ViewPaymentDetailsScreen
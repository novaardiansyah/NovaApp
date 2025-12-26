import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, RefreshControl, ActivityIndicator, StatusBar, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider, Card, FAB, Divider, Appbar } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { Theme } from '@/constants/colors'
import { Notification } from '@/components'
import { TransactionsSkeleton } from '@/components'
import TransactionFilter, { FilterOptions } from '@/components/TransactionFilter'
import EmptyTransactionsCard from '@/components/EmptyTransactionsCard'
import { useAuth } from '@/contexts/AuthContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { commonStyles, getScrollContainerStyle, statusBarConfig, typography } from '@/styles'
import { styles } from '@/styles/AllTransactionsScreen.styles'
import { getTransactionColor, getTransactionIcon } from '@/utils/transactionUtils'
import transactionService from '@/services/transactionService'
import paymentService from '@/services/paymentService'
import { showDeletePaymentAlert } from '@/utils/paymentActions'

type Transaction = import('@/services/transactionService').Transaction

type Pagination = import('@/services/transactionService').Pagination

type ApiResponse = import('@/services/transactionService').TransactionsResponse

interface AllTransactionsScreenProps {
  navigation: any
}

const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const { isAuthenticated, token } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [actionSheetVisible, setActionSheetVisible] = useState(false)
  const [pressedCardId, setPressedCardId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVisible, setSearchVisible] = useState(false)
  const [draftActionVisible, setDraftActionVisible] = useState(false)
  const [managingDraft, setManagingDraft] = useState(false)

  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    transactionType: '',
    accountId: '',
  })

  const fetchTransactions = async (page: number = 1) => {
    if (!isAuthenticated || loading || loadingMore || !token) return

    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const data: ApiResponse = await transactionService.getAllTransactions(token, page)

      if (data.success) {
        if (page === 1) {
          setTransactions(data.data)
        } else {
          setTransactions(prev => [...prev, ...data.data])
        }
        setPagination(data.pagination)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      if (page === 1) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
    }
  }, [isAuthenticated])

  const handleRefresh = async () => {
    setRefreshing(true)
    setTransactions([])
    setLoading(true)
    await fetchTransactions(1)
    setRefreshing(false)
  }

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page && !loading && !loadingMore) {
      const hasActiveFilters = !!(activeFilters.dateFrom || activeFilters.dateTo ||
        (activeFilters.transactionType && activeFilters.transactionType !== '') ||
        (activeFilters.accountId && activeFilters.accountId !== ''))
      if (hasActiveFilters) {
        fetchTransactionsWithFilters(currentPage + 1, activeFilters)
      } else {
        fetchTransactions(currentPage + 1)
      }
    }
  }

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setActionSheetVisible(true)
  }

  const handleActionSelect = (action: string) => {
    if (!selectedTransaction) return

    setActionSheetVisible(false)

    switch (action) {
      case 'view_items':
        navigation.navigate('ViewPaymentItems', {
          paymentId: selectedTransaction.id,
          refresh: new Date().getTime()
        })
        break
      case 'view_details':
        navigation.navigate('ViewPaymentDetails', {
          paymentId: selectedTransaction.id
        })
        break
      case 'edit_payment':
        navigation.navigate('EditPayment', {
          paymentId: selectedTransaction.id
        })
        break
      case 'delete_payment':
        handleDeletePayment(selectedTransaction)
        break
      case 'view_attachment':
        navigation.navigate('CurrentAttachments', {
          paymentId: selectedTransaction.id
        })
        break
    }
  }

  const handleDeletePayment = (transaction: Transaction) => {
    if (!token) return

    showDeletePaymentAlert(transaction.name, transaction.id, token, {
      onSuccess: () => {
        setTransactions(prev => prev.filter(t => t.id !== transaction.id))

        setPagination((prev: Pagination | null) => prev ? {
          ...prev,
          total: prev.total - 1,
          to: Math.max(0, prev.to - 1)
        } : null)

        setNotification('Transaksi telah berhasil dihapus!')
      },
      setDeleting,
    })
  }

  const closeActionSheet = () => {
    setActionSheetVisible(false)
  }

  const openDraftActionSheet = () => {
    setActionSheetVisible(false)
    setDraftActionVisible(true)
  }

  const closeDraftActionSheet = () => {
    setDraftActionVisible(false)
  }

  const handleManageDraft = async (action: 'approve' | 'reject') => {
    if (!selectedTransaction || !token) return

    setManagingDraft(true)
    try {
      const response = await paymentService.manageDraft(token, selectedTransaction.code, action, true)

      if (response.success) {
        if (action === 'reject') {
          setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id))
          setPagination((prev: Pagination | null) => prev ? {
            ...prev,
            total: prev.total - 1,
            to: Math.max(0, prev.to - 1)
          } : null)
          setNotification('Draft berhasil ditolak!')
        } else {
          setTransactions(prev => prev.map(t =>
            t.id === selectedTransaction.id ? { ...t, is_draft: false } : t
          ))
          setNotification('Draft berhasil disetujui!')
        }
      } else {
        setNotification(response.message || 'Gagal mengelola draft')
      }
    } catch (error) {
      console.error('Error managing draft:', error)
      setNotification('Gagal mengelola draft. Silakan coba lagi.')
    } finally {
      setManagingDraft(false)
      setDraftActionVisible(false)
    }
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  const handleApplyFilter = (filters: FilterOptions) => {
    setActiveFilters(filters)
    setTransactions([])
    setCurrentPage(1)
    fetchTransactionsWithFilters(1, filters)
  }

  const handleResetFilter = () => {
    const emptyFilters: FilterOptions = {
      dateFrom: null,
      dateTo: null,
      transactionType: '',
      accountId: '',
    }

    setActiveFilters(emptyFilters)
    setTransactions([])
    setCurrentPage(1)
    fetchTransactionsWithFilters(1, emptyFilters)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setTransactions([])
    setCurrentPage(1)
    fetchTransactionsWithFilters(1, activeFilters, searchQuery)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchVisible(false)
    setTransactions([])
    setCurrentPage(1)

    const hasActiveFilters = !!(activeFilters.dateFrom || activeFilters.dateTo ||
      (activeFilters.transactionType && activeFilters.transactionType !== '') ||
      (activeFilters.accountId && activeFilters.accountId !== ''))
    if (hasActiveFilters) {
      fetchTransactionsWithFilters(1, activeFilters, '')
    } else {
      fetchTransactions(1)
    }
  }

  const toggleSearchVisible = () => {
    if (searchVisible && searchQuery.trim()) {
      handleClearSearch()
    } else {
      setSearchVisible(!searchVisible)
    }
  }

  const fetchTransactionsWithFilters = async (page: number = 1, filters: FilterOptions, searchOverride?: string) => {
    if (!isAuthenticated || !token) return

    if (page > 1 && loadingMore) return

    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const queryParams: any = { page }

      if (filters.dateFrom) queryParams.date_from = filters.dateFrom
      if (filters.dateTo) queryParams.date_to = filters.dateTo
      if (filters.transactionType && filters.transactionType !== '') queryParams.type = filters.transactionType
      if (filters.accountId && filters.accountId !== '') queryParams.account_id = filters.accountId

      const searchValue = searchOverride !== undefined ? searchOverride : searchQuery
      if (searchValue.trim()) queryParams.search = searchValue.trim()

      const data: ApiResponse = await transactionService.getAllTransactions(token, page, queryParams)

      if (data.success) {
        if (page === 1) {
          setTransactions(data.data)
        } else {
          setTransactions(prev => [...prev, ...data.data])
        }
        setPagination(data.pagination)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching transactions with filters:', error)
    } finally {
      if (page === 1) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Text style={commonStyles.authText}>Please login first</Text>
        </View>
      </PaperProvider>
    )
  }

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Transaksi" titleStyle={typography.appbar.titleBold} />
          <Appbar.Action icon="magnify" onPress={toggleSearchVisible} color={searchQuery.trim() ? '#f59e0b' : undefined} />
          <Appbar.Action icon="filter-variant" onPress={() => setFilterVisible(true)} color={(() => {
            const hasActiveFilters = !!(activeFilters.dateFrom || activeFilters.dateTo ||
              (activeFilters.transactionType && activeFilters.transactionType !== '') ||
              (activeFilters.accountId && activeFilters.accountId !== ''))
            return hasActiveFilters ? '#f59e0b' : undefined
          })()} />
          <Appbar.Action icon="file-document-outline" onPress={() => navigation.navigate('Reports')} />
        </Appbar.Header>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore()
            }
          }}
          scrollEventThrottle={400}
        >
          {/* Expandable Search Bar */}
          {searchVisible && (
            <View style={styles.searchBarContainer}>
              <TouchableOpacity onPress={handleSearch} style={styles.searchIconButton}>
                <Ionicons name="search" size={18} color={searchQuery.trim() ? '#6366f1' : '#6b7280'} />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari transaksi..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoFocus
              />
              {searchQuery.trim() !== '' && (
                <TouchableOpacity onPress={handleClearSearch} style={styles.searchClearButton}>
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.transactionsSection}>
            {loading || (refreshing && transactions.length === 0) ? (
              <TransactionsSkeleton count={5} />
            ) : (
              <View style={styles.transactionsList}>
                {transactions.length === 0 ? (
                  <EmptyTransactionsCard />
                ) : (
                  <Card style={styles.transactionsCard}>
                    <Card.Content style={styles.transactionsCardContent}>
                      {transactions.map((transaction, index) => {
                        return (
                          <View key={transaction.id}>
                            <Pressable
                              onPress={() => handleTransactionPress(transaction)}
                              onPressIn={() => setPressedCardId(transaction.id)}
                              onPressOut={() => setPressedCardId(null)}
                              style={pressedCardId === transaction.id && styles.transactionCardPressed}
                            >
                              <View style={styles.transactionItem}>
                                <View style={styles.transactionLeft}>
                                  <View style={[
                                    styles.transactionIcon,
                                    { backgroundColor: getTransactionColor(transaction.type_id.toString()) }
                                  ]}>
                                    <Ionicons
                                      name={getTransactionIcon(transaction.type_id.toString()) as any}
                                      size={14}
                                      color="white"
                                    />
                                  </View>
                                  <View style={styles.transactionInfo}>
                                    <Text style={styles.transactionTitle} numberOfLines={1} ellipsizeMode="tail">
                                      {transaction.name}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                      {transaction.formatted_date}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.transactionRight}>
                                  <View style={styles.transactionAmountContainer}>
                                    <Text style={[
                                      styles.transactionAmount,
                                      { color: getTransactionColor(transaction.type_id.toString()) }
                                    ]}>
                                      {transaction.formatted_amount}
                                    </Text>
                                    <View style={styles.transactionIconsContainer}>
                                      {transaction.has_items && (
                                        <Ionicons
                                          name="list-outline"
                                          size={12}
                                          color="#6b7280"
                                          style={styles.transactionItemsIcon}
                                        />
                                      )}
                                      {transaction.is_scheduled && (
                                        <Ionicons
                                          name="time-outline"
                                          size={12}
                                          color="#6b7280"
                                          style={styles.transactionScheduledIcon}
                                        />
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </Pressable>
                            {index < transactions.length - 1 && (
                              <Divider style={styles.transactionDivider} />
                            )}
                          </View>
                        )
                      })}
                    </Card.Content>
                  </Card>
                )}
              </View>
            )}

            {loadingMore && (
              <View style={styles.loadingMoreContent}>
                <ActivityIndicator size={24} color="#6366f1" />
              </View>
            )}

            {pagination && currentPage >= pagination.last_page && transactions.length > 0 ? (
              <View style={styles.endOfList}>
                <Text style={styles.endOfListText}>
                  Menampilkan {transactions.length} dari {pagination.total} transaksi
                </Text>
              </View>
            ) : loadingMore ? (
              <></>
            ) : transactions.length > 0 && pagination && currentPage < pagination.last_page ? (
              <View style={styles.endOfList}>
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                >
                  <Ionicons name="chevron-down" size={14} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ) : null
            }
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={actionSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeActionSheet}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeActionSheet}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Kelola Transaksi
            </Text>

            <View style={styles.modalActionsContainer}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleActionSelect('view_details')}
              >
                <Ionicons name="eye-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Lihat Detail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleActionSelect('edit_payment')}
              >
                <Ionicons name="create-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Edit Transaksi</Text>
              </TouchableOpacity>


              {selectedTransaction?.has_items && (
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={() => handleActionSelect('view_items')}
                >
                  <Ionicons name="list-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                  <Text style={styles.modalActionText}>Lihat Item</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleActionSelect('view_attachment')}
              >
                <Ionicons name="attach-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Lihat Lampiran</Text>
              </TouchableOpacity>

              {selectedTransaction?.is_draft && (
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={openDraftActionSheet}
                >
                  <Ionicons name="document-text-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                  <Text style={styles.modalActionText}>Kelola Draft</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleActionSelect('delete_payment')}
              >
                <Ionicons name="trash-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Hapus Transaksi</Text>
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

      <FAB
        icon="plus"
        color="#ffffff"
        style={styles.fab}
        onPress={() => navigation.navigate('AddPayment')}
      />

      <Modal
        visible={draftActionVisible}
        transparent
        animationType="slide"
        onRequestClose={closeDraftActionSheet}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeDraftActionSheet}
          />

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Kelola Draft Transaksi
            </Text>

            <View style={styles.modalActionsContainer}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleManageDraft('approve')}
                disabled={managingDraft}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Setujui Draft</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => handleManageDraft('reject')}
                disabled={managingDraft}
              >
                <Ionicons name="close-circle-outline" size={20} color="#6366f1" style={styles.modalActionIcon} />
                <Text style={styles.modalActionText}>Tolak Draft</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={closeDraftActionSheet}
              disabled={managingDraft}
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

      <TransactionFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
        currentFilters={activeFilters}
      />
    </PaperProvider>
  )
}

export default AllTransactionsScreen
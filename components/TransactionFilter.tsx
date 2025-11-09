import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { useAuth } from '@/contexts/AuthContext'
import Select from '@/components/Select'
import { styles } from '@/styles/TransactionFilter.styles'
import paymentService from '@/services/paymentService'

export interface FilterOptions {
  dateFrom: string | null
  dateTo: string | null
  transactionType: string | null
  accountId: string | null
}

interface TransactionFilterProps {
  visible: boolean
  onClose: () => void
  onApplyFilter: (filters: FilterOptions) => void
  onResetFilter: () => void
  currentFilters: FilterOptions
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  visible,
  onClose,
  onApplyFilter,
  onResetFilter,
  currentFilters,
}) => {
  const { token } = useAuth()
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)
  const [showDatePickerFrom, setShowDatePickerFrom] = useState(false)
  const [showDatePickerTo, setShowDatePickerTo] = useState(false)
  const [paymentTypes, setPaymentTypes] = useState<any[]>([])
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([])
  const [loadingPaymentTypes, setLoadingPaymentTypes] = useState(false)
  const [loadingPaymentAccounts, setLoadingPaymentAccounts] = useState(false)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, visible])

  useEffect(() => {
    if (visible && token) {
      loadPaymentTypes()
      loadPaymentAccounts()
    }
  }, [visible, token])

  const loadPaymentTypes = async () => {
    setLoadingPaymentTypes(true)

    if (!token) {
      setLoadingPaymentTypes(false)
      return
    }

    try {
      const types = await paymentService.getPaymentTypes(token)
      setPaymentTypes(types)

      if (types.length > 0) {
        const defaultType = types.find((type) => type.is_default) || types[0]
        const selected = defaultType.id.toString()

        setFilters(prev => ({ ...prev, transactionType: selected }))
      }
    } catch (error) {
      console.error('Error loading payment types:', error)
    } finally {
      setLoadingPaymentTypes(false)
    }
  }

  const loadPaymentAccounts = async () => {
    setLoadingPaymentAccounts(true)

    if (!token) {
      setLoadingPaymentAccounts(false)
      return
    }

    try {
      const accounts = await paymentService.getPaymentAccounts(token)
      setPaymentAccounts(accounts)

      if (accounts.length > 0) {
        const defaultAccount = accounts.find((account) => account.is_default) || accounts[0]
        const selected = defaultAccount.id.toString()

        setFilters(prev => ({ ...prev, accountId: selected }))
      }
    } catch (error) {
      console.error('Error loading payment accounts:', error)
    } finally {
      setLoadingPaymentAccounts(false)
    }
  }

  const handleDateFromConfirm = (params: any) => {
    const year = params.date.getFullYear()
    const month = String(params.date.getMonth() + 1).padStart(2, '0')
    const day = String(params.date.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    setFilters(prev => ({ ...prev, dateFrom: formattedDate }))
    setShowDatePickerFrom(false)
  }

  const handleDateFromDismiss = () => {
    setShowDatePickerFrom(false)
  }

  const handleDateToConfirm = (params: any) => {
    const year = params.date.getFullYear()
    const month = String(params.date.getMonth() + 1).padStart(2, '0')
    const day = String(params.date.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`

    setFilters(prev => ({ ...prev, dateTo: formattedDate }))
    setShowDatePickerTo(false)
  }

  const handleDateToDismiss = () => {
    setShowDatePickerTo(false)
  }

  const handleTransactionTypeChange = (typeId: string) => {
    setFilters(prev => ({
      ...prev,
      transactionType: typeId === '' ? null : typeId,
    }))
  }

  const handleAccountChange = (accountId: string) => {
    setFilters(prev => ({
      ...prev,
      accountId: accountId === '' ? null : accountId,
    }))
  }

  const handleApply = () => {
    onApplyFilter(filters)
    onClose()
  }

  const handleReset = () => {
    const emptyFilters: FilterOptions = {
      dateFrom: null,
      dateTo: null,
      transactionType: null,
      accountId: null,
    }
    setFilters(emptyFilters)
    onResetFilter()
    onClose()
  }

  const hasActiveFilters = !!(filters.dateFrom || filters.dateTo || filters.transactionType || filters.accountId)

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.title}>Filter Transaksi</Text>
            <TouchableOpacity
              onPress={handleReset}
              style={styles.resetButton}
              disabled={!hasActiveFilters}
            >
              <Text style={[styles.resetText, !hasActiveFilters && styles.resetTextDisabled]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Date Range Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rentang Tanggal</Text>

              <TouchableOpacity onPress={() => setShowDatePickerFrom(true)} activeOpacity={0.7}>
                <TextInput
                  label="Tanggal Mulai"
                  value={filters.dateFrom || ''}
                  onChangeText={() => {}}
                  mode="outlined"
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                  style={styles.input}
                  placeholder="Pilih tanggal"
                  editable={false}
                  right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePickerFrom(true)} />}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowDatePickerTo(true)} activeOpacity={0.7}>
                <TextInput
                  label="Tanggal Selesai"
                  value={filters.dateTo || ''}
                  onChangeText={() => {}}
                  mode="outlined"
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#6366f1"
                  style={styles.input}
                  placeholder="Pilih tanggal"
                  editable={false}
                  right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePickerTo(true)} />}
                />
              </TouchableOpacity>
            </View>

            {/* Transaction Type Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Jenis Transaksi</Text>
              <Select
                label="Jenis Transaksi"
                value={filters.transactionType || ''}
                onValueChange={handleTransactionTypeChange}
                options={paymentTypes}
                loading={loadingPaymentTypes}
                style={styles.input}
                placeholder="Pilih jenis transaksi"
              />
            </View>

            {/* Account Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Akun</Text>
              <Select
                label="Akun"
                value={filters.accountId || ''}
                onValueChange={handleAccountChange}
                options={paymentAccounts}
                loading={loadingPaymentAccounts}
                style={styles.input}
              />
            </View>

            <View style={{ height: 30 }}></View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, !hasActiveFilters && styles.applyButtonDisabled]}
              onPress={handleApply}
              disabled={!hasActiveFilters}
            >
              <Text style={styles.applyButtonText}>
                Terapkan Filter {hasActiveFilters && `(${getActiveFilterCount(filters)})`}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Date From Picker Modal */}
      <DatePickerModal
        mode="single"
        visible={showDatePickerFrom}
        onDismiss={handleDateFromDismiss}
        onConfirm={handleDateFromConfirm}
        date={filters.dateFrom ? new Date(filters.dateFrom) : new Date()}
        locale="id"
      />

      {/* Date To Picker Modal */}
      <DatePickerModal
        mode="single"
        visible={showDatePickerTo}
        onDismiss={handleDateToDismiss}
        onConfirm={handleDateToConfirm}
        date={filters.dateTo ? new Date(filters.dateTo) : new Date()}
        locale="id"
      />
    </>
  )
}

const getActiveFilterCount = (filters: FilterOptions): number => {
  return Object.values(filters).filter(value => value !== null).length
}

export default TransactionFilter
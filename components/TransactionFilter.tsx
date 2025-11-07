import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { styles } from '@/styles/TransactionFilter.styles';

export interface FilterOptions {
  dateFrom: string | null;
  dateTo: string | null;
  transactionType: string | null;
  accountId: string | null;
}

interface TransactionFilterProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterOptions) => void;
  onResetFilter: () => void;
  currentFilters: FilterOptions;
}

const TRANSACTION_TYPES = [
  { id: 'income', label: 'Income', icon: 'arrow-up-outline' },
  { id: 'expense', label: 'Expense', icon: 'arrow-down-outline' },
  { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal-outline' },
];

const ACCOUNTS = [
  { id: '1', label: 'Cash', icon: 'wallet-outline' },
  { id: '2', label: 'Bank Account', icon: 'card-outline' },
  { id: '3', label: 'E-Wallet', icon: 'phone-portrait-outline' },
  { id: '4', label: 'Credit Card', icon: 'card' },
];

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  visible,
  onClose,
  onApplyFilter,
  onResetFilter,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [showDatePicker, setShowDatePicker] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, visible]);

  const handleDateSelect = (type: 'from' | 'to') => {
    setShowDatePicker(type);
    Alert.alert(
      `Select ${type === 'from' ? 'Start' : 'End'} Date`,
      'Date picker functionality would be implemented here',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Set Today',
          onPress: () => {
            const today = new Date().toISOString().split('T')[0];
            setFilters(prev => ({
              ...prev,
              [type === 'from' ? 'dateFrom' : 'dateTo']: today,
            }));
            setShowDatePicker(null);
          },
        },
      ]
    );
  };

  const handleTransactionTypeSelect = (typeId: string) => {
    setFilters(prev => ({
      ...prev,
      transactionType: prev.transactionType === typeId ? null : typeId,
    }));
  };

  const handleAccountSelect = (accountId: string) => {
    setFilters(prev => ({
      ...prev,
      accountId: prev.accountId === accountId ? null : accountId,
    }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {
      dateFrom: null,
      dateTo: null,
      transactionType: null,
      accountId: null,
    };
    setFilters(emptyFilters);
    onResetFilter();
    onClose();
  };

  const hasActiveFilters = !!(filters.dateFrom || filters.dateTo || filters.transactionType || filters.accountId);

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
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
          <Text style={styles.title}>Filter Transactions</Text>
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
            <Text style={styles.sectionTitle}>Date Range</Text>

            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => handleDateSelect('from')}
              >
                <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>From</Text>
                  <Text style={styles.dateText}>
                    {formatDateDisplay(filters.dateFrom)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => handleDateSelect('to')}
              >
                <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>To</Text>
                  <Text style={styles.dateText}>
                    {formatDateDisplay(filters.dateTo)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transaction Type Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Type</Text>
            <View style={styles.optionContainer}>
              {TRANSACTION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.optionButton,
                    filters.transactionType === type.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleTransactionTypeSelect(type.id)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={20}
                    color={filters.transactionType === type.id ? '#ffffff' : '#6b7280'}
                  />
                  <Text style={[
                    styles.optionText,
                    filters.transactionType === type.id && styles.optionTextSelected,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.optionContainer}>
              {ACCOUNTS.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.optionButton,
                    filters.accountId === account.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleAccountSelect(account.id)}
                >
                  <Ionicons
                    name={account.icon as any}
                    size={20}
                    color={filters.accountId === account.id ? '#ffffff' : '#6b7280'}
                  />
                  <Text style={[
                    styles.optionText,
                    filters.accountId === account.id && styles.optionTextSelected,
                  ]}>
                    {account.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
              Apply Filters {hasActiveFilters && `(${getActiveFilterCount(filters)})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const getActiveFilterCount = (filters: FilterOptions): number => {
  return Object.values(filters).filter(value => value !== null).length;
};

export default TransactionFilter;
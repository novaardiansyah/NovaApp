import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { PaperProvider, Card, HelperText, Appbar } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles } from '@/styles';
import { FormButton, Notification } from '@/components';
import { styles } from '../styles/GenerateReportScreen.styles';
import PaymentService from '@/services/paymentService';

registerTranslation('en', enGB);

interface GenerateReportScreenProps {
  navigation: any;
}

type ReportType = 'monthly' | 'daily' | 'date_range';

interface ReportTypeOption {
  value: ReportType;
  label: string;
  description: string;
}

const reportTypeOptions: ReportTypeOption[] = [
  { value: 'monthly', label: 'Monthly Report (Email)', description: 'Laporan bulanan dikirim ke email' },
  { value: 'daily', label: 'Daily Report (Email)', description: 'Laporan harian dikirim ke email' },
  { value: 'date_range', label: 'Custom Date Range (PDF)', description: 'Laporan rentang tanggal sebagai PDF' },
];

const GenerateReportScreen: React.FC<GenerateReportScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();

  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [selectedPeriode, setSelectedPeriode] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  });

  const [showReportTypeModal, setShowReportTypeModal] = useState(false);
  const [showPeriodeModal, setShowPeriodeModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<string | null>(null);

  const monthOptions = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const options: { value: string; label: string }[] = [];

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    for (let i = 0; i < 12; i++) {
      const monthValue = `${year}-${String(i + 1).padStart(2, '0')}`;
      options.push({
        value: monthValue,
        label: `${monthNames[i]} ${year}`
      });
    }

    return options;
  }, []);

  function formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
  }

  const getSelectedReportTypeLabel = (): string => {
    const option = reportTypeOptions.find(opt => opt.value === reportType);
    return option?.label || '';
  };

  const getSelectedPeriodeLabel = (): string => {
    const option = monthOptions.find(opt => opt.value === selectedPeriode);
    return option?.label || '';
  };

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please login again.');
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      let payload: {
        report_type: 'daily' | 'monthly' | 'date_range';
        periode?: string;
        start_date?: string;
        end_date?: string;
      } = { report_type: reportType };

      if (reportType === 'monthly') {
        payload.periode = selectedPeriode;
      } else if (reportType === 'date_range') {
        payload.start_date = formatDateToString(startDate);
        payload.end_date = formatDateToString(endDate);
      }

      const response = await PaymentService.generateReport(token, payload);

      if (response.success) {
        setNotification(response.message || '');
      } else {
        setSubmitting(false);
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join('\n');
          Alert.alert('Validation Error', errorMessages || response.message || 'Validation failed');
        } else {
          Alert.alert('Error', response.message || 'Gagal generate report. Silakan coba lagi.');
        }
      }
    } catch (error) {
      setSubmitting(false);
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Gagal generate report. Silakan coba lagi.');
    }
  };

  const handleStartDateConfirm = (params: any) => {
    setStartDate(params.date);
    setShowStartDatePicker(false);
    if (errors.startDate) {
      setErrors(prev => ({ ...prev, startDate: '' }));
    }
  };

  const handleEndDateConfirm = (params: any) => {
    setEndDate(params.date);
    setShowEndDatePicker(false);
    if (errors.endDate) {
      setErrors(prev => ({ ...prev, endDate: '' }));
    }
  };

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.authText}>Silakan login terlebih dahulu</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        {/* Header - same style as AddPaymentScreen */}
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Kelola Laporan Keuangan" />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Report Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tipe Laporan</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowReportTypeModal(true)}
            >
              <View style={styles.selectorContent}>
                <Ionicons name="document-text-outline" size={20} color="#6366f1" />
                <View style={styles.selectorTextContainer}>
                  <Text style={styles.selectorTitle}>{getSelectedReportTypeLabel()}</Text>
                  <Text style={styles.selectorDescription}>
                    {reportTypeOptions.find(opt => opt.value === reportType)?.description}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Conditional Fields based on Report Type */}
          {reportType === 'monthly' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Periode</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowPeriodeModal(true)}
              >
                <View style={styles.selectorContent}>
                  <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                  <View style={styles.selectorTextContainer}>
                    <Text style={styles.selectorTitle}>{getSelectedPeriodeLabel()}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </TouchableOpacity>
              {errors.periode && <HelperText type="error" style={styles.helperText}>{errors.periode}</HelperText>}
            </View>
          )}

          {reportType === 'date_range' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Tanggal Mulai</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <View style={styles.selectorContent}>
                    <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                    <View style={styles.selectorTextContainer}>
                      <Text style={styles.selectorTitle}>{formatDisplayDate(startDate)}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </TouchableOpacity>
                {errors.startDate && <HelperText type="error" style={styles.helperText}>{errors.startDate}</HelperText>}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Tanggal Akhir</Text>
                <TouchableOpacity
                  style={styles.selector}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <View style={styles.selectorContent}>
                    <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                    <View style={styles.selectorTextContainer}>
                      <Text style={styles.selectorTitle}>{formatDisplayDate(endDate)}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </TouchableOpacity>
                {errors.endDate && <HelperText type="error" style={styles.helperText}>{errors.endDate}</HelperText>}
              </View>
            </>
          )}

          {reportType === 'daily' && (
            <Card style={styles.infoCard}>
              <Card.Content>
                <View style={styles.infoContent}>
                  <Ionicons name="information-circle-outline" size={24} color="#6366f1" />
                  <Text style={styles.infoText}>
                    Laporan harian akan dikirimkan ke email Anda dengan data transaksi hari ini.
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <FormButton
              title="Proses Laporan"
              onPress={handleSubmit}
              loading={submitting}
              fullWidth
            />

            <FormButton
              title="Batal"
              onPress={() => {
                if (!submitting) {
                  navigation.goBack();
                }
              }}
              variant="outline"
              loading={submitting}
              fullWidth
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>

        {/* Report Type Modal */}
        <Modal
          visible={showReportTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReportTypeModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowReportTypeModal(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Pilih Tipe Laporan</Text>
              {reportTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    reportType === option.value && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setReportType(option.value);
                    setShowReportTypeModal(false);
                  }}
                >
                  <View style={styles.modalOptionContent}>
                    <Ionicons
                      name={reportType === option.value ? 'checkmark-circle' : 'radio-button-off'}
                      size={24}
                      color={reportType === option.value ? '#6366f1' : '#9ca3af'}
                      style={styles.modalOptionIcon}
                    />
                    <View style={styles.modalOptionTextContainer}>
                      <Text style={styles.modalOptionText}>{option.label}</Text>
                      <Text style={styles.modalOptionDescription}>{option.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <FormButton
                title="Batal"
                variant="outline"
                onPress={() => setShowReportTypeModal(false)}
                fullWidth
                style={styles.modalCancelButton}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Periode Modal */}
        <Modal
          visible={showPeriodeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPeriodeModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPeriodeModal(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Pilih Periode</Text>
              <ScrollView style={styles.modalScrollView}>
                {monthOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      selectedPeriode === option.value && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedPeriode(option.value);
                      setShowPeriodeModal(false);
                      if (errors.periode) {
                        setErrors(prev => ({ ...prev, periode: '' }));
                      }
                    }}
                  >
                    <View style={styles.modalOptionContent}>
                      <Ionicons
                        name={selectedPeriode === option.value ? 'checkmark-circle' : 'radio-button-off'}
                        size={24}
                        color={selectedPeriode === option.value ? '#6366f1' : '#9ca3af'}
                        style={styles.modalOptionIcon}
                      />
                      <Text style={styles.modalOptionText}>{option.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <FormButton
                title="Batal"
                variant="outline"
                onPress={() => setShowPeriodeModal(false)}
                fullWidth
                style={styles.modalCancelButton}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Date Picker Modals - using react-native-paper-dates like AddPaymentScreen */}
        <DatePickerModal
          visible={showStartDatePicker}
          onDismiss={() => setShowStartDatePicker(false)}
          onConfirm={handleStartDateConfirm}
          date={startDate}
          mode="single"
          saveLabel="Simpan"
          label="Pilih Tanggal Mulai"
          animationType="slide"
          presentationStyle="pageSheet"
          locale="en"
        />

        <DatePickerModal
          visible={showEndDatePicker}
          onDismiss={() => setShowEndDatePicker(false)}
          onConfirm={handleEndDateConfirm}
          date={endDate}
          mode="single"
          saveLabel="Simpan"
          label="Pilih Tanggal Akhir"
          animationType="slide"
          presentationStyle="pageSheet"
          locale="en"
        />
      </View>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
          setSubmitting(false);
          navigation.goBack();
        }}
        type="success"
        duration={2000}
      />
    </PaperProvider>
  );
};

export default GenerateReportScreen;

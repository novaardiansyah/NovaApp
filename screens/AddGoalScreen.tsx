import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { PaperProvider, Appbar, TextInput, HelperText } from 'react-native-paper';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import { enGB } from 'react-native-paper-dates';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency, statusBarConfig } from '@/styles';
import { FormButton, Notification } from '@/components';
import { styles } from '@/styles/AddGoalScreen.styles';

registerTranslation('en', enGB);

interface AddGoalScreenProps {
  navigation: any;
  route?: any;
}

interface FormData {
  name: string;
  description: string;
  target_amount: string;
  current_amount: string;
  start_date: string;
  target_date: string;
}

interface FormErrors {
  name: string;
  target_amount: string;
  start_date: string;
  target_date: string;
}

const AddGoalScreen: React.FC<AddGoalScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [targetDatePickerVisible, setTargetDatePickerVisible] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [refreshOnSuccess, setRefreshOnSuccess] = useState(false);

  const getInitialFormData = (): FormData => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + 6);

    return {
      name: '',
      description: '',
      target_amount: '',
      current_amount: '0',
      start_date: today.toISOString().split('T')[0],
      target_date: futureDate.toISOString().split('T')[0],
    };
  };

  const initialFormData = getInitialFormData();

  const initialErrors: FormErrors = {
    name: '',
    target_amount: '',
    start_date: '',
    target_date: '',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  useEffect(() => {
    if (route?.params?.refresh) {
      setRefreshOnSuccess(true);
    }
  }, [route?.params?.refresh]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...initialErrors };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
      isValid = false;
    }

    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      newErrors.target_amount = 'Please enter a valid target amount';
      isValid = false;
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
      isValid = false;
    }

    if (!formData.target_date) {
      newErrors.target_date = 'Target date is required';
      isValid = false;
    }

    if (formData.start_date && formData.target_date) {
      const startDate = new Date(formData.start_date);
      const targetDate = new Date(formData.target_date);

      if (startDate >= targetDate) {
        newErrors.target_date = 'Target date must be after start date';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStartDateConfirm = (params: any) => {
    const year = params.date.getFullYear();
    const month = String(params.date.getMonth() + 1).padStart(2, '0');
    const day = String(params.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({ ...prev, start_date: formattedDate }));
    setStartDatePickerVisible(false);
    if (errors.start_date) {
      setErrors(prev => ({ ...prev, start_date: '' }));
    }
  };

  const handleTargetDateConfirm = (params: any) => {
    const year = params.date.getFullYear();
    const month = String(params.date.getMonth() + 1).padStart(2, '0');
    const day = String(params.date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setFormData(prev => ({ ...prev, target_date: formattedDate }));
    setTargetDatePickerVisible(false);
    if (errors.target_date) {
      setErrors(prev => ({ ...prev, target_date: '' }));
    }
  };

  const handleDateDismiss = () => {
    setStartDatePickerVisible(false);
    setTargetDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Simulate API call - in real implementation this would save to backend
      const newGoal = {
        id: Date.now(), // temporary ID
        name: formData.name,
        description: formData.description,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount) || 0,
        start_date: formData.start_date,
        target_date: formData.target_date,
        status: 'active',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNotification('Goal created successfully!');

      // Navigate back to Goals screen with refresh flag
      setTimeout(() => {
        navigation.navigate('Goals', { refresh: Date.now() });
      }, 1500);

    } catch (error) {
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = () => {
    // Reset form
    setFormData(getInitialFormData());
    setErrors(initialErrors);
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Create Financial Goal" />
        </Appbar.Header>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={handleRefresh}
                colors={['#6366f1']}
                tintColor="#6366f1"
              />
            }
          >
            <Text style={styles.description}>
              Create a new financial goal to track your savings targets and achieve your financial dreams.
            </Text>

            <TextInput
              label="Goal Name *"
              placeholder="Enter goal name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              autoCapitalize="words"
              left={<TextInput.Icon icon="flag" color="#6b7280" />}
            />
            {errors.name && <HelperText type="error" style={styles.helperText}>{errors.name}</HelperText>}

            <TextInput
              label="Description (Optional)"
              placeholder="Enter goal description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="file-document-outline" color="#6b7280" />}
            />

            <TextInput
              label="Target Amount *"
              placeholder="Enter target amount"
              value={formData.target_amount}
              onChangeText={(value) => handleInputChange('target_amount', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="cash" color="#6b7280" />}
            />
            {errors.target_amount && <HelperText type="error" style={styles.helperText}>{errors.target_amount}</HelperText>}

            <TextInput
              label="Current Amount (Optional)"
              placeholder="Enter current amount saved"
              value={formData.current_amount}
              onChangeText={(value) => handleInputChange('current_amount', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="wallet" color="#6b7280" />}
            />

            <TouchableOpacity onPress={() => setStartDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Start Date *"
                value={formData.start_date ? new Date(formData.start_date).toLocaleDateString() : ''}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                placeholder="Select start date"
                editable={false}
                left={<TextInput.Icon icon="calendar" color="#6b7280" />}
              />
            </TouchableOpacity>
            {errors.start_date && <HelperText type="error" style={styles.helperText}>{errors.start_date}</HelperText>}

            <TouchableOpacity onPress={() => setTargetDatePickerVisible(true)} activeOpacity={0.7}>
              <TextInput
                label="Target Date *"
                value={formData.target_date ? new Date(formData.target_date).toLocaleDateString() : ''}
                onChangeText={() => {}}
                mode="outlined"
                outlineColor="#e5e7eb"
                activeOutlineColor="#6366f1"
                style={styles.input}
                placeholder="Select target date"
                editable={false}
                left={<TextInput.Icon icon="calendar" color="#6b7280" />}
              />
            </TouchableOpacity>
            {errors.target_date && <HelperText type="error" style={styles.helperText}>{errors.target_date}</HelperText>}

            <FormButton
              title="Create Goal"
              onPress={handleSubmit}
              loading={submitting}
              icon="trophy"
              style={styles.createButton}
            />

            <FormButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              loading={submitting}
              style={styles.cancelButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Start Date Picker Modal */}
      <DatePickerModal
        visible={startDatePickerVisible}
        onDismiss={handleDateDismiss}
        onConfirm={handleStartDateConfirm}
        date={formData.start_date ? new Date(formData.start_date) : new Date()}
        mode="single"
        saveLabel="Save"
        label="Select start date"
        animationType="slide"
        presentationStyle="pageSheet"
        locale="en"
      />

      {/* Target Date Picker Modal */}
      <DatePickerModal
        visible={targetDatePickerVisible}
        onDismiss={handleDateDismiss}
        onConfirm={handleTargetDateConfirm}
        date={formData.target_date ? new Date(formData.target_date) : new Date()}
        mode="single"
        saveLabel="Save"
        label="Select target date"
        animationType="slide"
        presentationStyle="pageSheet"
        locale="en"
      />

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
          if (refreshOnSuccess) {
            navigation.navigate('Goals', { refresh: Date.now() });
          }
        }}
        type="success"
        duration={1500}
      />
    </PaperProvider>
  );
};

export default AddGoalScreen;
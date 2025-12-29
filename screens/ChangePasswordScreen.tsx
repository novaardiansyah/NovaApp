import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PaperProvider, Appbar, TextInput, HelperText } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton } from '@/components';
import { typography } from '@/styles';
import { styles } from '@/styles/ChangePasswordScreen.styles';
import APP_CONFIG from '@/config/app';

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const { getAuthHeader, updateToken } = useAuth();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const initialErrors = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  };
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };

  const handleChangePassword = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const headers = getAuthHeader();
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.data?.token) {
          await updateToken(data.data.token);
        }

        Alert.alert('Success', 'Password changed successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        setLoading(false);
        if (data.errors) {
          const newErrors = { ...errors };

          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
              newErrors[field as keyof typeof errors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', data.message || 'Failed to change password. Please try again.');
        }
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Ganti Kata Sandi" titleStyle={typography.appbar.titleNormal} />
        </Appbar.Header>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.description}>
              Silahkan masukkan kata sandi Anda saat ini dan buat kata sandi baru.
            </Text>

            <TextInput
              label="Kata sandi saat ini *"
              value={formData.current_password}
              onChangeText={(value) => handleInputChange('current_password', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              secureTextEntry
              style={{ backgroundColor: '#ffffff', marginBottom: 16, fontSize: typography.label.large }}
              placeholder="Kata sandi saat ini"
              left={<TextInput.Icon icon="lock" color="#9ca3af" />}
            />
            {errors.current_password ? <HelperText type="error" style={{ marginTop: -16, marginLeft: -6, marginBottom: 8 }}>{errors.current_password}</HelperText> : null}

            <TextInput
              label="Kata sandi baru *"
              value={formData.new_password}
              onChangeText={(value) => handleInputChange('new_password', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              secureTextEntry
              style={{ backgroundColor: '#ffffff', marginBottom: 16, fontSize: typography.label.large }}
              placeholder="Kata sandi baru"
              left={<TextInput.Icon icon="lock-plus" color="#9ca3af" />}
            />
            {errors.new_password ? <HelperText type="error" style={{ marginTop: -16, marginLeft: -6, marginBottom: 8 }}>{errors.new_password}</HelperText> : null}

            <TextInput
              label="Konfirmasi kata sandi baru *"
              value={formData.new_password_confirmation}
              onChangeText={(value) => handleInputChange('new_password_confirmation', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              secureTextEntry
              style={{ backgroundColor: '#ffffff', marginBottom: 16, fontSize: typography.label.large }}
              placeholder="Konfirmasi kata sandi baru"
              left={<TextInput.Icon icon="lock-check" color="#9ca3af" />}
            />
            {errors.new_password_confirmation ? <HelperText type="error" style={{ marginTop: -16, marginLeft: -6, marginBottom: 8 }}>{errors.new_password_confirmation}</HelperText> : null}

            <FormButton
              title="Simpan perubahan"
              onPress={handleChangePassword}
              loading={loading}
              icon="content-save"
              style={styles.addButton}
            />

            <FormButton
              title="Batal"
              onPress={() => {
                navigation?.navigate('ProfileMain', { refresh: Date.now() })
              }}
              variant="outline"
              style={styles.cancelButton}
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </PaperProvider>
  );
};

export default ChangePasswordScreen;

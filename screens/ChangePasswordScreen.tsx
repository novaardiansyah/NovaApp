import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { PaperProvider, Text, Appbar } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton, FormInput } from '@/components';
import APP_CONFIG from '@/config/app';

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const { getAuthHeader, updateToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validateForm = () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Current password is required');
      return false;
    }
    if (!newPassword.trim()) {
      Alert.alert('Error', 'New password is required');
      return false;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return false;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return false;
    }
    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      const headers = getAuthHeader();
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.data?.token) {
          await updateToken(data.data.token);
        }

        Alert.alert('Success', 'Password changed successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Ganti Kata Sandi" />
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
              Silahkan masukkan kata sandi Anda saat ini dan pilih kata sandi baru. Pastikan kata sandi baru Anda minimal 6 karakter.
            </Text>

            <FormInput
              label="Kata sandi saat ini"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              leftIcon="lock"
            />

            <FormInput
              label="Kata sandi baru"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              leftIcon="lock-plus"
            />

            <FormInput
              label="Konfirmasi kata sandi baru"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon="lock-check"
            />

            <FormButton
              title="Ganti Kata Sandi"
              onPress={handleChangePassword}
              loading={loading}
              icon="lock-check"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  cancelButton: {
    marginTop: -10,
  },
});

export default ChangePasswordScreen;
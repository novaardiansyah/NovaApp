import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PaperProvider, Surface, Divider } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { AppHeader, FormInput, FormButton, AppCopyright } from '@/components';

// Props type for navigation
interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Email harus diisi');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    setLoading(true);

    // Simulasi kirim OTP - ganti dengan logic yang sebenarnya
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'OTP Terkirim',
        'Kode OTP telah dikirim ke email Anda',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OTP', { email }),
          },
        ]
      );
    }, 2000);
  };

  const hasEmailErrors = () => {
    return email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <PaperProvider theme={Theme}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Surface style={styles.card} elevation={2}>
            <AppHeader
              subtitle="Reset Password"
              iconName="lock-reset"
            />

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a code to reset your password
              </Text>

              <FormInput
                label="Email address"
                value={email}
                onChangeText={setEmail}
                error={hasEmailErrors() ? "Please enter a valid email address" : undefined}
              />

              <FormButton
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                onPress={handleSendOTP}
                loading={loading}
                disabled={loading}
              />

              <View style={styles.footer}>
                <View style={styles.backContainer}>
                  <Text style={styles.backText}>Remember your password? </Text>
                  <Text
                    style={styles.backLink}
                    onPress={() => navigation.goBack()}
                  >
                    Back to Login
                  </Text>
                </View>
              </View>
            </View>
          </Surface>

          <AppCopyright />
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    minHeight: '100%',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  formContainer: {
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 14,
    color: '#6b7280',
  },
  backLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
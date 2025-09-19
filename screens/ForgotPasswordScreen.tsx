import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  PaperProvider,
  Text,
  TextInput,
  Button,
  HelperText,
  Surface,
  Avatar,
  Divider
} from 'react-native-paper';
import { Theme } from '../constants/colors';

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
            <View style={styles.header}>
              <View style={styles.brandContainer}>
                <View style={styles.brandCircle}>
                  <Avatar.Icon
                    size={32}
                    icon="lock-reset"
                    color="white"
                    style={styles.brandIcon}
                  />
                </View>
                <Text style={styles.brandName}>NovaApp</Text>
              </View>
              <Text style={styles.brandTagline}>Reset Password</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a code to reset your password
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Email address"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor={Theme.colors.primary}
                  left={<TextInput.Icon icon="email-outline" color="#9ca3af" />}
                />
                {hasEmailErrors() && (
                  <HelperText type="error" visible={!!hasEmailErrors()}>
                    Please enter a valid email address
                  </HelperText>
                )}
              </View>

              <Button
                mode="contained"
                onPress={handleSendOTP}
                loading={loading}
                disabled={loading}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>

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

          <View style={styles.bottomText}>
            <Text style={styles.copyright}>© 2024 NovaApp. All rights reserved.</Text>
          </View>
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
  header: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIcon: {
    backgroundColor: 'transparent',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 12,
  },
  brandTagline: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonContent: {
    height: 48,
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
  bottomText: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  copyright: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ForgotPasswordScreen;
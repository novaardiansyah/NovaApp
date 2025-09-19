import React, { useState, useEffect } from 'react';
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
interface OTPScreenProps {
  navigation: any;
  route: any;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { email } = route.params;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'OTP harus diisi');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP harus 6 digit');
      return;
    }

    setLoading(true);

    // Simulasi verifikasi OTP - ganti dengan logic yang sebenarnya
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'OTP verified successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ResetPassword', { email, otp }),
          },
        ]
      );
    }, 2000);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    // Simulasi resend OTP - ganti dengan logic yang sebenarnya
    setTimeout(() => {
      setResendLoading(false);
      setCountdown(60);
      Alert.alert('Success', 'OTP has been resent to your email');
    }, 2000);
  };

  const hasOTPErrors = () => {
    return otp && otp.length !== 6;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
                    icon="shield-check"
                    color="white"
                    style={styles.brandIcon}
                  />
                </View>
                <Text style={styles.brandName}>NovaApp</Text>
              </View>
              <Text style={styles.brandTagline}>Verification</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to
              </Text>
              <Text style={styles.emailText}>{email}</Text>

              <View style={styles.otpContainer}>
                <TextInput
                  label="Enter 6-digit OTP"
                  value={otp}
                  onChangeText={(text) => {
                    // Only allow numbers and limit to 6 digits
                    const numericText = text.replace(/[^0-9]/g, '');
                    if (numericText.length <= 6) {
                      setOTP(numericText);
                    }
                  }}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={6}
                  style={styles.otpInput}
                  outlineColor="#e5e7eb"
                  activeOutlineColor={Theme.colors.primary}
                  left={<TextInput.Icon icon="key" color="#9ca3af" />}
                />
                {hasOTPErrors() && (
                  <HelperText type="error" visible={!!hasOTPErrors()}>
                    OTP must be exactly 6 digits
                  </HelperText>
                )}
              </View>

              <Button
                mode="contained"
                onPress={handleVerifyOTP}
                loading={loading}
                disabled={loading || otp.length !== 6}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>Resend in {formatTime(countdown)}</Text>
                ) : (
                  <Text
                    style={styles.resendLink}
                    onPress={handleResendOTP}
                  >
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </Text>
                )}
              </View>

              <View style={styles.footer}>
                <Text
                  style={styles.backLink}
                  onPress={() => navigation.goBack()}
                >
                  ← Back to Forgot Password
                </Text>
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
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    backgroundColor: '#ffffff',
    fontSize: 18,
    letterSpacing: 2,
    textAlign: 'center',
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
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  countdownText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  backLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
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

export default OTPScreen;
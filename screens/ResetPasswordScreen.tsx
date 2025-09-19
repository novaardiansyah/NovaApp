import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PaperProvider, Surface, Divider, TextInput, HelperText } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { AppHeader, FormInput, FormButton, AppCopyright } from '@/components';

// Props type for navigation
interface ResetPasswordScreenProps {
  navigation: any;
  route: any;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const { email, otp } = route.params;

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    setLoading(true);

    // Simulasi reset password - ganti dengan logic yang sebenarnya
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Password has been reset successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }, 2000);
  };

  const hasPasswordErrors = () => {
    return password && password.length < 6;
  };

  const hasConfirmPasswordErrors = () => {
    return confirmPassword && confirmPassword !== password;
  };

  const isPasswordStrong = (pwd: string) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);
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
              iconName="lock-plus"
            />

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Your new password must be different from previous passwords
              </Text>

              <FormInput
                label="New Password"
                value={password}
                onChangeText={setPassword}
                error={hasPasswordErrors() ? "Password must be at least 6 characters" : undefined}
                secureTextEntry={secureTextEntry}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    color="#9ca3af"
                  />
                }
              />
              {password && !hasPasswordErrors() && (
                <HelperText type="info" visible={!hasPasswordErrors()}>
                  {isPasswordStrong(password)
                    ? "Strong password"
                    : "Add uppercase letter and number for stronger password"}
                </HelperText>
              )}

              <FormInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={hasConfirmPasswordErrors() ? "Passwords do not match" : undefined}
                secureTextEntry={secureConfirmTextEntry}
                right={
                  <TextInput.Icon
                    icon={secureConfirmTextEntry ? "eye-outline" : "eye-off-outline"}
                    onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                    color="#9ca3af"
                  />
                }
              />

              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <Text style={password.length >= 6 ? styles.requirementMet : styles.requirement}>
                  ✓ At least 6 characters
                </Text>
                <Text style={/[A-Z]/.test(password) ? styles.requirementMet : styles.requirement}>
                  ✓ One uppercase letter
                </Text>
                <Text style={/[0-9]/.test(password) ? styles.requirementMet : styles.requirement}>
                  ✓ One number
                </Text>
              </View>

              <FormButton
                title={loading ? 'Resetting Password...' : 'Reset Password'}
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              />

              <View style={styles.footer}>
                <Text
                  style={styles.backLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  ← Back to Login
                </Text>
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
  requirementsContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 4,
  },
  requirementMet: {
    fontSize: 13,
    color: '#10b981',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
  },
  backLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
});

export default ResetPasswordScreen;
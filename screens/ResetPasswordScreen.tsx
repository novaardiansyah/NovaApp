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
            <View style={styles.header}>
              <View style={styles.brandContainer}>
                <View style={styles.brandCircle}>
                  <Avatar.Icon
                    size={32}
                    icon="lock-plus"
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
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Your new password must be different from previous passwords
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  label="New Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={secureTextEntry}
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor={Theme.colors.primary}
                  left={<TextInput.Icon icon="lock-outline" color="#9ca3af" />}
                  right={
                    <TextInput.Icon
                      icon={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                      color="#9ca3af"
                    />
                  }
                />
                {hasPasswordErrors() && (
                  <HelperText type="error" visible={!!hasPasswordErrors()}>
                    Password must be at least 6 characters
                  </HelperText>
                )}
                {password && !hasPasswordErrors() && (
                  <HelperText type="info" visible={!hasPasswordErrors()}>
                    {isPasswordStrong(password)
                      ? "Strong password"
                      : "Add uppercase letter and number for stronger password"}
                  </HelperText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={secureConfirmTextEntry}
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor={Theme.colors.primary}
                  left={<TextInput.Icon icon="lock-check-outline" color="#9ca3af" />}
                  right={
                    <TextInput.Icon
                      icon={secureConfirmTextEntry ? "eye-outline" : "eye-off-outline"}
                      onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                      color="#9ca3af"
                    />
                  }
                />
                {hasConfirmPasswordErrors() && (
                  <HelperText type="error" visible={!!hasConfirmPasswordErrors()}>
                    Passwords do not match
                  </HelperText>
                )}
              </View>

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

              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

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

export default ResetPasswordScreen;
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
interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    setLoading(true);

    // Simulasi signup - ganti dengan logic yang sebenarnya
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Akun berhasil dibuat!');
    }, 2000);
  };

  const hasNameErrors = () => {
    return name && name.length < 3;
  };

  const hasEmailErrors = () => {
    return email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const hasPasswordErrors = () => {
    return password && password.length < 6;
  };

  const hasConfirmPasswordErrors = () => {
    return confirmPassword && confirmPassword !== password;
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
                    icon="account-plus"
                    color="white"
                    style={styles.brandIcon}
                  />
                </View>
                <Text style={styles.brandName}>NovaApp</Text>
              </View>
              <Text style={styles.brandTagline}>Create Your Account</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>Join us and start managing your finances</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  autoCapitalize="words"
                  style={styles.input}
                  outlineColor={Theme.colors.border ? '#e5e7eb' : '#e5e7eb'}
                  activeOutlineColor={Theme.colors.primary}
                  left={<TextInput.Icon icon="account-outline" color="#9ca3af" />}
                />
                {hasNameErrors() && (
                  <HelperText type="error" visible={!!hasNameErrors()}>
                    Name must be at least 3 characters
                  </HelperText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Email address"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  outlineColor={Theme.colors.border ? '#e5e7eb' : '#e5e7eb'}
                  activeOutlineColor={Theme.colors.primary}
                  left={<TextInput.Icon icon="email-outline" color="#9ca3af" />}
                />
                {hasEmailErrors() && (
                  <HelperText type="error" visible={!!hasEmailErrors()}>
                    Please enter a valid email address
                  </HelperText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={secureTextEntry}
                  style={styles.input}
                  outlineColor={Theme.colors.border ? '#e5e7eb' : '#e5e7eb'}
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
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={secureConfirmTextEntry}
                  style={styles.input}
                  outlineColor={Theme.colors.border ? '#e5e7eb' : '#e5e7eb'}
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

              <Button
                mode="contained"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <View style={styles.footer}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                  >
                    Sign in
                  </Text>
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
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
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

export default SignupScreen;
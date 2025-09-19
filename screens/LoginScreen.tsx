import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PaperProvider, Surface, Divider, TextInput } from 'react-native-paper';
import { Theme } from '../constants/colors';
import { AppHeader, FormInput, FormButton, AppCopyright } from '../components';

// Props type for navigation
interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    setLoading(true);

    // Simulasi login - ganti dengan logic yang sebenarnya
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Login berhasil!');
    }, 2000);
  };

  const hasEmailErrors = () => {
    return email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const hasPasswordErrors = () => {
    return password && password.length < 6;
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
              subtitle="Finance Management"
              iconName="account-circle"
            />

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>

              <FormInput
                label="Email address"
                value={email}
                onChangeText={setEmail}
                error={hasEmailErrors() ? "Please enter a valid email address" : undefined}
              />

              <FormInput
                label="Password"
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

              <FormButton
                title={loading ? 'Signing in...' : 'Sign in'}
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />

              <View style={styles.footer}>
                <Text
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  Forgot your password?
                </Text>
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <Text
                    style={styles.signupLink}
                    onPress={() => navigation.navigate('Signup')}
                  >
                    Sign up
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
  },
  footer: {
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default LoginScreen;
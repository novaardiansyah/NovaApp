import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PaperProvider, Surface, Divider, TextInput } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { AppHeader, FormInput, FormButton, AppCopyright } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import APP_CONFIG from '@/config/app';
import Constants from 'expo-constants';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (loading) return;
    
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password);

      if (!success) {
        Alert.alert('Error', 'Login gagal. Periksa email dan password Anda.');
      }

      // ! Jika berhasil login navigator otomatis memindahkan ke HomeScreen
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
              subtitle="Manajemen Keuangan"
            />

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Selamat Datang</Text>
              <Text style={styles.subtitle}>Masuk ke akun Anda</Text>

              <FormInput
                label="Alamat Email"
                value={email}
                onChangeText={setEmail}
                error={hasEmailErrors() ? "Silakan masukkan alamat email yang valid" : undefined}
              />

              <FormInput
                label="Kata Sandi"
                value={password}
                onChangeText={setPassword}
                error={hasPasswordErrors() ? "Kata sandi minimal 6 karakter" : undefined}
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
                title={loading ? 'Sedang Masuk...' : 'Masuk'}
                onPress={handleLogin}
                loading={loading}
              />

              {/* Debug Environment Variables - only show if not production */}
              {APP_CONFIG.ENV !== 'production' && (
                <View style={styles.debugContainer}>
                  <Text
                    style={styles.debugLink}
                    onPress={() => {
                      const envMessage = Object.entries(APP_CONFIG)
                        .map(([key, value]) => `EXPO_PUBLIC_${key.toUpperCase()}: ${value}`)
                        .join('\n\n');

                      Alert.alert('Variabel Lingkungan', envMessage);
                    }}
                  >
                    Debug Lingkungan
                  </Text>
                </View>
              )}

              <View style={styles.footer}>
                <Text
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  Lupa kata sandi?
                </Text>
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Belum punya akun? </Text>
                  <Text
                    style={styles.signupLink}
                    onPress={() => navigation.navigate('Signup')}
                  >
                    Daftar
                  </Text>
                </View>
              </View>
            </View>
          </Surface>

          <AppCopyright
            showVersion={true}
            version={Constants.expoConfig?.version || '1.0.0'}
          />
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
    padding: 16,
    paddingVertical: 60,
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
  debugContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  debugLink: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
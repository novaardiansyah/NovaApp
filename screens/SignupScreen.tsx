import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { PaperProvider, Surface, Divider, TextInput } from 'react-native-paper';
import { Theme } from '../constants/colors';
import { AppHeader, FormInput, FormButton, AppCopyright } from '../components';

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
            <AppHeader
              title="NovaApp"
              subtitle="Create Your Account"
              iconName="account-plus"
            />

            <Divider style={styles.divider} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>Join us and start managing your finances</Text>

              <FormInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                error={hasNameErrors() ? "Name must be at least 3 characters" : undefined}
              />

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

              <FormInput
                label="Confirm Password"
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

              <FormButton
                title={loading ? 'Creating Account...' : 'Create Account'}
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
              />

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
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default SignupScreen;
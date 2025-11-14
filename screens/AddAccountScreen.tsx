import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, Image, TouchableOpacity } from 'react-native'; 
import { PaperProvider, Appbar, Avatar } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton, FormInput } from '@/components';
import { Notification } from '@/components/Notification';
import accountService from '@/services/accountService';
import * as ImagePicker from 'expo-image-picker';
import { convertImageToBase64, validateImageFile } from '@/utils/imageUtils';

interface AddAccountScreenProps {
  navigation: any;
}

interface FormErrors {
  name?: string;
}

const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ navigation }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
  });
  const [selectedLogoBase64, setSelectedLogoBase64] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload logo.');
        return;
      }

      // Pick image with 1:1 ratio
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Validate file
        const validation = validateImageFile(asset);
        if (!validation.isValid) {
          Alert.alert('Error', validation.error);
          return;
        }

        setLogoLoading(true);

        try {
          // Convert image to base64
          const base64String = await convertImageToBase64(asset.uri);

          setLogoPreview(asset.uri);
          setSelectedLogoBase64(base64String);

          Alert.alert('Success', 'Logo dipilih! Klik "Buat Akun" untuk menyimpan.');
        } catch (error) {
          // Error already handled in convertImageToBase64
        } finally {
          setLogoLoading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  
  const handleSubmit = async () => {
    if (loading) return; // Prevent double request
        if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    setLoading(true);
    try {
      const accountData = {
        name: formData.name.trim(),
        ...(selectedLogoBase64 && { logo_base64: selectedLogoBase64 }),
      };

      const response = await accountService.createAccount(token, accountData);

      if (response.success) {
        setNotification('Akun berhasil dibuat!');
      } else {
        setLoading(false);

        if (response.errors) {
          const newErrors: FormErrors = {};

          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              newErrors[field as keyof FormErrors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', response.message || 'Failed to create account. Please try again.');
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Error adding account:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Tambah Akun" />
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
              Buat akun keuangan baru untuk mengelola uang Anda. Sediakan nama dan logo opsional.
            </Text>

            {/* Logo Section */}
            <View style={styles.logoSection}>
              <TouchableOpacity onPress={pickImage} disabled={logoLoading}>
                {logoPreview ? (
                  <Image
                    source={{ uri: logoPreview }}
                    style={styles.logoImage}
                  />
                ) : (
                  <Avatar.Icon size={80} icon="wallet" style={styles.logoIcon} />
                )}
                {logoLoading && (
                  <View style={styles.logoLoadingOverlay}>
                    <Avatar.Icon size={24} icon="loading" style={styles.loadingIcon} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.logoChangeText}>
                {selectedLogoBase64 ? 'Logo dipilih' : 'Ketuk untuk tambah logo'}
              </Text>
              <Text style={styles.logoSizeText}>
                Logo rasio 1:1 • Maks 2MB • JPEG, PNG, GIF, WEBP
              </Text>
            </View>

            <FormInput
              label="Nama Akun"
              value={formData.name}
              onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
              error={errors.name}
              leftIcon="wallet"
              required
            />

            <FormButton
              title="Buat Akun"
              onPress={handleSubmit}
              loading={loading}
              icon="plus-circle"
            />

            <FormButton
              title="Batal"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelButton}
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={function () {
          setNotification(null);
          navigation.navigate('BudgetMain', { refresh: Date.now() });
        }}
        type="success"
      />
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoIcon: {
    backgroundColor: '#6366f1',
  },
  logoChangeText: {
    fontSize: 14,
    color: '#6366f1',
    marginTop: 8,
    fontWeight: '500',
  },
  logoSizeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  logoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
  },
  loadingIcon: {
    backgroundColor: 'transparent',
  },
  cancelButton: {
    marginTop: -10,
  },
});

export default AddAccountScreen;
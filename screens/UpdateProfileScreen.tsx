import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, useWindowDimensions, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { PaperProvider, Appbar, Avatar, Button } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton, FormInput } from '@/components';
import * as ImagePicker from 'expo-image-picker';

interface UpdateProfileScreenProps {
  navigation: any;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [selectedAvatarBase64, setSelectedAvatarBase64] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const validateFile = (asset: any): boolean => {
    // Check file size (2MB max)
    const fileSize = asset.fileSize || asset.size;
    if (fileSize && fileSize > 2 * 1024 * 1024) {
      Alert.alert('Error', 'File size must be less than 2MB');
      return false;
    }

    // Check file type
    const mimeType = asset.mimeType || asset.type;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (mimeType && !allowedTypes.includes(mimeType)) {
      Alert.alert('Error', 'Only image files (JPEG, PNG, GIF, WEBP) are allowed');
      return false;
    }

    return true;
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Add data URL prefix if not present
          const base64WithPrefix = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64.split(',')[1]}`;
          resolve(base64WithPrefix);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload avatar.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Validate file
        if (!validateFile(asset)) {
          return;
        }

        setAvatarLoading(true);

        try {
          // Convert image to base64
          const base64String = await convertImageToBase64(asset.uri);

          setAvatarPreview(asset.uri);
          setSelectedAvatarBase64(base64String);

          Alert.alert('Success', 'Avatar selected! Click "Update Profile" to save changes.');
        } catch (error) {
          // Error already handled in convertImageToBase64
        } finally {
          setAvatarLoading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Only send fields that have changed
      const updateData: { name?: string; email?: string; avatar_base64?: string } = {};

      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }

      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }

      if (selectedAvatarBase64) {
        updateData.avatar_base64 = selectedAvatarBase64;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        Alert.alert('Info', 'No changes to update');
        setLoading(false);
        return;
      }

      const success = await updateUser(updateData);

      if (success) {
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Update Profile" />
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
              Update your profile information below. You can also change your profile picture here.
            </Text>

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage} disabled={avatarLoading}>
                {avatarPreview ? (
                  <Image
                    source={{ uri: avatarPreview }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Avatar.Icon size={80} icon="account" style={styles.avatarIcon} />
                )}
                {avatarLoading && (
                  <View style={styles.avatarLoadingOverlay}>
                    <Avatar.Icon size={24} icon="loading" style={styles.loadingIcon} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.avatarChangeText}>
                {selectedAvatarBase64 ? 'Avatar selected' : 'Tap to change avatar'}
              </Text>
            </View>

            <FormInput
              label="Name"
              value={formData.name}
              onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
              error={errors.name}
              leftIcon="account"
              required
            />

            <FormInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
              error={errors.email}
              leftIcon="email"
              required
            />

            <FormButton
              title="Update Profile"
              onPress={handleSubmit}
              loading={loading}
              icon="account-check"
            />

            <FormButton
              title="Cancel"
              onPress={() => {
                navigation?.navigate('ProfileMain', { refresh: Date.now() })
              }}
              variant="outline"
              style={styles.cancelButton}
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarIcon: {
    backgroundColor: '#6366f1',
  },
  avatarChangeText: {
    fontSize: 14,
    color: '#6366f1',
    marginTop: 8,
    fontWeight: '500',
  },
  avatarSizeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  avatarLoadingOverlay: {
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

export default UpdateProfileScreen;
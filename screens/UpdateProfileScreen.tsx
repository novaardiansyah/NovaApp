import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { PaperProvider, Appbar, Avatar, TextInput, HelperText } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton } from '@/components';
import * as ImagePicker from 'expo-image-picker';
import { typography } from '@/styles';
import { styles } from '@/styles/UpdateProfileScreen.styles';

interface UpdateProfileScreenProps {
  navigation: any;
}

const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [selectedAvatarBase64, setSelectedAvatarBase64] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);

  const initialErrors = {
    name: '',
    email: '',
  };
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const validateFile = (asset: any): boolean => {
    const fileSize = asset.fileSize || asset.size;
    if (fileSize && fileSize > 2 * 1024 * 1024) {
      Alert.alert('Error', 'File size must be less than 2MB');
      return false;
    }

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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        if (!validateFile(asset)) {
          return;
        }

        setAvatarLoading(true);

        try {
          const base64String = await convertImageToBase64(asset.uri);

          setAvatarPreview(asset.uri);
          setSelectedAvatarBase64(base64String);

          Alert.alert('Success', 'Avatar selected! Click "Update Profile" to save changes.');
        } catch (error) {
        } finally {
          setAvatarLoading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const updateData: { name?: string; email?: string; avatar_base64?: string } = {};

      const response = await updateUser(updateData);

      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        setLoading(false);

        if (response.errors) {
          const newErrors = { ...errors };

          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0 && field in newErrors) {
              newErrors[field as keyof typeof errors] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        } else {
          Alert.alert('Error', response.message || 'Failed to update profile. Please try again.');
        }
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Profil" titleStyle={typography.appbar.titleNormal} />
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
              Perbarui informasi profil di bawah ini, pasikan data yang Anda masukkan sudah benar.
            </Text>

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

            <TextInput
              label="Name *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={{ backgroundColor: '#ffffff', marginBottom: 16, fontSize: typography.label.large }}
              placeholder="Name"
              left={<TextInput.Icon icon="account" color="#9ca3af" />}
            />
            {errors.name ? <HelperText type="error" style={{ marginTop: -16, marginLeft: -6, marginBottom: 8 }}>{errors.name}</HelperText> : null}

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#6366f1"
              style={{ backgroundColor: '#ffffff', marginBottom: 16, fontSize: typography.label.large }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" color="#9ca3af" />}
            />
            {errors.email ? <HelperText type="error" style={{ marginTop: -16, marginLeft: -6, marginBottom: 8 }}>{errors.email}</HelperText> : null}

            <FormButton
              title="Simpan Perubahan"
              onPress={handleSubmit}
              loading={loading}
              icon="content-save"
              style={styles.addButton}
            />

            <FormButton
              title="Batal"
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

export default UpdateProfileScreen;

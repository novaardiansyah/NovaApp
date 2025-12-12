import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { PaperProvider, Appbar, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { Theme } from '@/constants/colors';
import { FormButton } from '@/components';
import paymentService from '@/services/paymentService';
import * as ImagePicker from 'expo-image-picker';

interface AddAttachmentScreenProps {
  navigation: any;
  route: any;
}

interface AttachmentItem {
  id: string;
  uri: string;
  name: string;
  size: number;
  type: string;
  base64?: string;
  isUploading: boolean;
  uploadProgress: number;
  uploaded: boolean;
  error?: string;
}

const AddAttachmentScreen: React.FC<AddAttachmentScreenProps> = ({ navigation, route }) => {
  const { paymentId } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<AttachmentItem[]>([]);

  const validateFile = (asset: any): { isValid: boolean; error?: string } => {
    return paymentService.validateFile(asset);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Mohon berikan izin akses galeri untuk mengunggah gambar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const validation = validateFile(asset);

        if (!validation.isValid) {
          Alert.alert('Kesalahan', validation.error);
          return;
        }

        await addAttachmentItem(asset);
      }
    } catch (error) {
      Alert.alert('Kesalahan', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Mohon berikan izin akses kamera untuk mengambil foto.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const validation = validateFile(asset);

        if (!validation.isValid) {
          Alert.alert('Kesalahan', validation.error);
          return;
        }

        await addAttachmentItem(asset);
      }
    } catch (error) {
      Alert.alert('Kesalahan', 'Gagal mengambil foto. Silakan coba lagi.');
    }
  };

  const addAttachmentItem = async (asset: any) => {
    const attachmentId = Date.now().toString();
    const newAttachment: AttachmentItem = {
      id: attachmentId,
      uri: asset.uri,
      name: asset.name || `file_${attachmentId}`,
      size: asset.fileSize || asset.size || 0,
      type: asset.mimeType || asset.type || 'application/octet-stream',
      isUploading: false,
      uploadProgress: 0,
      uploaded: false,
    };

    setSelectedAttachments(prev => [...prev, newAttachment]);

    try {
      const base64String = await paymentService.convertFileToBase64(asset.uri, newAttachment.type);
      setSelectedAttachments(prev =>
        prev.map(att =>
          att.id === attachmentId ? { ...att, base64: base64String } : att
        )
      );
    } catch (error) {
      setSelectedAttachments(prev =>
        prev.filter(att => att.id !== attachmentId)
      );
      Alert.alert('Kesalahan', 'Gagal memproses file. Silakan coba lagi.');
    }
  };

  const removeAttachment = (id: string) => {
    setSelectedAttachments(prev => prev.filter(att => att.id !== id));
  };

  const uploadAttachments = async () => {
    if (!token || !paymentId || selectedAttachments.length === 0) return;

    const readyToUpload = selectedAttachments.filter(att => att.base64 && !att.uploaded && !att.isUploading);
    if (readyToUpload.length === 0) {
      Alert.alert('Info', 'Tidak ada file untuk diunggah');
      return;
    }

    setLoading(true);

    setSelectedAttachments(prev =>
      prev.map(att =>
        att.base64 && !att.uploaded && !att.isUploading
          ? { ...att, isUploading: true, uploadProgress: 0 }
          : att
      )
    );

    try {
      const attachmentBase64Array = readyToUpload.map(att => att.base64!);

      const response = await paymentService.uploadMultipleAttachments(token, paymentId, {
        attachment_base64_array: attachmentBase64Array
      });

      if (response.success) {
        setSelectedAttachments(prev =>
          prev.map(att =>
            att.base64 && !att.uploaded
              ? { ...att, uploaded: true, isUploading: false, uploadProgress: 100 }
              : att
          )
        );

        const attachmentsCount = response.data?.attachments_count || readyToUpload.length;
        Alert.alert(
          'Unggah Selesai',
          `Berhasil mengunggah ${attachmentsCount} file`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedAttachments(prev => prev.filter(att => !att.uploaded));
              },
            },
          ]
        );
      } else {
        setSelectedAttachments(prev =>
          prev.map(att =>
            att.base64 && !att.uploaded
              ? { ...att, isUploading: false, error: response.message || 'Upload failed' }
              : att
          )
        );

        let errorMessage = response.message || 'Gagal mengunggah lampiran';
        if (response.errors) {
          if (Array.isArray(response.errors)) {
            errorMessage = response.errors.join(', ');
          } else if (typeof response.errors === 'object') {
            const errorMessages = Object.values(response.errors).flat();
            errorMessage = errorMessages.join(', ');
          }
        }

        Alert.alert('Kesalahan', errorMessage);
      }
    } catch (error) {
      setSelectedAttachments(prev =>
        prev.map(att =>
          att.base64 && !att.uploaded
            ? { ...att, isUploading: false, error: 'Kesalahan jaringan' }
            : att
        )
      );

      Alert.alert('Kesalahan', 'Gagal mengunggah lampiran. Silakan periksa koneksi Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const renderSelectedAttachmentItem = (attachment: AttachmentItem) => {
    const isImage = paymentService.isImageFile(attachment.type);

    return (
      <Card key={attachment.id} style={styles.selectedAttachmentCard}>
        <Card.Content style={styles.attachmentContent}>
          <View style={styles.attachmentLeft}>
            {isImage ? (
              <Image
                source={{ uri: attachment.uri }}
                style={styles.attachmentThumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.attachmentIcon}>
                <Ionicons name="image" size={24} color="white" />
              </View>
            )}
            <View style={styles.attachmentInfo}>
              <Text style={styles.attachmentName} numberOfLines={1}>
                {attachment.name}
              </Text>
              <Text style={styles.attachmentDetails}>
                {paymentService.formatFileSize(attachment.size)}
                {attachment.uploaded && ' ✓'}
                {attachment.error && ` - ${attachment.error}`}
              </Text>
              {attachment.isUploading && (
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${attachment.uploadProgress}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeAttachment(attachment.id)}
            disabled={attachment.isUploading}
          >
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Tambah Lampiran" />
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
              Anda dapat mengunggah beberapa file gambar lampiran sekaligus.
            </Text>

            {/* Selected Attachments */}
            {selectedAttachments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>File untuk Diunggah</Text>
                {selectedAttachments.map(renderSelectedAttachmentItem)}
                <FormButton
                  title={`Unggah ${selectedAttachments.length} File`}
                  onPress={uploadAttachments}
                  loading={loading}
                  icon="cloud-upload"
                  style={styles.uploadButton}
                />
              </View>
            )}

            {/* Add Attachment Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tambah Lampiran Baru</Text>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={takePhoto}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#3b82f6' }]}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText}>Ambil Foto</Text>
                  <Text style={styles.optionSubtext}>Gunakan kamera</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={pickImage}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="image" size={24} color="white" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText}>Pilih dari Galeri</Text>
                  <Text style={styles.optionSubtext}>JPG, PNG, GIF, WEBP (Maks 5MB)</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <FAB
          icon="eye"
          color="#ffffff"
          style={styles.fab}
          onPress={() => navigation.navigate('CurrentAttachments', { paymentId })}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 70,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  selectedAttachmentCard: {
    marginBottom: 8,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  attachmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  attachmentLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  attachmentIcon: {
    backgroundColor: '#8b5cf6'
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  attachmentDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  removeButton: {
    padding: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  uploadButton: {
    marginTop: 12,
  },
  attachmentOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});

export default AddAttachmentScreen;
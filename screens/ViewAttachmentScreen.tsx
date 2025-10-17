import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import paymentService from '@/services/paymentService';
import { commonStyles, statusBarConfig } from '@/styles';

interface ViewAttachmentScreenProps {
  navigation: any;
  route: any;
}

const { width, height } = Dimensions.get('window');

const ViewAttachmentScreen: React.FC<ViewAttachmentScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const {
    imageUrl,
    filename,
    fileSize,
    mimeType,
    attachmentId,
    paymentId
  } = route.params;

  const [imageLoading, setImageLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  
  const handleDelete = async () => {
    if (!token || !paymentId || !attachmentId) return;

    Alert.alert(
      'Delete Attachment',
      `Are you sure you want to delete "${filename}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const response = await paymentService.deleteAttachment(token, paymentId, attachmentId);

              if (response.success) {
                Alert.alert('Success', 'Attachment deleted successfully');
                navigation.goBack();
              } else {
                Alert.alert('Error', response.message || 'Failed to delete attachment');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete attachment');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="View Attachment" />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Display */}
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
              </View>
            )}
            <Image
              source={{
                uri: imageUrl,
                headers: {
                  'Cache-Control': 'no-cache'
                }
              }}
              style={styles.image}
              resizeMode="contain"
              onLoad={() => {
                console.log('Image loaded successfully:', imageUrl);
                setImageLoading(false);
              }}
              onError={(error) => {
                console.log('Image load error:', error.nativeEvent.error);
                console.log('Image URL:', imageUrl);
                setImageLoading(false);
                Alert.alert('Error', 'Failed to load image. Please check your connection.');
              }}
            />
          </View>

          {/* Attachment Details */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>File Name</Text>
                <Text style={styles.detailsValue} numberOfLines={1}>
                  {filename}
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>File Size</Text>
                <Text style={styles.detailsValue}>
                  {fileSize}
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>File Type</Text>
                <Text style={styles.detailsValue}>
                  {mimeType || 'image/png'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        <FAB
          icon="trash-can-outline"
          color="#ffffff"
          style={[styles.fab, {
            bottom: -6
          }]}
          onPress={handleDelete}
          disabled={deleting}
          loading={deleting}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: height * 0.5,
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    margin: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 2,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
    borderRadius: 30,
  },
});

export default ViewAttachmentScreen;
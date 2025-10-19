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
import { Notification } from '@/components';

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
    paymentId,
    filepath
  } = route.params;

  const [imageLoading, setImageLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  
  const handleDelete = async () => {
    if (!token || !paymentId || !filepath) {
      return;
    }

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
              const response = await paymentService.deleteAttachmentByFilepath(token, paymentId, filepath);

              if (response.success) {
                setNotification('Attachment deleted successfully');
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
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="View Attachment" />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 75 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Display */}
          <Card style={styles.imageContainer}>
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
                setImageLoading(false);
              }}
              onError={(error) => {
                setImageLoading(false);
                Alert.alert('Error', 'Failed to load image. Please check your connection.');
              }}
            />
          </Card>

          {/* Attachment Details */}
          <Card style={styles.detailsCard}>
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
          </Card>
        </ScrollView>

        {!deleting && !notification && (
          <FAB
            icon="trash-can-outline"
            color="#ffffff"
            style={styles.fab}
            onPress={handleDelete}
          />
        )}
      </SafeAreaView>

      <Notification
        visible={!!notification}
        message={notification || ''}
        onDismiss={() => {
          setNotification(null);
          navigation.navigate('CurrentAttachments', {
            paymentId: paymentId,
            refresh: true
          });
        }}
        type="success"
        duration={2000}
      />
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
    width: '92%',
    height: 300,
    position: 'relative',
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 8,
    elevation: 3,
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
    resizeMode: 'cover',
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
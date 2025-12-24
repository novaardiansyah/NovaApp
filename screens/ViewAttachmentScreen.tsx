import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, FAB } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import paymentService from '@/services/paymentService';
import { statusBarConfig, typography } from '@/styles';
import { Notification } from '@/components';

interface ViewAttachmentScreenProps {
  navigation: any;
  route: any;
}

const { height } = Dimensions.get('window');

const ViewAttachmentScreen: React.FC<ViewAttachmentScreenProps> = ({ navigation, route }) => {
  const { token } = useAuth();
  const {
    imageUrl,
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
      'Hapus Lampiran',
      'Apakah Anda yakin ingin menghapus lampiran ini? Tindakan ini tidak dapat dibatalkan.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const response = await paymentService.deleteAttachmentByFilepath(token, paymentId, filepath);

              if (response.success) {
                setNotification('Lampiran berhasil dihapus');
              } else {
                Alert.alert('Kesalahan', response.message || 'Gagal menghapus lampiran');
              }
            } catch (error) {
              Alert.alert('Kesalahan', 'Gagal menghapus lampiran');
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
          <Appbar.Content title="Lihat Lampiran" titleStyle={typography.appbar.titleNormal} />
        </Appbar.Header>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Display - Full Screen */}
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
                setImageLoading(false);
              }}
              onError={(error) => {
                setImageLoading(false);
                Alert.alert('Kesalahan', 'Gagal memuat gambar. Silakan periksa koneksi Anda.');
              }}
            />
          </View>
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
  imageContainer: {
    minHeight: height * 0.9,
    marginHorizontal: 0,
    marginTop: 16,
    borderRadius: 0,
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
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
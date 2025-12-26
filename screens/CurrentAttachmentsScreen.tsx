import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, StatusBar, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, Card, FAB, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import CurrentAttachmentsSkeleton from '@/components/CurrentAttachmentsSkeleton';
import paymentService from '@/services/paymentService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, getScrollContainerStyle, statusBarConfig, typography } from '@/styles';
import { styles } from '@/styles/CurrentAttachmentsScreen.styles';

interface CurrentAttachmentsScreenProps {
  navigation: any;
  route: any;
}

const CurrentAttachmentsScreen: React.FC<CurrentAttachmentsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { paymentId, refresh } = route.params;
  const [currentAttachments, setCurrentAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pressedCardId, setPressedCardId] = useState<number | null>(null);

  const loadCurrentAttachments = async () => {
    if (!token || !paymentId) return;

    setLoading(true);
    try {
      const response = await paymentService.getPaymentAttachments(token, paymentId);

      if (response.success && response.data && Array.isArray(response.data)) {
        const attachments = response.data.map((attachment: any) => ({
          ...attachment,
          mime_type: 'image/png',
          filename: `image-${attachment.id}.${attachment.extension || 'png'}`
        }));
        setCurrentAttachments(attachments);
      } else {
        setCurrentAttachments([]);
      }
    } catch (error) {
      console.error('Error loading current attachments:', error);
      setCurrentAttachments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refresh) {
      handleRefresh();
    } else {
      loadCurrentAttachments();
    }
  }, [paymentId, refresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentAttachments([]);
    setLoading(true);
    await loadCurrentAttachments();
    setRefreshing(false);
  };

  const handleAttachmentPress = (attachment: any) => {
    navigation.navigate('ViewAttachment', {
      imageUrl: attachment?.original?.url || attachment.url,
      paymentId: paymentId,
      filepath: attachment.filepath
    });
  };

  const renderAttachmentItem = (attachment: any, index: number) => {
    return (
      <View key={attachment.id}>
        <Pressable
          onPress={() => handleAttachmentPress(attachment)}
          onPressIn={() => setPressedCardId(attachment.id)}
          onPressOut={() => setPressedCardId(null)}
          style={[pressedCardId === attachment.id && styles.attachmentCardPressed]}
        >
          <View style={styles.attachmentItem}>
            <View style={styles.attachmentLeft}>
              <View style={styles.attachmentIcon}>
                <Image
                  source={{ uri: attachment.file_url || attachment.url }}
                  style={styles.attachmentThumbnail}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {attachment.filename}
                </Text>
                <Text style={styles.attachmentDetails}>
                  {attachment.formatted_size || paymentService.formatFileSize(attachment.file_size)}
                </Text>
              </View>
            </View>
            <View style={styles.attachmentRight}>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </View>
        </Pressable>
        {index < currentAttachments.length - 1 && <Divider style={styles.attachmentDivider} />}
      </View>
    );
  };

  if (loading || refreshing) {
    return (
      <PaperProvider theme={Theme}>
        <SafeAreaView style={commonStyles.container} edges={['left', 'right']}>
          <StatusBar {...statusBarConfig} />
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Lampiran Saat Ini" titleStyle={typography.appbar.titleNormal} />
          </Appbar.Header>
          <View style={styles.loadingContainer}>
            <CurrentAttachmentsSkeleton />
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaView style={commonStyles.container} edges={['left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Lampiran Saat Ini" titleStyle={typography.appbar.titleNormal} />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
          scrollEventThrottle={400}
        >
          <View style={styles.attachmentsSection}>
            {currentAttachments.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyCardContent}>
                  <Ionicons name="attach-outline" size={48} color="#9ca3af" />
                  <Text style={styles.emptyText}>Belum ada lampiran</Text>
                  <Text style={styles.emptySubtext}>Tambahkan lampiran pertama untuk transaksi ini melalui tombol di bawah</Text>
                </Card.Content>
              </Card>
            ) : (
              <>
                <Text style={styles.attachmentsCount}>
                  {currentAttachments.length} lampiran
                </Text>
                <Card style={styles.attachmentsCard}>
                  <Card.Content style={styles.attachmentsCardContent}>
                    {currentAttachments.map((attachment, index) => renderAttachmentItem(attachment, index))}
                  </Card.Content>
                </Card>
              </>
            )}
          </View>
        </ScrollView>

        <FAB
          icon="plus"
          color="#ffffff"
          style={[styles.fab, { bottom: -6 }]}
          onPress={() => navigation.navigate('AddAttachment', { paymentId })}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default CurrentAttachmentsScreen;
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Linking, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Button, List, Avatar, Switch, ActivityIndicator } from 'react-native-paper';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Updates from 'expo-updates';
import { Theme } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getScrollContainerStyle, typography } from '@/styles';
import { styles } from '@/styles/ProfileScreen.styles';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, token, logout, toggleNotificationSettings } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  useEffect(() => {
    if (user?.has_allow_notification !== undefined) {
      setNotificationsEnabled(user.has_allow_notification);
    }
  }, [user]);

  const handleCheckUpdate = async () => {
    if (__DEV__) {
      Alert.alert('Info', 'Pembaruan tidak tersedia dalam mode development.');
      return;
    }

    setIsCheckingUpdate(true);
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert(
          'Pembaruan Tersedia',
          'Versi baru aplikasi tersedia. Apakah Anda ingin mengunduh dan menginstal sekarang?',
          [
            {
              text: 'Nanti',
              style: 'cancel',
            },
            {
              text: 'Perbarui',
              onPress: async () => {
                try {
                  setIsCheckingUpdate(true);
                  await Updates.fetchUpdateAsync();
                  Alert.alert(
                    'Pembaruan Selesai',
                    'Aplikasi akan dimulai ulang untuk menerapkan pembaruan.',
                    [
                      {
                        text: 'OK',
                        onPress: async () => {
                          await Updates.reloadAsync();
                        },
                      },
                    ]
                  );
                } catch (error) {
                  console.error('Error fetching update:', error);
                  Alert.alert('Gagal', 'Gagal mengunduh pembaruan. Silakan coba lagi.');
                } finally {
                  setIsCheckingUpdate(false);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Info', 'Aplikasi Anda sudah versi terbaru.');
      }
    } catch (error: any) {
      console.error('Error checking for updates:', error);
      Alert.alert('Gagal', error?.message || 'Gagal memeriksa pembaruan. Silakan coba lagi.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!token) return;

    try {
      setNotificationsEnabled(enabled); // Optimistic update

      const success = await toggleNotificationSettings(enabled);

      if (!success) {
        // Revert on error
        setNotificationsEnabled(!enabled);
      }
    } catch (error) {
      // Revert on error
      setNotificationsEnabled(!enabled);
      console.error('Error updating notification settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi keluar',
      'Apakah anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = async () => {
    const urlPrivacyPolicy = 'https://novaardiansyah.my.id/live/nova-app/privacy-policy';

    try {
      await WebBrowser.openBrowserAsync(urlPrivacyPolicy, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        enableBarCollapsing: true,
      });
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Linking.openURL(urlPrivacyPolicy);
    }
  };

  const handleTermsOfService = async () => {
    const urlTermsOfService = 'https://novaardiansyah.my.id/live/nova-app/terms-of-service';

    try {
      await WebBrowser.openBrowserAsync(urlTermsOfService, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        enableBarCollapsing: true,
      });
    } catch (error) {
      console.error('Error opening terms of service:', error);
      Linking.openURL(urlTermsOfService);
    }
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}>
          <View style={styles.profileSection}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatarImage}
              />
            ) : (
              <Avatar.Icon size={64} icon="account" style={styles.avatar} />
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
              <Text style={styles.userId}>ID: {user?.code || ''}</Text>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <List.Section>
              <List.Subheader style={styles.listSubheader}>Informasi Akun</List.Subheader>

              <List.Item
                title="Edit Profil"
                titleStyle={styles.listItemTitle}
                description="Perbarui informasi profil Anda"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="account-edit" />}
                onPress={() => navigation.navigate('UpdateProfile')}
              />

              <List.Item
                title="Ganti Kata Sandi"
                titleStyle={styles.listItemTitle}
                description="Perubah kata sandi akun Anda"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="lock-reset" />}
                onPress={() => navigation.navigate('ChangePassword')}
              />
            </List.Section>

            <View style={styles.divider} />

            <List.Section>
              <List.Subheader style={styles.listSubheader}>Pengaturan Umum</List.Subheader>

              <List.Item
                title="Terima Notifikasi"
                titleStyle={styles.listItemTitle}
                description="Notifikasi aplikasi Anda"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationToggle}
                    color="#6366f1"
                  />
                )}
              />

              <List.Item
                title="Bahasa"
                titleStyle={styles.listItemTitle}
                description="Indonesia"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="translate" />}
                onPress={() => { }}
              />
            </List.Section>

            <View style={styles.divider} />

            <List.Section>
              <List.Subheader style={styles.listSubheader}>Tentang Aplikasi</List.Subheader>

              <List.Item
                title="Kebijakan Privasi"
                titleStyle={styles.listItemTitle}
                description="Lihat kebijakan privasi kami"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="shield-account" />}
                onPress={handlePrivacyPolicy}
              />

              <List.Item
                title="Syarat dan Ketentuan"
                titleStyle={styles.listItemTitle}
                description="Lihat syarat dan ketentuan kami"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="file-document" />}
                onPress={handleTermsOfService}
              />

              <List.Item
                title="Periksa Pembaruan"
                titleStyle={styles.listItemTitle}
                description="Periksa pembaruan konten terbaru"
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="update" />}
                right={() => isCheckingUpdate ? (
                  <ActivityIndicator size="small" color="#6366f1" style={{ marginRight: 8 }} />
                ) : null}
                onPress={handleCheckUpdate}
                disabled={isCheckingUpdate}
              />

              <List.Item
                title="Versi Aplikasi"
                titleStyle={styles.listItemTitle}
                description={Constants.expoConfig?.version || '-'}
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="information" />}
              />

              <List.Item
                title="Hak Cipta"
                titleStyle={styles.listItemTitle}
                description={`© ${new Date().getFullYear()} Nova Ardiansyah`}
                descriptionStyle={styles.listItemDescription}
                left={props => <List.Icon {...props} icon="copyright" />}
              />
            </List.Section>
          </View>

          <Button
            mode="contained"
            icon="logout"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#ef4444"
            labelStyle={styles.logoutButtonLabel}
          >
            Keluar
          </Button>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default ProfileScreen;
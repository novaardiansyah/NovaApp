import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Text, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Button, List, Avatar, Switch, ActivityIndicator } from 'react-native-paper';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Updates from 'expo-updates';
import { Theme } from '@/constants/colors';
import { AppCopyright } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getScrollContainerStyle, statusBarConfig } from '@/styles';

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
    } catch (error) {
      console.error('Error checking for updates:', error);
      Alert.alert('Gagal', 'Gagal memeriksa pembaruan. Silakan coba lagi.');
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
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar {...statusBarConfig} />
        <ScrollView
          contentContainerStyle={getScrollContainerStyle(insets)}>
          {/* Profile Info */}
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

          {/* Settings */}
          <View style={styles.settingsSection}>
            <List.Section>
              <List.Subheader>Informasi Akun</List.Subheader>

              <List.Item
                title="Edit Profil"
                description="Perbarui informasi profil Anda"
                left={props => <List.Icon {...props} icon="account-edit" />}
                onPress={() => navigation.navigate('UpdateProfile')}
              />

              <List.Item
                title="Ganti Kata Sandi"
                description="Perubah kata sandi akun Anda"
                left={props => <List.Icon {...props} icon="lock-reset" />}
                onPress={() => navigation.navigate('ChangePassword')}
              />
            </List.Section>

            <View style={styles.divider} />

            <List.Section>
              <List.Subheader>Pengaturan Umum</List.Subheader>

              <List.Item
                title="Terima Notifikasi"
                description="Notifikasi aplikasi Anda"
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
                description="Indonesia"
                left={props => <List.Icon {...props} icon="translate" />}
                onPress={() => { }}
              />
            </List.Section>

            <View style={styles.divider} />

            <List.Section>
              <List.Subheader>Tentang Aplikasi</List.Subheader>

              <List.Item
                title="Kebijakan Privasi"
                description="Lihat kebijakan privasi kami"
                left={props => <List.Icon {...props} icon="shield-account" />}
                onPress={handlePrivacyPolicy}
              />

              <List.Item
                title="Syarat dan Ketentuan"
                description="Lihat syarat dan ketentuan kami"
                left={props => <List.Icon {...props} icon="file-document" />}
                onPress={handleTermsOfService}
              />

              <List.Item
                title="Periksa Pembaruan"
                description="Periksa versi terbaru aplikasi"
                left={props => <List.Icon {...props} icon="update" />}
                right={() => isCheckingUpdate ? (
                  <ActivityIndicator size="small" color="#6366f1" style={{ marginRight: 8 }} />
                ) : null}
                onPress={handleCheckUpdate}
                disabled={isCheckingUpdate}
              />

              <List.Item
                title="Versi Aplikasi"
                description={Constants.expoConfig?.version || '-'}
                left={props => <List.Icon {...props} icon="information" />}
              />
            </List.Section>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
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
          </View>

          <AppCopyright />
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  profileSection: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 2,
  },
  userId: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  settingsSection: {
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  logoutSection: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  logoutButton: {
    marginBottom: 8,
  },
  logoutButtonLabel: {
    color: '#ffffff',
  },
});

export default ProfileScreen;
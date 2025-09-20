import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Text } from 'react-native';
import { PaperProvider, Button, List, Avatar, Switch } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { AppCopyright } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout, fetchUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleRefreshProfile = async () => {
    await fetchUser();
    Alert.alert('Success', 'Profile refreshed successfully');
  };

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <Avatar.Icon size={64} icon="account" style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
              <Text style={styles.userId}>ID: {user?.id || ''}</Text>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.settingsSection}>
            <List.Section>
              <List.Subheader>Preferences</List.Subheader>

              <List.Item
                title="Push Notifications"
                description="Enable or disable notifications"
                left={props => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    color="#6366f1"
                  />
                )}
              />

              <List.Item
                title="Dark Mode"
                description="Toggle dark theme"
                left={props => <List.Icon {...props} icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    color="#6366f1"
                  />
                )}
              />

              <List.Item
                title="Language"
                description="English"
                left={props => <List.Icon {...props} icon="translate" />}
                onPress={() => {}}
              />
            </List.Section>

            <View style={styles.divider} />

            <List.Section>
              <List.Subheader>Account</List.Subheader>

              <List.Item
                title="Refresh Profile"
                description="Get latest user data"
                left={props => <List.Icon {...props} icon="refresh" />}
                onPress={handleRefreshProfile}
              />

              <List.Item
                title="Change Password"
                description="Update your password"
                left={props => <List.Icon {...props} icon="lock-reset" />}
                onPress={() => Alert.alert('Info', 'Change password feature coming soon!')}
              />

              <List.Item
                title="Privacy Policy"
                left={props => <List.Icon {...props} icon="shield-account" />}
                onPress={() => Linking.openURL('https://example.com/privacy')}
              />

              <List.Item
                title="Terms of Service"
                left={props => <List.Icon {...props} icon="file-document" />}
                onPress={() => Linking.openURL('https://example.com/terms')}
              />
            </List.Section>

            <View style={styles.divider} />

            <List.Section>
              <List.Subheader>About</List.Subheader>

              <List.Item
                title="App Version"
                description="1.0.0"
                left={props => <List.Icon {...props} icon="information" />}
              />

              <List.Item
                title="Contact Support"
                description="Get help with the app"
                left={props => <List.Icon {...props} icon="help-circle" />}
                onPress={() => Linking.openURL('mailto:support@novaapp.com')}
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
              Logout
            </Button>
          </View>

          <AppCopyright />
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    minHeight: '100%',
  },
  profileSection: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
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
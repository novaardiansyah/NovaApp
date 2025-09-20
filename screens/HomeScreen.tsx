import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, RefreshControl } from 'react-native';
import { PaperProvider, Button, Avatar, List } from 'react-native-paper';
import { Theme } from '@/constants/colors';
import { AppCopyright } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, token, logout, fetchUser, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

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
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <PaperProvider theme={Theme}>
        <View style={styles.container}>
          <Text>Please login first</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            Go to Login
          </Button>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={Theme}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Avatar.Icon size={64} icon="account" style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
              <Text style={styles.userId}>ID: {user?.id || ''}</Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.infoSection}>
            <List.Item
              title="Token Status"
              description={token ? 'Active' : 'Inactive'}
              left={props => <List.Icon {...props} icon="key" />}
              right={props => (
                <View style={[styles.statusDot, token ? styles.active : styles.inactive]} />
              )}
            />

            <List.Item
              title="Account ID"
              description={user?.id?.toString() || 'N/A'}
              left={props => <List.Icon {...props} icon="identifier" />}
            />

            <List.Item
              title="Email"
              description={user?.email || 'N/A'}
              left={props => <List.Icon {...props} icon="email" />}
            />
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <Button
              mode="outlined"
              icon="refresh"
              onPress={handleRefresh}
              style={styles.actionButton}
              loading={refreshing}
              disabled={refreshing}
            >
              Refresh Profile
            </Button>

            <Button
              mode="contained"
              icon="logout"
              onPress={handleLogout}
              style={styles.logoutButton}
              buttonColor="#ef4444"
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
  infoSection: {
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  active: {
    backgroundColor: '#10b981',
  },
  inactive: {
    backgroundColor: '#ef4444',
  },
  actionsSection: {
    padding: 24,
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
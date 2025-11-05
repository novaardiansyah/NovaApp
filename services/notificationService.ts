import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import APP_CONFIG from '@/config/app';

export interface NotificationTokenData {
  token: string;
  platform: 'ios' | 'android';
  appId?: string;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.requestPermissions();
      await this.registerToken();
    } catch (error) {
      console.error('Push notification initialization failed:', error);
    }
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  private async registerToken(): Promise<void> {
    try {
      if (!this.hasPushNotificationSupport()) {
        console.warn('Push notifications not supported on this device');
        return;
      }

      // Request permissions first
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Push notification permissions denied');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      if (token) {
        this.token = token.data;
        await this.storeTokenLocally(this.token);
        await this.setTokenSyncStatus(false); // Token generated but not synced yet
      }
    } catch (error) {
      console.error('Error registering Expo push token:', error);
    }
  }

  private hasPushNotificationSupport(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }

  private async storeTokenLocally(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('push_notification_token', token);
      await AsyncStorage.setItem('push_token_platform', Platform.OS as 'ios' | 'android');
    } catch (error) {
      console.error('Error storing push token locally:', error);
    }
  }

  async getStoredToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }

    try {
      const storedToken = await AsyncStorage.getItem('push_notification_token');
      this.token = storedToken;
      return storedToken;
    } catch (error) {
      console.error('Error retrieving stored push token:', error);
      return null;
    }
  }

  async getTokenData(): Promise<NotificationTokenData | null> {
    try {
      const token = await this.getStoredToken();
      const platform = await AsyncStorage.getItem('push_token_platform') as 'ios' | 'android' | null;

      if (!token || !platform) {
        return null;
      }

      return {
        token,
        platform,
        appId: Constants.expoConfig?.extra?.eas?.projectId,
      };
    } catch (error) {
      console.error('Error getting token data:', error);
      return null;
    }
  }

  async setTokenSyncStatus(synced: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem('notification_token_synced', synced ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting token sync status:', error);
    }
  }

  async getTokenSyncStatus(): Promise<boolean> {
    try {
      const synced = await AsyncStorage.getItem('notification_token_synced');
      return synced === 'true';
    } catch (error) {
      console.error('Error getting token sync status:', error);
      return false;
    }
  }

  async clearNotificationTokenForLogout(authToken: string): Promise<boolean> {
    try {
      // Only clear notification_token, preserve has_allow_notification
      const notificationSettings = {
        notification_token: null,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(notificationSettings),
      });

      if (response.ok) {
        // Clear local token (for logout)
        await this.clearLocalToken();
        await this.setTokenSyncStatus(false); // Reset sync status on logout
        return true;
      } else {
        console.error('Failed to clear notification token for logout:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error clearing notification token for logout:', error);
      return false;
    }
  }

  private async clearLocalToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('push_notification_token');
      await AsyncStorage.removeItem('push_token_platform');
      this.token = null;
    } catch (error) {
      console.error('Error clearing local push token:', error);
    }
  }

  async autoSyncTokenWhenReady(authToken: string): Promise<void> {
    const checkAndSync = async (): Promise<void> => {
      try {
        const isSynced = await this.getTokenSyncStatus();
        if (isSynced) {
          return;
        }

        const tokenData = await this.getTokenData();
        if (!tokenData?.token) {
          // Token not ready yet, check again later
          setTimeout(checkAndSync, 2000);
          return;
        }

        // Token ready and not synced, sync now
        const notificationSettings = {
          notification_token: tokenData.token,
        };

        const response = await fetch(`${APP_CONFIG.API_BASE_URL}/notifications/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(notificationSettings),
        });

        if (response.ok) {
          await this.setTokenSyncStatus(true);
        } else {
          console.error('Failed to auto-sync notification token:', response.status);
        }
      } catch (error) {
        console.error('Error in auto-sync:', error);
      }
    };

    // Start checking
    checkAndSync();
  }

  async clearToken(): Promise<void> {
    await this.clearLocalToken();
  }

  configureNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async scheduleNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: trigger || null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  addNotificationListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  removeSubscription(subscription: Notifications.Subscription): void {
    subscription.remove();
  }
}

export default PushNotificationService.getInstance();
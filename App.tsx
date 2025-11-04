import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from '@/contexts/AuthContext';
import RootNavigator from '@/navigation/RootNavigator';
import PushNotificationService from '@/services/notificationService';

// Keep the splash screen visible while we initialize the app
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Hide splash screen when app is ready
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();
  }, []);

  // Configure notification handlers at app startup
  useEffect(() => {
    PushNotificationService.configureNotificationHandler();

    // Handle notification responses when user taps notification
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      // Handle notification tap based on data
      if (data.type) {
        console.log('Notification tapped:', data);
        // Navigate based on notification type
        // This can be expanded to handle different notification types
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APP_CONFIG from '@/config/app';
import PushNotificationService from '@/services/notificationService';

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  code?: string;
  has_allow_notification?: boolean;
  notification_token?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  getAuthHeader: () => { Authorization: string } | {};
  fetchUser: () => Promise<boolean>;
  updateToken: (newToken: string) => Promise<void>;
  updateUser: (userData: { name?: string; email?: string; avatar_base64?: string }) => Promise<boolean>;
  syncNotificationSettings: () => Promise<boolean>;
  toggleNotificationSettings: (enabled: boolean) => Promise<boolean>;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  
  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        PushNotificationService.configureNotificationHandler();
        PushNotificationService.initialize();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL_GO}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseJson = await response.json();

      if (response.ok) {
        const token = responseJson.data?.token || null;

        if (token) {
          await AsyncStorage.setItem('auth_token', token);
          setToken(token);

          const userFetched = await fetchUser(token);

          if (userFetched) {
            PushNotificationService.configureNotificationHandler();
            await PushNotificationService.initialize();

            PushNotificationService.autoSyncTokenWhenReady(token);
          }

          return userFetched;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const fetchUser = async (currentToken?: string | null): Promise<boolean> => {
    const tokenToUse = currentToken || token;
    if (!tokenToUse) return false;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenToUse}`,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/user`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.data || data;

        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await PushNotificationService.clearNotificationTokenForLogout(token);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        await fetch(`${APP_CONFIG.API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers,
        });
      }

      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('auth_token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Error updating token:', error);
    }
  };

  const updateUser = async (userData: { name?: string; email?: string; avatar_base64?: string }): Promise<boolean> => {
    if (!token) {
      return false;
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const requestBody: any = {};

      if (userData.name) requestBody.name = userData.name;
      if (userData.email) requestBody.email = userData.email;
      if (userData.avatar_base64) requestBody.avatar_base64 = userData.avatar_base64;

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.data.user;
        await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const syncNotificationSettings = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const tokenData = await PushNotificationService.getTokenData();

      const notificationSettings = {
        notification_token: tokenData?.token || null,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(notificationSettings),
      });

      if (response.ok) {
        await fetchUser();

        return true;
      } else {
        console.error('Failed to sync notification token:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error syncing notification settings:', error);
      return false;
    }
  };

  const syncNotificationSettingsWithToken = async (authToken: string): Promise<boolean> => {
    if (!authToken) return false;

    try {
      const tokenData = await PushNotificationService.getTokenData();

      const notificationSettings = {
        notification_token: tokenData?.token || null,
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
        await fetchUser(authToken);

        return true;
      } else {
        console.error('Failed to sync notification token:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error syncing notification settings:', error);
      return false;
    }
  };

  const toggleNotificationSettings = async (enabled: boolean): Promise<boolean> => {
    if (!token || !user) return false;

    try {
      const tokenData = await PushNotificationService.getTokenData();
      const notificationSettings = {
        has_allow_notification: enabled,
        notification_token: enabled ? (tokenData?.token || null) : null,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(notificationSettings),
      });

      if (response.ok) {
        const updatedUser = {
          ...user,
          has_allow_notification: enabled,
          notification_token: enabled ? (tokenData?.token || null) : null,
        };
        setUser(updatedUser);
        AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));

        await PushNotificationService.setTokenSyncStatus(true);

        return true;
      } else {
        console.error('Failed to toggle notification settings:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error toggling notification settings:', error);
      return false;
    }
  };

  
  const validateToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/validate-token`, {
        method: 'GET',
        headers,
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const getAuthHeader = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    getAuthHeader,
    fetchUser,
    updateToken,
    updateUser,
    syncNotificationSettings,
    toggleNotificationSettings,
    validateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APP_CONFIG from '@/config/app';

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  code?: string;
}

interface FinancialData {
  total_balance: number;
  income: number;
  expenses: number;
  savings: number;
  period: {
    start_date: string;
    end_date: string;
    month: string;
  };
}

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string; // lowercase type name from database
  date: string;
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
  fetchFinancialData: () => Promise<FinancialData | null>;
  fetchRecentTransactions: (limit?: number) => Promise<Transaction[]>;
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
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/login`, {
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

          // Fetch user data with the token
          const userFetched = await fetchUser(token);
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
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    } catch (error) {
      // Silent error handling
    }
  };

  const updateToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('auth_token', newToken);
      setToken(newToken);
    } catch (error) {
      // Silent error handling
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

      // Build request body with Base64 support
      const requestBody: any = {};

      if (userData.name) requestBody.name = userData.name;
      if (userData.email) requestBody.email = userData.email;
      if (userData.avatar_base64) requestBody.avatar_base64 = userData.avatar_base64;

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.success) {
        // Update local user data with the response data
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

  const fetchFinancialData = async (): Promise<FinancialData | null> => {
    if (!token) return null;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/summary`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const fetchRecentTransactions = async (limit: number = 5): Promise<Transaction[]> => {
    if (!token) return [];

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments?page=1&limit=${limit}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.data;
      }
      return [];
    } catch (error) {
      return [];
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
    fetchFinancialData,
    fetchRecentTransactions,
    validateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
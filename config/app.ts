import Constants from 'expo-constants';

const APP_CONFIG = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || Constants.expoConfig?.extra?.apiBaseUrl,
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || Constants.expoConfig?.extra?.apiTimeout || 30000,
  DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true' || Constants.expoConfig?.extra?.debug || false,
  ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true' || Constants.expoConfig?.extra?.enableAnalytics || false,
  ENABLE_CRASH_REPORTING: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true' || Constants.expoConfig?.extra?.enableCrashReporting || true,
  ENV: process.env.EXPO_PUBLIC_ENV || Constants.expoConfig?.extra?.env || 'production',
  PRIVACY_EMAIL: process.env.EXPO_PUBLIC_PRIVACY_EMAIL || Constants.expoConfig?.extra?.privacyEmail,
  SUPPORT_EMAIL: process.env.EXPO_PUBLIC_SUPPORT_EMAIL || Constants.expoConfig?.extra?.supportEmail,
  OFFICE_ADDRESS: process.env.EXPO_PUBLIC_OFFICE_ADDRESS || Constants.expoConfig?.extra?.officeAddress,
  API_BASE_URL_GO: process.env.EXPO_PUBLIC_API_BASE_URL_GO || Constants.expoConfig?.extra?.apiBaseUrlGo,
  API_CDN_URL: process.env.EXPO_PUBLIC_CDN_API || Constants.expoConfig?.extra?.apiCdnUrl,
  CDN_URL: process.env.EXPO_PUBLIC_CDN || Constants.expoConfig?.extra?.cdnUrl,
};

export default APP_CONFIG;
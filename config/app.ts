import Constants from 'expo-constants';

const APP_CONFIG = {
  API_BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl,
  API_TIMEOUT: Constants.expoConfig?.extra?.apiTimeout,
  DEBUG: Constants.expoConfig?.extra?.debug,
  ENABLE_ANALYTICS: Constants.expoConfig?.extra?.enableAnalytics,
  ENABLE_CRASH_REPORTING: Constants.expoConfig?.extra?.enableCrashReporting,
  ENV: Constants.expoConfig?.extra?.env,
  PRIVACY_EMAIL: Constants.expoConfig?.extra?.privacyEmail,
  SUPPORT_EMAIL: Constants.expoConfig?.extra?.supportEmail,
  OFFICE_ADDRESS: Constants.expoConfig?.extra?.officeAddress
};

export default APP_CONFIG;
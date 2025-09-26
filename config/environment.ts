// App configuration for NovaApp
const APP_CONFIG = {
  // App Information
  APP_NAME: 'NovaApp',
  APP_VERSION: '1.0.0',
  COMPANY_NAME: 'NovaApp',
  SHOW_VERSION: false,

  // Development Settings
  DEBUG: true,

  // API Configuration
  API_BASE_URL: 'http://100.108.9.46:8000/api',
  API_TIMEOUT: 30000,

  // Feature Flags
  ENABLE_ANALYTICS: false,
  ENABLE_CRASH_REPORTING: true,

  // Helper Functions
  isDevelopment: () => __DEV__,
  isProduction: () => !__DEV__,

  // App Display Settings
  getAppTitle: () => `${APP_CONFIG.APP_NAME}${APP_CONFIG.SHOW_VERSION ? ` v${APP_CONFIG.APP_VERSION}` : ''}`,
  getCopyrightText: () => `© ${new Date().getFullYear()} ${APP_CONFIG.COMPANY_NAME}. All rights reserved.`,
};

export { APP_CONFIG };
export default APP_CONFIG;
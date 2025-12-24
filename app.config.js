export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      apiTimeout: process.env.EXPO_PUBLIC_API_TIMEOUT,
      debug: process.env.EXPO_PUBLIC_DEBUG !== 'false',
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableCrashReporting: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING !== 'false',
      env: process.env.EXPO_PUBLIC_ENV,
      privacyEmail: process.env.EXPO_PUBLIC_PRIVACY_EMAIL,
      supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL,
      officeAddress: process.env.EXPO_PUBLIC_OFFICE_ADDRESS
    }
  };
};

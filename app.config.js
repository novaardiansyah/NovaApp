export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      apiTimeout: process.env.EXPO_PUBLIC_API_TIMEOUT ? parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT, 10) : undefined,
      debug: process.env.EXPO_PUBLIC_DEBUG === 'true',
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableCrashReporting: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING !== 'false',
      env: process.env.EXPO_PUBLIC_ENV,
      privacyEmail: process.env.EXPO_PUBLIC_PRIVACY_EMAIL,
      supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL,
      officeAddress: process.env.EXPO_PUBLIC_OFFICE_ADDRESS,
      eas: {
        projectId: "fa09bab4-0188-4de9-818d-d2eb206c6eab"
      }
    }
  };
};

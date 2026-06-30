import Constants from 'expo-constants'

// EXPO_PUBLIC_* vars are inlined into process.env at build time. We also read
// expoConfig.extra as a fallback for values injected via eas.json / app.config.
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>

export const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? extra.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  // Google Sign-In Web client ID (audience the backend verifies). Set per build.
  googleWebClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extra.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  // Google Sign-In iOS client ID (used by configure() on iOS).
  googleIosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? extra.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
}

import Constants from 'expo-constants'

// EXPO_PUBLIC_* vars are inlined into process.env at build time. We also read
// expoConfig.extra as a fallback for values injected via eas.json / app.config.
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>

export const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? extra.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
}

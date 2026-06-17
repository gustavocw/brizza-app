import type { ConfigContext, ExpoConfig } from 'expo/config'

// Typed, env-driven config. Prefer this over app.json once you have >1 environment.
// Values flow from .env (EXPO_PUBLIC_*) and eas.json build profiles.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME ?? 'Brizze',
  slug: 'brizze-mobile',
  owner: 'brizze',
  scheme: 'brizze',
  version: '1.0.2',
  orientation: 'portrait',
  userInterfaceStyle: 'light', // UI ships light-only; lock the scheme for token parity
  icon: './assets/icon.png',
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.IOS_BUNDLE_ID ?? 'com.brizze.mobile',
    buildNumber: '2',
    // Explicit so the camera permission lands in Info.plist even if the plugin
    // form is missed by an incremental prebuild (QR scanner on the link screen).
    infoPlist: {
      NSCameraUsageDescription: 'A câmera é usada para ler o QR code da sua moto e vinculá-la à conta.',
    },
  },
  android: {
    // Edge-to-edge is always on from SDK 55+, so keyboard-controller resizes correctly.
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#F7F8F6' },
    package: process.env.ANDROID_PACKAGE ?? 'com.brizze.mobile',
    versionCode: 2,
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: '#F7F8F6' },
    ],
    'expo-status-bar',
    // Build React Native from source. SDK 56 defaults to the prebuilt RN core
    // (RCT_USE_PREBUILT_RNCORE=1), whose tarball fails to resolve here on Ruby 4.0
    // (pod error: React-Core-prebuilt "Missing required attribute source").
    ['expo-build-properties', { ios: { buildReactNativeFromSource: true } }],
    // Google Maps via react-native-maps' OWN config plugin: it adds the
    // `react-native-maps/Google` subspec pod (+ GMSApiKey + AppDelegate init on
    // iOS, + AndroidManifest key). Do NOT also set ios.config.googleMapsApiKey:
    // Expo's built-in maps plugin would inject the legacy `react-native-google-maps`
    // pod, which rn-maps 1.27+ no longer ships (pod install: "No podspec found").
    [
      'react-native-maps',
      {
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
    // Camera for scanning the bike's QR code (adds NSCameraUsageDescription on
    // iOS + CAMERA permission on Android). Requires a rebuild of the dev client.
    [
      'expo-camera',
      { cameraPermission: 'A câmera é usada para ler o QR code da sua moto e vinculá-la à conta.' },
    ],
    // Photo library to pick the profile picture (adds NSPhotoLibraryUsageDescription).
    [
      'expo-image-picker',
      { photosPermission: 'O app acessa suas fotos para você escolher a imagem de perfil.' },
    ],
    // Push notifications (FCM). Sets up the native notifications config. Delivery
    // additionally requires Firebase: google-services.json wired via
    // android.googleServicesFile, plus an APNs key + Firebase on iOS.
    'expo-notifications',
  ],
  // typedRoutes is intentionally OFF: routes.ts is the single typed routing layer
  // (it lists routes that may not exist as files yet, which strict typedRoutes rejects).
  extra: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    eas: { projectId: process.env.EAS_PROJECT_ID ?? '3fc46409-7577-4139-ab07-1ff4df6e4e89' },
  },
})

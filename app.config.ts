import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME ?? 'Brizze',
  slug: 'brizze-mobile',
  owner: 'brizze',
  scheme: 'brizze',
  version: '1.0.6',
  orientation: 'portrait',
  userInterfaceStyle: 'light', 
  icon: './assets/icon.png',
  ios: {
    supportsTablet: false,
    bundleIdentifier: process.env.IOS_BUNDLE_ID ?? 'com.brizze.mobile',
    buildNumber: '6',
    infoPlist: {
      NSCameraUsageDescription: 'A câmera é usada para ler o QR code da sua moto e vinculá-la à conta.',
      // App é só em português: força a região base pra App Store listar só pt-BR.
      CFBundleDevelopmentRegion: 'pt-BR',
      // Só usa HTTPS padrão: evita a pergunta de export compliance a cada upload.
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#F7F8F6' },
    package: process.env.ANDROID_PACKAGE ?? 'com.brizze.mobile',
    versionCode: 6,
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: '#F7F8F6' },
    ],
    'expo-status-bar',
    ['expo-build-properties', { ios: { buildReactNativeFromSource: true } }],
    [
      'react-native-maps',
      {
        // Uma chave (conta oficial) pra iOS e Android. Injetada por build via eas.json.
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'A câmera é usada para ler o QR code da sua moto e vinculá-la à conta.',
        // QR scanner não grava áudio: não pedir microfone (evita rejeição na App Store).
        microphonePermission: false,
      },
    ],
    [
      'expo-image-picker',
      { photosPermission: 'O app acessa suas fotos para você escolher a imagem de perfil.' },
    ],
    'expo-notifications',
    // Native Google Sign-In. iosUrlScheme = reversed iOS client ID (handles the
    // OAuth callback on iOS). Android matches by package + SHA-1 in the Console.
    [
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: 'com.googleusercontent.apps.99780179495-d0kt1os7bgee96p40hhqlljigj3djr4i' },
    ],
    // Modular headers for the Google pods so pod install integrates them as static libs.
    './plugins/with-ios-modular-headers',
  ],
  extra: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    eas: { projectId: process.env.EAS_PROJECT_ID ?? '3fc46409-7577-4139-ab07-1ff4df6e4e89' },
  },
})

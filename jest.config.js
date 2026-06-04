module.exports = {
  preset: 'jest-expo',
  // Reanimated v4 pulls in react-native-worklets, whose native init throws under
  // jest. This resolver strips the `.native` files so the test impl loads instead.
  resolver: '<rootDir>/node_modules/react-native-worklets/jest/resolver.js',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|nativewind|react-native-css-interop|react-native-reanimated|react-native-worklets|react-native-keyboard-controller|react-native-gesture-handler|@shopify/flash-list|react-native-svg))',
  ],
}

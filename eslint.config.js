// Flat config (ESLint 9). Expo's rules + a couple of project guards.
const expoConfig = require('eslint-config-expo/flat')

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'android/*', 'ios/*'],
    rules: {
      // Only console.error survives (inside catch/onError). No log/warn/info/debug.
      'no-console': ['warn', { allow: ['error'] }],
      // React Compiler rules (eslint-plugin-react-hooks v6) that clash with our stack:
      // Reanimated mutates `sharedValue.value` by design, and the overlay host syncs a
      // ref to the latest state during render on purpose. Both are correct patterns here.
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
]

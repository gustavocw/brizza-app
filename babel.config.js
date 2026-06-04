module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [
      // `@/...` → `src/...`. Also lets tailwind.config be imported from JS if ever needed.
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            'tailwind.config': './tailwind.config.js',
          },
        },
      ],
      // Worklets plugin MUST be last. Reanimated v4 uses react-native-worklets;
      // this replaces the old 'react-native-reanimated/plugin'.
      'react-native-worklets/plugin',
    ],
  }
}

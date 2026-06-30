const { withDangerousMod } = require('expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Google Sign-In pulls the Swift pod AppCheckCore, which depends on GoogleUtilities
// and RecaptchaInterop — pods that don't define modules, so `pod install` fails when
// integrating them as static libraries. Enabling modular headers JUST for those two
// generates the module maps (the fix the pod-install error itself suggests) without
// switching the whole project to use_frameworks!, which would break react-native-maps.
// Kept as a plugin so EAS prebuild reapplies it (the Podfile is regenerated each build).
const POD_LINES = [
  "  pod 'GoogleUtilities', :modular_headers => true",
  "  pod 'RecaptchaInterop', :modular_headers => true",
].join('\n')

module.exports = function withIosModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile')
      let contents = fs.readFileSync(podfile, 'utf8')
      if (!contents.includes("pod 'GoogleUtilities', :modular_headers")) {
        contents = contents.replace(/^(\s*use_expo_modules!.*)$/m, `$1\n${POD_LINES}`)
        fs.writeFileSync(podfile, contents)
      }
      return cfg
    },
  ])
}

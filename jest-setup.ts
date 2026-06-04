// Native modules have no implementation under jest — mock them.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

// keyboard-controller ships a jest mock; if your version lacks it, replace with a manual stub.
jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'))

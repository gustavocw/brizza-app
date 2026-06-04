import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage } from 'zustand/middleware'

/**
 * Storage adapter for persisted Zustand stores. AsyncStorage by default; swap
 * for react-native-mmkv here if you need sync/faster storage (one place to change).
 */
export const zustandStorage = createJSONStorage(() => AsyncStorage)

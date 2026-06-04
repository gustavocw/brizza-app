import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zustandStorage } from './storage'

export type User = {
  id: string
  name: string
  email: string
}

type AuthState = {
  isAuthenticated: boolean
  user: User | null
  /** False until the persisted state has rehydrated — gate your splash on this. */
  hydrated: boolean
  setHydrated: (value: boolean) => void
  login: (user: User) => void
  logout: () => void
  setUser: (user: User) => void
}

/**
 * Global auth store. Persisted with a hydration flag so the app can wait for
 * storage before deciding the initial route. Read with fine-grained selectors:
 *
 *   const user = useAuthStore((s) => s.user)
 *   const login = useAuthStore((s) => s.login)
 *
 * Outside React (e.g. the 401 bridge): useAuthStore.getState().logout()
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: zustandStorage,
      // Persist only what matters — never derived/ephemeral fields.
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated, user: s.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
)

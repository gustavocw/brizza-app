import { Redirect } from 'expo-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { routes } from '@/shared/constants/routes'

// Entry point. Gate on auth, waiting for the persisted store to rehydrate so we
// don't flash the wrong screen. Signed in → dashboard; otherwise → login.
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hydrated = useAuthStore((s) => s.hydrated)

  if (!hydrated) return null
  return <Redirect href={isAuthenticated ? routes.tabs.home() : routes.public.signIn()} />
}

import '../global.css'

import { useEffect, useRef } from 'react'
import { router, Stack } from 'expo-router'
import * as Notifications from 'expo-notifications'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans'
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono'
import { AppProviders } from '@/providers/app-providers'
import { AnimatedSplash } from '@/shared/components/layout/animated-splash'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { setOnUnauthorized } from '@/lib/api'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/shared/stores/auth.store'
import { routes } from '@/shared/constants/routes'

SplashScreen.preventAutoHideAsync()

// Registered at the root so it's in place before any notification is delivered
// (incl. cold start from a tapped notification). Foreground: show banner + list,
// play sound, bump the badge.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
  })

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const wasAuthenticated = useRef(isAuthenticated)

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  // Bridge the HTTP 401 handler to state teardown, once. Navigation is handled
  // reactively below, so a dead session always lands on login.
  useEffect(() => {
    setOnUnauthorized(() => {
      useAuthStore.getState().logout()
      queryClient.clear()
    })
    return () => setOnUnauthorized(null)
  }, [])

  // Whenever the session ends (expired/revoked token or manual sign-out), send the
  // user to login. Reactive on the store, so it fires even when the imperative
  // redirect from the 401 bridge (outside React) would be dropped.
  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      router.replace(routes.public.signIn())
    }
    wasAuthenticated.current = isAuthenticated
  }, [isAuthenticated])

  if (!fontsLoaded) return null

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </ErrorBoundary>
      <AnimatedSplash />
    </AppProviders>
  )
}

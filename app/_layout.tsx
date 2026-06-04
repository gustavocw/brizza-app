import '../global.css'

import { useEffect } from 'react'
import { router, Stack } from 'expo-router'
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
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { setOnUnauthorized } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { routes } from '@/shared/constants/routes'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  // Bridge the HTTP 401 handler to navigation/state, once.
  useEffect(() => {
    setOnUnauthorized(() => {
      useAuthStore.getState().logout()
      router.replace(routes.public.signIn())
    })
    return () => setOnUnauthorized(null)
  }, [])

  if (!fontsLoaded) return null

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </ErrorBoundary>
    </AppProviders>
  )
}

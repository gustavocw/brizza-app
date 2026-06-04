import 'react-native-gesture-handler'
import type { ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { ConfigProvider } from './config/config-provider'
import { ToastProvider } from './toast/toast-provider'
import { OverlayProvider } from './overlay/overlay-provider'

/**
 * The single composition root. Order matters:
 *   GestureHandlerRootView  → required outermost for gesture-handler
 *   KeyboardProvider        → keyboard-controller context for every screen/sheet
 *   SafeAreaProvider        → insets
 *   QueryClientProvider     → server cache
 *   ConfigProvider          → app config / feature flags (add your auth/session here too)
 *   ToastProvider           → wraps Overlay so toasts paint ABOVE sheets/dialogs
 *   OverlayProvider         → innermost so sheets/dialogs/loading paint above content
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <ConfigProvider>
              <ToastProvider>
                <OverlayProvider>{children}</OverlayProvider>
              </ToastProvider>
            </ConfigProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}

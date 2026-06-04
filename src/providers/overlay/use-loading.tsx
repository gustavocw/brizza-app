import { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useOverlay } from './use-overlay'
import { useColors } from '@/theme/use-colors'

function LoadingOverlay() {
  const colors = useColors()
  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-center">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
      <View className="rounded-2xl bg-surface p-5">
        <ActivityIndicator color={colors.primary} />
      </View>
    </View>
  )
}

/**
 * Blocking, full-screen loading on the overlay host. Stacks like everything else.
 *
 *   const loading = useLoading()
 *   const id = loading.show()
 *   try { await work() } finally { loading.hide(id) }
 */
export function useLoading() {
  const overlay = useOverlay()
  const show = useCallback(() => overlay.open(() => <LoadingOverlay />, { exitMs: 0 }), [overlay])
  return { show, hide: overlay.close }
}

import { useEffect, useRef } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Button, Paragraph } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'

const SIZE = 280
const SCRIM = { backgroundColor: 'rgba(13, 43, 31, 0.55)' }

/**
 * Square, very-rounded QR scanner. Requests the camera permission, scans QR codes
 * and reports the value once via onScan. `busy` (the link in flight) shows an
 * overlay and re-arms scanning if the link fails.
 */
export function QrScanner({ onScan, busy }: { onScan: (data: string) => void; busy: boolean }) {
  const colors = useColors()
  const [permission, requestPermission] = useCameraPermissions()
  const scanned = useRef(false)

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) requestPermission()
  }, [permission, requestPermission])

  // Re-arm after a failed link so the user can try another code.
  useEffect(() => {
    if (!busy) scanned.current = false
  }, [busy])

  const frame = { width: SIZE, height: SIZE }

  if (!permission || !permission.granted) {
    return (
      <View style={frame} className="items-center justify-center gap-3 rounded-[44px] bg-surfaceMuted px-8">
        <Paragraph appear={false} className="text-center text-sm text-muted">
          {permission && !permission.canAskAgain
            ? 'Permita o acesso à câmera nos ajustes para ler o QR code.'
            : 'Precisamos da câmera para ler o QR code da sua moto.'}
        </Paragraph>
        {!permission || permission.canAskAgain ? (
          <Button full={false} variant="secondary" label="Permitir câmera" onPress={requestPermission} />
        ) : null}
      </View>
    )
  }

  return (
    <View style={frame} className="overflow-hidden rounded-[44px] bg-brandNight">
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => {
          if (scanned.current || busy) return
          scanned.current = true
          onScan(data)
        }}
      />

      {/* viewfinder corner brackets */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View className="absolute left-6 top-6 h-9 w-9 rounded-tl-2xl border-l-[3px] border-t-[3px] border-onPrimary" />
        <View className="absolute right-6 top-6 h-9 w-9 rounded-tr-2xl border-r-[3px] border-t-[3px] border-onPrimary" />
        <View className="absolute bottom-6 left-6 h-9 w-9 rounded-bl-2xl border-b-[3px] border-l-[3px] border-onPrimary" />
        <View className="absolute bottom-6 right-6 h-9 w-9 rounded-br-2xl border-b-[3px] border-r-[3px] border-onPrimary" />
      </View>

      {busy ? (
        <View style={[StyleSheet.absoluteFill, SCRIM]} className="items-center justify-center gap-2">
          <ActivityIndicator color={colors.onPrimary} />
          <Paragraph appear={false} className="text-sm font-semibold text-onPrimary">
            Vinculando…
          </Paragraph>
        </View>
      ) : null}
    </View>
  )
}

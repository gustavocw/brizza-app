import { useEffect, useRef } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Button, Paragraph } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'

const SIZE = 280
const SCRIM = { backgroundColor: 'rgba(13, 43, 31, 0.55)' }

/**
 * Square, very-rounded QR scanner with accent brackets framing the camera from the
 * outside. Requests the camera permission, scans QR codes once via onScan; `busy`
 * (the link in flight) shows an overlay and re-arms scanning if the link fails.
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
    <View style={frame}>
      <View style={StyleSheet.absoluteFill} className="overflow-hidden rounded-[44px] bg-brandNight">
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
        {busy ? (
          <View style={[StyleSheet.absoluteFill, SCRIM]} className="items-center justify-center gap-2">
            <ActivityIndicator color={colors.onPrimary} />
            <Paragraph appear={false} className="text-sm font-semibold text-onPrimary">
              Vinculando…
            </Paragraph>
          </View>
        ) : null}
      </View>

      {/* accent corner brackets framing the square from the outside */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View className="absolute -left-2 -top-2 h-12 w-12 rounded-tl-[40px] border-l-4 border-t-4 border-accent" />
        <View className="absolute -right-2 -top-2 h-12 w-12 rounded-tr-[40px] border-r-4 border-t-4 border-accent" />
        <View className="absolute -bottom-2 -left-2 h-12 w-12 rounded-bl-[40px] border-b-4 border-l-4 border-accent" />
        <View className="absolute -bottom-2 -right-2 h-12 w-12 rounded-br-[40px] border-b-4 border-r-4 border-accent" />
      </View>
    </View>
  )
}

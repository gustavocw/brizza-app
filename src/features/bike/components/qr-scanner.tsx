import { useEffect, useRef } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Button, Paragraph } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'

const SIZE = 280
const RADIUS = 44 // camera corner radius
const GAP = 8 // distance the brackets sit outside the camera
const STROKE = 4
const ARM = 30 // straight arm length of each bracket
const SCRIM = { backgroundColor: 'rgba(13, 43, 31, 0.55)' }

// Brackets concentric with the camera corners: bracket arc radius = camera radius
// + gap, so the curve hugs the rounded square symmetrically. Drawn in an SVG that
// extends `GAP` beyond each edge, with a half-stroke inset so nothing clips.
const SVG = SIZE + GAP * 2
const r = RADIUS + GAP - STROKE / 2 // 50
const o = STROKE / 2 // 2 (inset)
const far = SVG - o
const BRACKETS = [
  `M${o} ${o + r + ARM} L${o} ${o + r} A${r} ${r} 0 0 1 ${o + r} ${o} L${o + r + ARM} ${o}`,
  `M${far} ${o + r + ARM} L${far} ${o + r} A${r} ${r} 0 0 0 ${far - r} ${o} L${far - r - ARM} ${o}`,
  `M${o} ${far - r - ARM} L${o} ${far - r} A${r} ${r} 0 0 0 ${o + r} ${far} L${o + r + ARM} ${far}`,
  `M${far} ${far - r - ARM} L${far} ${far - r} A${r} ${r} 0 0 1 ${far - r} ${far} L${far - r - ARM} ${far}`,
]

/**
 * Square, very-rounded QR scanner with accent brackets framing the camera from the
 * outside (concentric with its corners). Requests the camera permission, scans QR
 * codes once via onScan; `busy` shows an overlay and re-arms scanning on failure.
 */
export function QrScanner({ onScan, busy }: { onScan: (data: string) => void; busy: boolean }) {
  const colors = useColors()
  const [permission, requestPermission] = useCameraPermissions()
  const scanned = useRef(false)

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) requestPermission()
  }, [permission, requestPermission])

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

      <Svg width={SVG} height={SVG} pointerEvents="none" style={{ position: 'absolute', top: -GAP, left: -GAP }}>
        {BRACKETS.map((d) => (
          <Path key={d} d={d} stroke={colors.accent} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ))}
      </Svg>
    </View>
  )
}

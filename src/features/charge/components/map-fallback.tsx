import { View } from 'react-native'
import { Map } from 'iconsax-react-nativejs'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'

/** Shown when the native map can't render (e.g. Expo Go); the list stays usable. */
export function MapFallback() {
  const colors = useColors()
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-surfaceMuted">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primarySoft">
        <Map size={26} color={colors.primary} variant="Bold" />
      </View>
      <Paragraph appear={false} className="px-10 text-center text-xs text-muted">
        O mapa aparece no app instalado. Veja as estações na lista abaixo.
      </Paragraph>
    </View>
  )
}

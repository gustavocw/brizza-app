import { Pressable, View } from 'react-native'
import { ArrowDown2 } from 'iconsax-react-nativejs'
import { useBikeQuery } from '@/features/bike/hooks/use-bike-query'
import { STATUS } from '@/features/bike/services/bike.dto'
import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { BikeSwitcherSheet } from './bike-switcher-sheet'

/**
 * App-wide top header: the connected bike's name + connection status, tapping opens
 * the bike switcher. Rendered at the top of every base tab screen. Self-contained —
 * reads the (mocked) bike identity, no props needed.
 */
export function MotoHeader() {
  const colors = useColors()
  const sheet = useBottomSheet()
  const { data: moto } = useBikeQuery()

  const status = moto ? STATUS[moto.status] : null

  const onSelectBike = () => {
    if (!moto) return
    sheet.open({ snapToContent: true, children: <BikeSwitcherSheet model={moto.model} plate={moto.plate} /> })
  }

  return (
    <View>
      <Row className="items-center justify-between">
        <Pressable
          onPress={onSelectBike}
          disabled={!moto}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Trocar de moto"
        >
          <Row className="items-center gap-1.5">
            <Paragraph appear={false} className="text-xl font-semibold text-foreground">
              {moto?.model ?? 'Brizze'}
            </Paragraph>
            {moto ? <ArrowDown2 size={18} color={colors.foreground} variant="Linear" /> : null}
          </Row>
        </Pressable>

        {status ? (
          <Row className="items-center gap-1.5">
            <View className={`h-2 w-2 rounded-full ${status.dot}`} />
            <Paragraph appear={false} className="text-xs font-medium text-muted">
              {status.label}
            </Paragraph>
          </Row>
        ) : null}
      </Row>

      {moto ? (
        <Paragraph appear={false} className="mt-0.5 text-xs font-medium text-muted">
          {moto.plate}
        </Paragraph>
      ) : null}
    </View>
  )
}

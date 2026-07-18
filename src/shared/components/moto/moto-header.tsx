import { Pressable, View } from 'react-native'
import { ArrowDown2 } from 'iconsax-react-nativejs'
import { useSelectedBike } from '@/features/bike/hooks/use-selected-bike'
import { STATUS } from '@/features/bike/services/bike.dto'
import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { BikeSwitcherSheet } from './bike-switcher-sheet'

/**
 * App-wide top header: the selected bike's name + connection status, tapping opens
 * the bike switcher (picking one updates the app-wide selection). Rendered at the
 * top of every base tab screen. Self-contained — reads the (mocked) bikes.
 */
export function MotoHeader() {
  const colors = useColors()
  const sheet = useBottomSheet()
  const { bike, bikes, selectedId, onSelect } = useSelectedBike()

  const status = bike ? STATUS[bike.status] : null

  const onSelectBike = () => {
    if (bikes.length < 1) return
    sheet.open({
      snapToContent: true,
      children: ({ close }) => (
        <BikeSwitcherSheet
          bikes={bikes}
          selectedId={selectedId}
          onSelect={(id) => {
            onSelect(id)
            close()
          }}
        />
      ),
    })
  }

  return (
    <View>
      <Row className="items-center justify-between">
        <Pressable
          onPress={onSelectBike}
          disabled={!bike}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Trocar de moto"
        >
          <Row className="items-center gap-1.5">
            <Paragraph appear={false} className="text-xl font-semibold text-foreground">
              {bike?.model ?? 'Brizze'}
            </Paragraph>
            {bike ? <ArrowDown2 size={18} color={colors.foreground} variant="Linear" /> : null}
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

      {bike ? (
        <Paragraph appear={false} className="mt-0.5 text-xs font-medium text-muted">
          {bike.plate}
        </Paragraph>
      ) : null}
    </View>
  )
}

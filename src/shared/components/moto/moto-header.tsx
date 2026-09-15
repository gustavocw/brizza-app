import { View } from 'react-native'
import { useBike } from '@/features/bike/hooks/use-bike'
import { STATUS } from '@/features/bike/services/bike.dto'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'

/**
 * Cabeçalho das abas: nome da moto da conta e o estado da conexão. Uma conta tem
 * no máximo uma moto, então não há seletor.
 */
export function MotoHeader() {
  const { bike } = useBike()

  const status = bike ? STATUS[bike.status] : null

  return (
    <View>
      <Row className="items-center justify-between">
        <Row className="items-center gap-1.5">
          <Paragraph appear={false} className="text-xl font-semibold text-foreground">
            {bike?.model ?? 'Brizze'}
          </Paragraph>
        </Row>

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

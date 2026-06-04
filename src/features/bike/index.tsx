import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { Paragraph, Title } from '@/shared/components/ui'

export default function BikeScreen() {
  return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center gap-1">
        <Title>Moto</Title>
        <Paragraph className="text-muted">Em construção</Paragraph>
      </View>
    </Screen>
  )
}

import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { Paragraph, Title } from '@/shared/components/ui'

export default function AlertsScreen() {
  return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center gap-1">
        <Title>Alertas</Title>
        <Paragraph className="text-muted">Em construção</Paragraph>
      </View>
    </Screen>
  )
}

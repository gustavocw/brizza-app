import { TouchableOpacity, View } from 'react-native'
import { Appear } from '@/shared/components/ui/appear'
import { Paragraph } from '@/shared/components/ui/paragraph'
import type { Example } from '../services/example.dto'

export function ExampleCard({
  example,
  delay = 0,
  onDelete,
}: {
  example: Example
  delay?: number
  onDelete: () => void
}) {
  return (
    <Appear delay={delay}>
      <View className="flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4">
        <Paragraph appear={false} className="font-medium">
          {example.title}
        </Paragraph>
        <TouchableOpacity onPress={onDelete} hitSlop={8}>
          <Paragraph appear={false} className="text-error">
            Delete
          </Paragraph>
        </TouchableOpacity>
      </View>
    </Appear>
  )
}

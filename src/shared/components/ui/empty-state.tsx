import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from './button'
import { Paragraph } from './paragraph'
import { Title } from './title'

export function EmptyState({
  title,
  message,
  icon,
  action,
}: {
  title: string
  message?: string
  icon?: ReactNode
  action?: { label: string; onPress: () => void }
}) {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      {icon}
      <Title className="text-center text-lg">{title}</Title>
      {message ? (
        <Paragraph appear={false} className="text-center text-muted">
          {message}
        </Paragraph>
      ) : null}
      {action ? <Button full={false} label={action.label} onPress={action.onPress} /> : null}
    </View>
  )
}

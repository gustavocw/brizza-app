import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Card } from './card'
import { Paragraph } from './paragraph'
import { fontTheme } from '@/theme/theme'

type Props = {
  icon: ReactNode
  label: string
  value: string
  sub?: string
  delay?: number
  /** Float with a shadow (dashboard) or sit flat. Default true. */
  elevated?: boolean
}

/** Compact metric tile: icon chip + label + value (+ optional sub). Fills its row column. */
export function StatCard({ icon, label, value, sub, delay = 0, elevated = true }: Props) {
  return (
    <View className="flex-1">
      <Card elevated={elevated} delay={delay} className="gap-3 rounded-3xl border-transparent p-4">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primarySoft">{icon}</View>
        <View>
          <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[10px] uppercase tracking-wider text-subtle">
            {label}
          </Paragraph>
          <Paragraph appear={false} className="text-base font-bold text-foreground">
            {value}
          </Paragraph>
          {sub ? (
            <Paragraph appear={false} className="text-xs text-muted">
              {sub}
            </Paragraph>
          ) : null}
        </View>
      </Card>
    </View>
  )
}

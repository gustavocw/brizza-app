import type { ViewProps } from 'react-native'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { shadowsTheme } from '@/theme/theme'
import { Appear } from './appear'

export type CardProps = ViewProps & {
  delay?: number
  appear?: boolean
  /** Float with a shadow instead of a border. */
  elevated?: boolean
  className?: string
}

export function Card({ delay = 0, appear = true, elevated = false, className, style, children, ...rest }: CardProps) {
  return (
    <Appear delay={delay} disabled={!appear} translateY={16} spring>
      <View
        {...rest}
        style={[elevated ? shadowsTheme.sm : undefined, style]}
        className={twMerge('rounded-2xl border border-border bg-surface p-4', elevated && 'border-transparent', className)}
      >
        {children}
      </View>
    </Appear>
  )
}

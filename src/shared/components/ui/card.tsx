import type { ViewProps } from 'react-native'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { CARD_BORDER } from '@/shared/constants/card-style'
import { Appear } from './appear'

export type CardProps = ViewProps & {
  delay?: number
  appear?: boolean
  className?: string
}

/** Base surface card — white, rounded, hairline border (no shadow), app-wide. */
export function Card({ delay = 0, appear = true, className, style, children, ...rest }: CardProps) {
  return (
    <Appear delay={delay} disabled={!appear} translateY={16} spring>
      <View
        {...rest}
        style={[CARD_BORDER, style]}
        className={twMerge('rounded-2xl bg-surface p-4', className)}
      >
        {children}
      </View>
    </Appear>
  )
}

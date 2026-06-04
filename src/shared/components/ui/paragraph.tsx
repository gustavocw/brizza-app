import type { TextProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'
import { useAppear } from './appear'

export type ParagraphProps = TextProps & {
  /** Stagger this within an AppearGroup, or set manually for a domino. */
  delay?: number
  /** Turn off the entrance animation (e.g. inside FlatList rows). Default true. */
  appear?: boolean
  className?: string
}

/** Body text. Fades + slightly scales in. Use instead of raw <Text>. */
export function Paragraph({ delay = 0, appear = true, className, style, ...rest }: ParagraphProps) {
  const animatedStyle = useAppear({ delay, disabled: !appear })
  return (
    <Animated.Text
      {...rest}
      className={twMerge('font-sans text-sm text-foreground', className)}
      style={[style, animatedStyle]}
    />
  )
}

import type { TextProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'
import { useAppear } from './appear'

export type TitleProps = TextProps & {
  delay?: number
  appear?: boolean
  className?: string
}

/** Screen / section heading. */
export function Title({ delay = 0, appear = true, className, style, ...rest }: TitleProps) {
  const animatedStyle = useAppear({ delay, scaleFrom: 0.98, disabled: !appear })
  return (
    <Animated.Text
      {...rest}
      className={twMerge('font-bold text-[22px] leading-7 text-foreground', className)}
      style={[style, animatedStyle]}
    />
  )
}

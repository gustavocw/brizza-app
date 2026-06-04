import type { ReactNode } from 'react'
import { ActivityIndicator, TouchableOpacity, View, type TouchableOpacityProps } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Appear } from './appear'
import { Paragraph } from './paragraph'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'

export type ButtonProps = TouchableOpacityProps & {
  label?: string
  variant?: Variant
  isLoading?: boolean
  /** Rendered inside a trailing circular container (split-pill style). */
  icon?: ReactNode
  /** Override the trailing icon container background (defaults per variant). */
  iconContainerClassName?: string
  /** Stretch to fill width. Default true. */
  full?: boolean
  delay?: number
  appear?: boolean
  className?: string
}

const containerVariant: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-surfaceMuted',
  outline: 'bg-transparent border border-border',
  ghost: 'bg-transparent',
}

const textVariant: Record<Variant, string> = {
  primary: 'text-onPrimary',
  secondary: 'text-foreground',
  outline: 'text-foreground',
  ghost: 'text-primary',
}

// Trailing icon container: a solid circle that contrasts with the button fill.
const iconContainerVariant: Record<Variant, string> = {
  primary: 'bg-onPrimary',
  secondary: 'bg-primary',
  outline: 'bg-primary',
  ghost: 'bg-primarySoft',
}

/**
 * Pill button. With an `icon`, it becomes a split-pill: the label stays centered
 * and the icon sits in its own circular container pinned to the trailing edge.
 */
export function Button({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  icon,
  iconContainerClassName,
  full = true,
  delay = 0,
  appear = true,
  className,
  children,
  ...rest
}: ButtonProps) {
  const colors = useColors()
  const isDisabled = disabled || isLoading
  const showIcon = !!icon && !isLoading

  return (
    <Appear
      delay={delay}
      disabled={!appear}
      className={full ? 'self-stretch' : 'self-start'}
      style={!isDisabled && variant === 'primary' ? shadowsTheme.sm : undefined}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        className={twMerge(
          'h-14 flex-row items-center justify-center rounded-full px-5',
          containerVariant[variant],
          isDisabled && 'opacity-40',
          className,
        )}
        {...rest}
      >
        {label ? (
          <Paragraph
            appear={false}
            numberOfLines={1}
            style={showIcon ? { paddingHorizontal: 52 } : undefined}
            className={twMerge('text-center text-base font-semibold', textVariant[variant], isLoading && 'opacity-0')}
          >
            {label}
          </Paragraph>
        ) : null}

        {children}

        {showIcon ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, right: 6 }} className="justify-center">
            <View className={twMerge('h-11 w-11 items-center justify-center rounded-full', iconContainerVariant[variant], iconContainerClassName)}>
              {icon}
            </View>
          </View>
        ) : null}

        {isLoading ? (
          <ActivityIndicator className="absolute" color={variant === 'primary' ? colors.onPrimary : colors.primary} />
        ) : null}
      </TouchableOpacity>
    </Appear>
  )
}

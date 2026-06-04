import type { ReactNode } from 'react'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { shadowsTheme } from '@/theme/theme'

export type IconButtonProps = TouchableOpacityProps & {
  children: ReactNode
  size?: number
  variant?: 'surface' | 'ghost'
  className?: string
}

export function IconButton({ children, size = 40, variant = 'surface', className, style, ...rest }: IconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      hitSlop={8}
      style={[{ width: size, height: size }, variant === 'surface' ? shadowsTheme.sm : undefined, style]}
      className={twMerge(
        'items-center justify-center rounded-full',
        variant === 'surface' ? 'bg-surface' : 'bg-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}

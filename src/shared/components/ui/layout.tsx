import type { ViewProps } from 'react-native'
import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

type LayoutProps = ViewProps & { className?: string }

/** Horizontal stack (row, vertically centered by default). */
export function Row({ className, ...rest }: LayoutProps) {
  return <View {...rest} className={twMerge('flex-row items-center', className)} />
}

/** Vertical stack. */
export function Column({ className, ...rest }: LayoutProps) {
  return <View {...rest} className={twMerge('flex-col', className)} />
}

/** Fixed gap (size in px) or a flexible filler (no size → flex-1, pushes siblings apart). */
export function Spacer({ size }: { size?: number }) {
  return <View style={size ? { width: size, height: size } : undefined} className={size ? undefined : 'flex-1'} />
}

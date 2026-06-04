import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

export function Divider({ className }: { className?: string }) {
  return <View className={twMerge('h-px w-full bg-divider', className)} />
}

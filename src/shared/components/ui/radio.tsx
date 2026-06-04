import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Paragraph } from './paragraph'

export function Radio({
  selected,
  onPress,
  label,
  disabled,
}: {
  selected: boolean
  onPress: () => void
  label?: string
  disabled?: boolean
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      hitSlop={6}
      className={`flex-row items-center gap-2 ${disabled ? 'opacity-40' : ''}`}
    >
      <View className={twMerge('h-5 w-5 items-center justify-center rounded-full border-2', selected ? 'border-primary' : 'border-border')}>
        {selected ? <View className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
      </View>
      {label ? (
        <Paragraph appear={false} className="flex-1">
          {label}
        </Paragraph>
      ) : null}
    </Pressable>
  )
}

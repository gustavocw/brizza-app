import { Pressable } from 'react-native'
import { TickSquare } from 'iconsax-react-nativejs'
import { useColors } from '@/theme/use-colors'
import { Paragraph } from './paragraph'

export function Checkbox({
  value,
  onChange,
  label,
  disabled,
}: {
  value: boolean
  onChange: (next: boolean) => void
  label?: string
  disabled?: boolean
}) {
  const colors = useColors()
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={6}
      className={`flex-row items-center gap-2 ${disabled ? 'opacity-40' : ''}`}
    >
      <TickSquare size={24} variant={value ? 'Bold' : 'Outline'} color={value ? colors.primary : colors.subtle} />
      {label ? (
        <Paragraph appear={false} className="flex-1">
          {label}
        </Paragraph>
      ) : null}
    </Pressable>
  )
}

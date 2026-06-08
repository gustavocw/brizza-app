import { useState } from 'react'
import { Pressable, type TextInputProps } from 'react-native'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Eye, EyeSlash, Lock } from 'iconsax-react-nativejs'
import { ControlledTextField } from './controlled-text-field'
import { useColors } from '@/theme/use-colors'

type Props<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  returnKeyType?: TextInputProps['returnKeyType']
  onSubmitEditing?: () => void
  autoFocus?: boolean
}

/** Password input with a lock icon and a show/hide toggle, bound to react-hook-form. */
export function ControlledPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Sua senha',
  returnKeyType,
  onSubmitEditing,
  autoFocus,
}: Props<T>) {
  const colors = useColors()
  const [show, setShow] = useState(false)

  return (
    <ControlledTextField
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      secureTextEntry={!show}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoFocus={autoFocus}
      left={<Lock size={18} color={colors.subtle} variant="Bold" />}
      right={
        <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
          {show ? (
            <EyeSlash size={18} color={colors.subtle} variant="Bold" />
          ) : (
            <Eye size={18} color={colors.subtle} variant="Bold" />
          )}
        </Pressable>
      }
    />
  )
}

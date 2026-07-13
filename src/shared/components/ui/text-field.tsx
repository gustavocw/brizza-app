import { forwardRef, useState, type ReactNode } from 'react'
import { TextInput as RNTextInput, View, type TextInputProps } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { useColors } from '@/theme/use-colors'
import { Paragraph } from './paragraph'

export type TextFieldProps = TextInputProps & {
  label?: string
  error?: string
  left?: ReactNode
  right?: ReactNode
  containerClassName?: string
  className?: string
}

/**
 * Labeled text input with focus + error states. Keyboard avoidance is handled
 * by the <Screen> wrapper, not here — keep inputs dumb.
 */
export const TextField = forwardRef<RNTextInput, TextFieldProps>(function TextField(
  { label, error, left, right, containerClassName, className, style, multiline, onFocus, onBlur, ...rest },
  ref,
) {
  const colors = useColors()
  const [focused, setFocused] = useState(false)

  return (
    <View className={twMerge('gap-1.5', containerClassName)}>
      {label ? <Paragraph appear={false} className="font-medium text-[13px] text-muted">{label}</Paragraph> : null}

      <View
        className={twMerge(
          'flex-row gap-2 rounded-xl border bg-surface px-4',
          multiline ? 'items-start' : 'items-center',
          focused ? 'border-primary' : 'border-border',
          error ? 'border-error' : '',
        )}
        style={[{ minHeight: 52 }, multiline ? { paddingVertical: 10 } : null]}
      >
        {left}
        <RNTextInput
          ref={ref}
          multiline={multiline}
          className={twMerge('flex-1 font-sans text-base', className)}
          placeholderTextColor={colors.subtle}
          // Explicit color: Android renders white text on secureTextEntry otherwise.
          style={[{ color: colors.foreground }, style]}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          {...rest}
        />
        {right}
      </View>

      {error ? <Paragraph appear={false} className="text-xs text-error">{error}</Paragraph> : null}
    </View>
  )
})

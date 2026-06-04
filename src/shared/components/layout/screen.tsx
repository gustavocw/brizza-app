import type { ReactNode } from 'react'
import { Keyboard, Pressable, View, type StyleProp, type ViewStyle } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'
import { twMerge } from 'tailwind-merge'

export type ScreenProps = {
  children: ReactNode
  /** Wrap content in a keyboard-aware scroll view. Default true. */
  scroll?: boolean
  /** Safe-area edges. Default ['top']. */
  edges?: Edge[]
  /** Space kept between the focused input and the keyboard while scrolling. Default 24. */
  bottomOffset?: number
  /** Tap empty space to blur the input + close the keyboard. Default true. */
  dismissKeyboardOnTap?: boolean
  className?: string
  contentClassName?: string
  contentContainerStyle?: StyleProp<ViewStyle>
}

/**
 * Standard screen wrapper. THIS is the keyboard contract for the whole app:
 *
 *  - The focused input is never covered — KeyboardAwareScrollView SCROLLS it
 *    into view (it does not shove the whole layout up), identically on iOS/Android.
 *  - Tapping any empty area blurs the input and dismisses the keyboard
 *    (keyboardShouldPersistTaps="handled" in scroll mode; a Pressable in fixed mode).
 *  - Drag-to-dismiss the keyboard via keyboardDismissMode="interactive".
 *
 * Requires <KeyboardProvider> at the root (it's in AppProviders).
 *
 * NOTE: we deliberately do NOT wrap the scroll view in a TouchableWithoutFeedback
 * — that breaks nested-scroll gestures on Android. persistTaps covers dismissal.
 */
export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  bottomOffset = 24,
  dismissKeyboardOnTap = true,
  className,
  contentClassName,
  contentContainerStyle,
}: ScreenProps) {
  const body = scroll ? (
    <KeyboardAwareScrollView
      bottomOffset={bottomOffset}
      keyboardShouldPersistTaps={dismissKeyboardOnTap ? 'handled' : 'always'}
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
    >
      <View className={twMerge('flex-1 gap-4 p-4', contentClassName)}>{children}</View>
    </KeyboardAwareScrollView>
  ) : dismissKeyboardOnTap ? (
    <Pressable className={twMerge('flex-1 gap-4 p-4', contentClassName)} onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </Pressable>
  ) : (
    <View className={twMerge('flex-1 gap-4 p-4', contentClassName)}>{children}</View>
  )

  return (
    <SafeAreaView edges={edges} className={twMerge('flex-1 bg-background', className)}>
      {body}
    </SafeAreaView>
  )
}

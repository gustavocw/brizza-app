import type { ReactNode } from 'react'
import { Keyboard, Pressable, View, type StyleProp, type ViewStyle } from 'react-native'
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller'
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'
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
  /**
   * Fixed action area pinned to the bottom of the screen, ABOVE the Android nav bar
   * / home indicator (safe area) and ABOVE the keyboard when it opens. The content
   * scrolls behind it, so a form's submit button stays put no matter the form length.
   */
  footer?: ReactNode
  className?: string
  contentClassName?: string
  contentContainerStyle?: StyleProp<ViewStyle>
}

/**
 * Standard screen wrapper. THIS is the keyboard contract for the whole app:
 *
 *  - The focused input is never covered — KeyboardAwareScrollView SCROLLS it
 *    into view (it does not shove the whole layout up), identically on iOS/Android.
 *  - Tapping any empty area blurs the input and dismisses the keyboard.
 *  - A `footer` stays pinned to the bottom (above the safe area + keyboard).
 *
 * Requires <KeyboardProvider> at the root (it's in AppProviders).
 */
export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  bottomOffset = 24,
  dismissKeyboardOnTap = true,
  footer,
  className,
  contentClassName,
  contentContainerStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets()

  const body = scroll ? (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
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
      {footer ? (
        <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
          <View className="bg-background px-4 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
            {footer}
          </View>
        </KeyboardStickyView>
      ) : null}
    </SafeAreaView>
  )
}

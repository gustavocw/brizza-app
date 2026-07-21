import type { ReactNode } from 'react'
import { Keyboard, Pressable, View, type StyleProp, type ViewStyle } from 'react-native'
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller'
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'
import { twMerge } from 'tailwind-merge'
import { ScreenGradient } from './screen-gradient'

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
  /** Paint the diagonal app background gradient behind the screen. Default false. */
  gradient?: boolean
  /** Optional override for the top color of the gradient (only used when `gradient`). */
  gradientTopColor?: string
  /** Hold the white top solid until this many px down (only with `gradient`). */
  gradientTopHold?: number
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
  gradient = false,
  gradientTopColor,
  gradientTopHold,
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

  const shell = (
    <SafeAreaView edges={edges} className={twMerge('flex-1', gradient ? 'bg-transparent' : 'bg-background', className)}>
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

  // Gradient sits behind the (transparent) safe-area shell so it covers the whole
  // window, status bar included.
  if (gradient) {
    return (
      <View className="flex-1">
        <ScreenGradient topColor={gradientTopColor} topHoldPx={gradientTopHold} />
        {shell}
      </View>
    )
  }

  return shell
}

import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Flash, Home2, Notification, Profile } from 'iconsax-react-nativejs'
import { AnimatedTabChip } from './animated-tab-chip'
import { shadowsTheme } from '@/theme/theme'

type TabItem = {
  label: string
  /** Expanded width, sized to fit the label. */
  width: number
  renderIcon: (color: string) => ReactNode
}

// Structural subset of expo-router's tabBar props (the package's types aren't
// resolvable from the app root, and we only touch these fields).
type FloatingTabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] }
  navigation: {
    emit: (event: {
      type: 'tabPress'
      target: string
      canPreventDefault: true
    }) => { defaultPrevented: boolean }
    navigate: (name: string) => void
  }
}

// Keyed by the route file name (English). Labels stay in Portuguese for the UI.
const TAB_ITEMS: Record<string, TabItem> = {
  home: { label: 'Início', width: 112, renderIcon: (color) => <Home2 size={25} color={color} variant="Bold" /> },
  // `bike` (Motor) hidden from the tab bar for now — no TAB_ITEMS entry means the
  // bar skips it (`if (!item) return null`). The screen/route still exists; its data
  // was consolidated into Home. Re-add a `bike` entry here (+ import MotoIcon) to bring it back.
  charge: { label: 'Carregar', width: 134, renderIcon: (color) => <Flash size={25} color={color} variant="Bold" /> },
  alerts: { label: 'Alertas', width: 122, renderIcon: (color) => <Notification size={25} color={color} variant="Bold" /> },
  profile: { label: 'Perfil', width: 112, renderIcon: (color) => <Profile size={25} color={color} variant="Bold" /> },
}

/**
 * Floating, expandable tab bar (expo-router custom `tabBar`). The active tab
 * springs open to icon + label; the rest collapse to icons. Floats over the
 * content above the bottom safe area.
 */
export function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <View
        style={[styles.bar, shadowsTheme.md, { marginBottom: insets.bottom + 2 }]}
        className="flex-row items-center gap-1 rounded-full bg-surface p-1.5"
      >
        {state.routes.map((route, index) => {
          const item = TAB_ITEMS[route.name]
          if (!item) return null
          const isActive = state.index === index

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
            if (!isActive && !event.defaultPrevented) navigation.navigate(route.name)
          }

          return (
            <AnimatedTabChip
              key={route.key}
              label={item.label}
              activeWidth={item.width}
              renderIcon={item.renderIcon}
              isActive={isActive}
              onPress={onPress}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    maxWidth: '94%',
  },
})

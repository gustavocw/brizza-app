import type { ReactNode } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Notification, Profile } from 'iconsax-react-nativejs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AnimatedTabChip } from './animated-tab-chip'
import { useHasNavButtons } from '@/shared/hooks/use-has-nav-buttons'
import { shadowsTheme } from '@/theme/theme'

type TabItem = {
  label: string
  /** Fallback expanded width until the chip measures its own label. */
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
  motorcycle: { label: 'Moto', width: 104, renderIcon: (color) => <MaterialCommunityIcons name="motorbike-electric" size={27} color={color} /> },
  charge: { label: 'Carregar', width: 134, renderIcon: (color) => <MaterialCommunityIcons name="ev-station" size={26} color={color} /> },
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
  const hasNavButtons = useHasNavButtons()
  const { width } = useWindowDimensions()

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <View
        // Grows to fit its chips (no squeezed labels), capped at the screen width
        // minus 16px on each side. Extra bottom lift only over Android's 3-button
        // nav bar so the bar floats clear (gesture nav / iOS home need just a hair).
        style={[shadowsTheme.md, { maxWidth: width - 32, marginBottom: insets.bottom + (hasNavButtons ? 16 : 2) }]}
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
})

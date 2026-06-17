import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { shadowsTheme } from '@/theme/theme'
import { useColors } from '@/theme/use-colors'

/**
 * Brizze app mark: the blueprint lightning bolt in a rounded accent tile.
 * Same bolt path as the brand blueprint, themed via tokens.
 */
export function BrandMark({ size = 60 }: { size?: number }) {
  const colors = useColors()
  return (
    <View
      className="items-center justify-center rounded-2xl bg-accent"
      style={[shadowsTheme.md, { width: size, height: size }]}
    >
      <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
        <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={colors.onAccent} />
      </Svg>
    </View>
  )
}

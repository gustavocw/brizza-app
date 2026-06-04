import Svg, { Circle, Path } from 'react-native-svg'

type MotoIconProps = {
  size?: number
  color?: string
}

/**
 * Motorcycle glyph for the "Moto" tab. iconsax has no motorbike, and this app is
 * literally about e-motos, so we ship our own. Drawn solid/filled (solid tires
 * with a hub cutout + a chunky body mass) to match the weight of the iconsax
 * `variant="Bold"` icons used by the other tabs. `color` drives it the same way.
 */
export function MotoIcon({ size = 24, color = '#000000' }: MotoIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* rear + front wheels: solid tire with hub cutout (evenodd) */}
      <Path
        fillRule="evenodd"
        d="M5.2 13.3a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6Zm0 1.95a1.35 1.35 0 110 2.7 1.35 1.35 0 010-2.7Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        d="M18.8 13.3a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6Zm0 1.95a1.35 1.35 0 110 2.7 1.35 1.35 0 010-2.7Z"
        fill={color}
      />
      {/* body: seat + tank + engine as one solid mass (stroke rounds the corners) */}
      <Path
        d="M3.9 11 L4.6 9.4 L11 8.9 L12.5 9.2 L13.9 11.7 L12.6 13.5 L8 14.3 L4.7 13.2 Z"
        fill={color}
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* front fork down to the front wheel */}
      <Path d="M13.5 11.9 L18.8 16.6" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      {/* handlebar sweeping up to the grip */}
      <Path d="M12.4 9.4C13.9 7.7 15.5 6.8 17.7 6.9" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <Circle cx={17.8} cy={7} r={1.15} fill={color} />
    </Svg>
  )
}

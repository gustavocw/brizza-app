import { Image } from 'react-native'

// Official brizze wordmark (navy + green) — the same asset the splash uses.
const WORDMARK = require('../../../../assets/brizze-wordmark.png')

const ASPECT = 489 / 1500 // wordmark intrinsic ratio

/** Official Brizze wordmark, for the auth screens. */
export function BrandMark({ width = 176 }: { width?: number }) {
  return <Image source={WORDMARK} style={{ width, height: width * ASPECT }} resizeMode="contain" />
}

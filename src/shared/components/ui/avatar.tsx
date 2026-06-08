import { useState } from 'react'
import { Image, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Appear } from './appear'
import { Paragraph } from './paragraph'

function initials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

export function Avatar({
  uri,
  name,
  size = 44,
  delay = 0,
  className,
}: {
  uri?: string | null
  name?: string
  size?: number
  delay?: number
  className?: string
}) {
  const [errored, setErrored] = useState(false)
  const showImage = uri && !errored

  return (
    <Appear delay={delay}>
      <View
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className={twMerge('items-center justify-center overflow-hidden bg-primarySoft', className)}
      >
        {showImage ? (
          <Image source={{ uri }} style={{ width: size, height: size }} onError={() => setErrored(true)} />
        ) : (
          <Paragraph
            appear={false}
            style={{ fontSize: size * 0.38, lineHeight: size * 0.46, includeFontPadding: false }}
            className="font-semibold text-primary"
          >
            {initials(name)}
          </Paragraph>
        )}
      </View>
    </Appear>
  )
}

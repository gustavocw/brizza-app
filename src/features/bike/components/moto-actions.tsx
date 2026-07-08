import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Clock, Discover, Lock } from 'iconsax-react-nativejs'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'

function ActionChip({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={shadowsTheme.sm}
      className="flex-1 items-center gap-2 rounded-3xl bg-surface p-4"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primarySoft">{icon}</View>
      <Paragraph appear={false} className="text-xs font-medium text-foreground">
        {label}
      </Paragraph>
    </Pressable>
  )
}

type Props = {
  onLocate: () => void
  onLock: () => void
  onHistory: () => void
}

/** Quick bike actions: locate (beep/flash), lock, trip history. */
export function MotoActions({ onLocate, onLock, onHistory }: Props) {
  const colors = useColors()
  return (
    <Row className="gap-3">
      <ActionChip icon={<Discover size={22} color={colors.primary} variant="Bold" />} label="Localizar" onPress={onLocate} />
      <ActionChip icon={<Lock size={22} color={colors.primary} variant="Bold" />} label="Bloquear" onPress={onLock} />
      <ActionChip icon={<Clock size={22} color={colors.primary} variant="Bold" />} label="Histórico" onPress={onHistory} />
    </Row>
  )
}

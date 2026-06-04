import { ArrowLeft2 } from 'iconsax-react-nativejs'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useColors } from '@/theme/use-colors'
import { IconButton } from './icon-button'

export function BackButton({ onPress }: { onPress?: () => void }) {
  const nav = useNavigation()
  const colors = useColors()
  return (
    <IconButton onPress={onPress ?? nav.back} accessibilityRole="button" accessibilityLabel="Voltar">
      <ArrowLeft2 size={20} color={colors.foreground} />
    </IconButton>
  )
}

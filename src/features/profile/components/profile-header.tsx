import { ActivityIndicator, Pressable, View } from 'react-native'
import { Camera } from 'iconsax-react-nativejs'
import { Avatar } from '@/shared/components/ui/avatar'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'
import { useColors } from '@/theme/use-colors'

type Props = {
  name: string
  email: string
  photoUrl?: string | null
  onChangePhoto: () => void
  uploading?: boolean
  delay?: number
}

/** Clean, centered identity header: avatar (tap to change photo), name, email. */
export function ProfileHeader({ name, email, photoUrl, onChangePhoto, uploading, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <View className="items-center gap-4 pb-1 pt-3">
      <Pressable onPress={onChangePhoto} disabled={uploading} accessibilityRole="button" accessibilityLabel="Alterar foto">
        <Avatar uri={photoUrl} name={name} size={104} delay={delay} />
        <View className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary">
          {uploading ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Camera size={18} color={colors.onPrimary} variant="Bold" />
          )}
        </View>
      </Pressable>

      <View className="items-center gap-1">
        <Title appear={false} numberOfLines={1} className="text-[26px]">
          {name}
        </Title>
        <Paragraph appear={false} numberOfLines={1} className="text-base text-muted">
          {email}
        </Paragraph>
      </View>
    </View>
  )
}

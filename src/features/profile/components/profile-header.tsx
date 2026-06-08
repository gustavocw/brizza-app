import { View } from 'react-native'
import { Avatar } from '@/shared/components/ui/avatar'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'

type Props = {
  name: string
  email: string
  photoUrl?: string | null
  delay?: number
}

/** Clean, centered identity header: avatar, name, email. */
export function ProfileHeader({ name, email, photoUrl, delay = 0 }: Props) {
  return (
    <View className="items-center gap-4 pb-1 pt-3">
      <Avatar uri={photoUrl} name={name} size={104} delay={delay} />
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

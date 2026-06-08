import { View } from 'react-native'
import { Notification } from 'iconsax-react-nativejs'
import { EmptyState } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'

/** Empty state for a user with no notifications (shared primitive + squircle chip). */
export function NotificationsEmpty() {
  const colors = useColors()
  return (
    <EmptyState
      icon={
        <View className="mb-1 h-20 w-20 items-center justify-center rounded-2xl bg-primarySoft">
          <Notification size={34} color={colors.primary} variant="Bold" />
        </View>
      }
      title="Nenhum alerta por aqui"
      message="Quando algo acontecer com a sua moto, você fica sabendo primeiro."
    />
  )
}

import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { TickCircle, Trash } from 'iconsax-react-nativejs'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import type { AppNotification } from '../services/notification.dto'

function ActionRow({ icon, label, danger, onPress }: { icon: ReactNode; label: string; danger?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 rounded-2xl py-2.5">
      <View className={twMerge('h-11 w-11 items-center justify-center rounded-2xl', danger ? 'bg-errorSoft' : 'bg-surfaceMuted')}>
        {icon}
      </View>
      <Paragraph appear={false} className={twMerge('text-base font-medium', danger ? 'text-error' : 'text-foreground')}>
        {label}
      </Paragraph>
    </Pressable>
  )
}

type Props = {
  notification: AppNotification
  onMarkRead: () => void
  onDelete: () => void
  onClose: () => void
}

/** Per-notification actions, opened in a bottom sheet from the row's kebab. */
export function NotificationActionsSheet({ notification, onMarkRead, onDelete, onClose }: Props) {
  const colors = useColors()
  const unread = !notification.read_at

  return (
    <View className="gap-1">
      <Paragraph appear={false} numberOfLines={1} className="px-1 pb-1 font-semibold text-foreground">
        {notification.title}
      </Paragraph>

      {unread ? (
        <ActionRow
          icon={<TickCircle size={20} color={colors.primary} variant="Bold" />}
          label="Marcar como lida"
          onPress={() => {
            onMarkRead()
            onClose()
          }}
        />
      ) : null}

      <ActionRow
        danger
        icon={<Trash size={20} color={colors.error} variant="Bold" />}
        label="Excluir notificação"
        onPress={() => {
          onDelete()
          onClose()
        }}
      />
    </View>
  )
}

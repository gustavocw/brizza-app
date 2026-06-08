import { View } from 'react-native'
import { Skeleton } from '@/shared/components/ui/skeleton'

/** Loading placeholder mirroring the notification list. */
export function NotificationsSkeleton() {
  return (
    <View className="gap-3 px-4 pt-1">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={i} className="flex-row gap-3 rounded-3xl bg-surface p-4">
          <Skeleton style={{ width: 44, height: 44, borderRadius: 16 }} />
          <View className="flex-1 gap-2 pt-1">
            <Skeleton style={{ height: 14, width: '55%', borderRadius: 6 }} />
            <Skeleton style={{ height: 12, width: '90%', borderRadius: 6 }} />
            <Skeleton style={{ height: 10, width: '28%', borderRadius: 6 }} />
          </View>
        </View>
      ))}
    </View>
  )
}

import { View } from 'react-native'
import { Skeleton } from '@/shared/components/ui/skeleton'

/** Loading placeholder mirroring the dashboard layout. */
export function DashboardSkeleton() {
  return (
    <View className="gap-4">
      <Skeleton style={{ height: 196, borderRadius: 28 }} />
      <View className="flex-row gap-4">
        <Skeleton style={{ flex: 1, height: 112, borderRadius: 16 }} />
        <Skeleton style={{ flex: 1, height: 112, borderRadius: 16 }} />
      </View>
      <Skeleton style={{ height: 210, borderRadius: 16 }} />
      <Skeleton style={{ height: 56, borderRadius: 999 }} />
    </View>
  )
}

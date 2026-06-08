import { View } from 'react-native'
import { Skeleton } from '@/shared/components/ui/skeleton'

/** Loading placeholder mirroring the Moto layout (hero, actions, cards). */
export function MotoSkeleton() {
  return (
    <View className="gap-4">
      <Skeleton style={{ height: 132, borderRadius: 32 }} />
      <View className="flex-row gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} style={{ flex: 1, height: 96, borderRadius: 24 }} />
        ))}
      </View>
      <Skeleton style={{ height: 148, borderRadius: 24 }} />
      <View className="flex-row gap-4">
        <Skeleton style={{ flex: 1, height: 116, borderRadius: 24 }} />
        <Skeleton style={{ flex: 1, height: 116, borderRadius: 24 }} />
      </View>
    </View>
  )
}

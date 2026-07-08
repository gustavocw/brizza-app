import { View } from 'react-native'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { shadowsTheme } from '@/theme/theme'

/** Loading placeholder for the station list (the map shows its own loader). */
export function ChargeSkeleton() {
  return (
    <View className="gap-3 px-4 pt-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={shadowsTheme.sm} className="flex-row items-center gap-3 rounded-3xl bg-surface p-4">
          <Skeleton style={{ width: 48, height: 48, borderRadius: 16 }} />
          <View className="flex-1 gap-2">
            <Skeleton style={{ height: 14, width: '60%', borderRadius: 6 }} />
            <Skeleton style={{ height: 11, width: '85%', borderRadius: 6 }} />
            <Skeleton style={{ height: 11, width: '45%', borderRadius: 6 }} />
          </View>
          <Skeleton style={{ width: 44, height: 44, borderRadius: 22 }} />
        </View>
      ))}
    </View>
  )
}

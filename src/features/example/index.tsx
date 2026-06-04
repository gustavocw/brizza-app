import { FlatList, RefreshControl, View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { Button } from '@/shared/components/ui/button'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'
import { ExampleCard } from './components/example-card'
import { useExample } from './hooks/use-example'

/**
 * Feature view — UI only. All behavior comes from the useExample() controller.
 *
 * scroll={false} because the FlatList scrolls itself; never nest a FlatList in
 * a ScrollView. Inputs in this feature live inside the (keyboard-aware) sheet.
 */
export default function ExampleScreen() {
  const { examples, isLoading, isRefetching, refetch, onAdd, onDelete } = useExample()

  return (
    <Screen scroll={false}>
      <View className="flex-row items-center justify-between">
        <Title>Examples</Title>
        <Button label="Add" full={false} onPress={onAdd} />
      </View>

      <FlatList
        data={examples}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        renderItem={({ item, index }) => (
          // Cap the stagger so far-down rows don't wait forever (domino, bounded).
          <ExampleCard example={item} delay={Math.min(index, 6) * 60} onDelete={() => onDelete(item.id)} />
        )}
        ListEmptyComponent={
          !isLoading ? <Paragraph className="text-muted">Nothing here yet. Tap Add.</Paragraph> : null
        }
      />
    </Screen>
  )
}

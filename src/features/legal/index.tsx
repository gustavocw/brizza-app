import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { BackButton, Badge, Button, Skeleton, Title } from '@/shared/components/ui'
import { Markdown } from './components/markdown'
import { legalBody } from './services/legal.dto'
import { useLegal } from './hooks/use-legal'

/**
 * Legal viewer — UI only. Renders the API-served privacy policy / terms of use
 * markdown. When the user hasn't accepted the current version, a fixed footer
 * offers to accept. Reachable from the profile screen.
 */
export default function LegalScreen() {
  const { query, title, needsAccept, onAccept, accepting } = useLegal()
  const data = query.data

  return (
    <Screen gradient
      contentClassName="gap-5 px-5 pt-1"
      footer={
        needsAccept ? (
          <Button label="Aceitar termos e privacidade" isLoading={accepting} disabled={accepting} onPress={onAccept} />
        ) : undefined
      }
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          {title}
        </Title>
      </View>

      <QueryBoundary
        query={query}
        loading={
          <View className="gap-3">
            {[64, 220, 180, 240, 160].map((w, i) => (
              <Skeleton key={i} style={{ height: 16, width: `${(w / 260) * 100}%`, borderRadius: 6 }} />
            ))}
          </View>
        }
      >
        {data ? (
          <View className="gap-4 pb-6">
            {data.version ? <Badge tone="neutral" label={`Versão ${data.version}`} /> : null}
            <Markdown content={legalBody(data)} />
          </View>
        ) : null}
      </QueryBoundary>
    </Screen>
  )
}

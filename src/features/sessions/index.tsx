import { Fragment } from 'react'
import { Pressable, View } from 'react-native'
import { Devices, Monitor, MonitorMobbile } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { BackButton, Badge, Card, Divider, Paragraph, Skeleton, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { deviceLabel, relTime, type Session } from './services/sessions.dto'
import { useSessions } from './hooks/use-sessions'

function DeviceIcon({ label, color }: { label: string; color: string }) {
  const Icon = /iPhone|iPad|Android|Mobile/i.test(label) ? MonitorMobbile : /Mac|Windows/i.test(label) ? Monitor : Devices
  return <Icon size={22} color={color} variant="Bold" />
}

function SessionRow({ session, onRevoke }: { session: Session; onRevoke: () => void }) {
  const colors = useColors()
  const label = deviceLabel(session.user_agent)
  return (
    <View className="flex-row items-center gap-3 py-3.5">
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primarySoft">
        <DeviceIcon label={label} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Paragraph appear={false} numberOfLines={1} className="font-medium text-foreground">
          {label}
        </Paragraph>
        <Paragraph appear={false} numberOfLines={1} className="text-xs text-muted">
          {session.ip} · {relTime(session.last_seen_at)}
        </Paragraph>
      </View>
      {session.current ? (
        <Badge tone="success" label="Atual" />
      ) : (
        <Pressable onPress={onRevoke} hitSlop={8}>
          <Paragraph appear={false} className="text-sm font-semibold text-error">
            Encerrar
          </Paragraph>
        </Pressable>
      )}
    </View>
  )
}

/** Active sessions — UI only. GET /auth/sessions; revoke a device (not the current one). */
export default function SessionsScreen() {
  const { query, sessions, onRevoke } = useSessions()

  return (
    <Screen gradient contentClassName="gap-5 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Sessões ativas
        </Title>
      </View>

      <QueryBoundary query={query} isEmpty={sessions.length === 0} loading={<Skeleton style={{ height: 160, borderRadius: 24 }} />}>
        <Card className="rounded-3xl bg-surface px-4 py-1">
          {sessions.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 ? <Divider /> : null}
              <SessionRow session={s} onRevoke={() => onRevoke(s)} />
            </Fragment>
          ))}
        </Card>
      </QueryBoundary>
    </Screen>
  )
}

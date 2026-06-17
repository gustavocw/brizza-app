import { Fragment } from 'react'
import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { BackButton, Card, Divider, Paragraph, Skeleton, Switch, Title } from '@/shared/components/ui'
import { PREF_ITEMS } from './services/notification-prefs.dto'
import { useNotificationSettings } from './hooks/use-notification-settings'

/**
 * Notification settings — UI only. Toggles wired to the Brizze API
 * (GET/PUT /user/me/notification-preferences), applied optimistically.
 */
export default function NotificationSettingsScreen() {
  const { query, prefs, onToggle } = useNotificationSettings()

  return (
    <Screen contentClassName="gap-5 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Notificações
        </Title>
      </View>

      <QueryBoundary query={query} loading={<Skeleton style={{ height: 332, borderRadius: 24 }} />}>
        {prefs ? (
          <Card className="rounded-3xl border-transparent bg-surface px-4 py-1">
            {PREF_ITEMS.map((item, i) => (
              <Fragment key={item.key}>
                {i > 0 ? <Divider /> : null}
                <View className="flex-row items-center gap-3 py-3.5">
                  <View className="flex-1">
                    <Paragraph appear={false} className="font-medium text-foreground">
                      {item.label}
                    </Paragraph>
                    <Paragraph appear={false} className="mt-0.5 text-xs text-muted">
                      {item.sub}
                    </Paragraph>
                  </View>
                  <Switch value={prefs[item.key]} onChange={() => onToggle(item.key)} />
                </View>
              </Fragment>
            ))}
          </Card>
        ) : null}
      </QueryBoundary>
    </Screen>
  )
}

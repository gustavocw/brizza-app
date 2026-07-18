import type { ComponentProps } from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import type { CheckStatus, DashboardData } from '../services/dashboard.dto'
import { CARD_BORDER } from '@/shared/constants/card-style'

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name']

const ITEMS: { key: keyof DashboardData['checks']; label: string; icon: IconName }[] = [
  { key: 'system', label: 'Sistema', icon: 'chip' },
  { key: 'battery', label: 'Bateria', icon: 'battery' },
  { key: 'motor', label: 'Motor', icon: 'engine' },
  { key: 'brakes', label: 'Freios', icon: 'car-brake-alert' },
  { key: 'tires', label: 'Pneus', icon: 'tire' },
]

function Check({ label, status, icon }: { label: string; status: CheckStatus; icon: IconName }) {
  const colors = useColors()
  const palette: Record<CheckStatus, { bg: string; fg: string }> = {
    ok: { bg: colors.primarySoft, fg: colors.primary },
    attention: { bg: colors.warningSoft, fg: colors.warning },
    problem: { bg: colors.errorSoft, fg: colors.error },
  }
  const { bg, fg } = palette[status]
  return (
    <View className="flex-1 items-center gap-2">
      <View style={{ backgroundColor: bg }} className="h-[52px] w-[52px] items-center justify-center rounded-full">
        <MaterialCommunityIcons name={icon} size={26} color={fg} />
      </View>
      <Paragraph appear={false} className="text-xs font-medium text-foreground">
        {label}
      </Paragraph>
    </View>
  )
}

/** Quick health snapshot — an icon per part in a status-colored circle (green ok / amber attention / red problem). */
export function HealthChecks({ checks, delay = 0 }: { checks: DashboardData['checks']; delay?: number }) {
  return (
    <Card delay={delay} style={CARD_BORDER} className="rounded-3xl bg-surface p-4">
      <Row className="gap-1">
        {ITEMS.map((it) => (
          <Check key={it.key} label={it.label} status={checks[it.key]} icon={it.icon} />
        ))}
      </Row>
    </Card>
  )
}

import { Pressable, TextInput } from 'react-native'
import { SearchNormal1 } from 'iconsax-react-nativejs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { CARD_BORDER } from '@/shared/constants/card-style'
import type { ChargeView } from '../hooks/use-charge'

type Props = {
  search: string
  onSearch: (text: string) => void
  view: ChargeView
  onView: (view: ChargeView) => void
}

function ToggleButton({ active, icon, label, onPress }: { active: boolean; icon: 'map-outline' | 'view-agenda-outline'; label: string; onPress: () => void }) {
  const colors = useColors()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      className={`h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-primary' : ''}`}
    >
      <MaterialCommunityIcons name={icon} size={18} color={active ? colors.onPrimary : colors.muted} />
    </Pressable>
  )
}

/** Search bar + the map/list view toggle, reference style. */
export function SearchHeader({ search, onSearch, view, onView }: Props) {
  const colors = useColors()

  return (
    <Row className="items-center gap-3">
      <Row style={CARD_BORDER} className="h-12 flex-1 items-center gap-2 rounded-full bg-surface px-4">
        <SearchNormal1 size={18} color={colors.subtle} />
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Buscar estação"
          placeholderTextColor={colors.subtle}
          returnKeyType="search"
          autoCorrect={false}
          style={{ fontFamily: fontTheme.sans, paddingVertical: 0 }}
          className="flex-1 text-sm text-foreground"
          accessibilityLabel="Buscar estação"
        />
      </Row>

      <Row style={CARD_BORDER} className="h-12 items-center gap-1 rounded-full bg-surface p-1.5">
        <ToggleButton active={view === 'map'} icon="map-outline" label="Ver mapa" onPress={() => onView('map')} />
        <ToggleButton active={view === 'list'} icon="view-agenda-outline" label="Ver lista" onPress={() => onView('list')} />
      </Row>
    </Row>
  )
}

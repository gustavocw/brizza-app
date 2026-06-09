import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { useLinkBike } from './hooks/use-link-bike'

/** Link-bike view — UI only. Plate (+ optional model). POST /user/me/bike. */
export default function LinkBikeScreen() {
  const { control, onSubmit, isPending } = useLinkBike()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={<Button label="Vincular moto" isLoading={isPending} disabled={isPending} onPress={onSubmit} />}
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Vincular moto
        </Title>
      </View>

      <View className="gap-4">
        <Paragraph appear={false} className="text-muted">
          Informe a placa da sua Minas Brisa para vinculá-la ao seu perfil.
        </Paragraph>
        <ControlledTextField
          control={control}
          name="plate"
          label="Placa"
          placeholder="ABC1D23"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={8}
        />
        <ControlledTextField control={control} name="model" label="Modelo (opcional)" placeholder="Brisa S1" returnKeyType="go" onSubmitEditing={onSubmit} />
      </View>
    </Screen>
  )
}

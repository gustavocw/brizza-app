import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { BackButton, Button, Skeleton, Title } from '@/shared/components/ui'
import { useEditProfile } from './hooks/use-edit-profile'

/**
 * Edit-profile view — UI only. Name + address form (CEP autofills the rest).
 * PUT /user/me on save.
 */
export default function EditProfileScreen() {
  const { control, query, onCepBlur, onSubmit, isPending } = useEditProfile()

  return (
    <Screen contentClassName="gap-5 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Dados pessoais
        </Title>
      </View>

      <QueryBoundary query={query} loading={<Skeleton style={{ height: 420, borderRadius: 24 }} />}>
        <View className="gap-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ControlledTextField control={control} name="first_name" label="Nome" placeholder="Seu nome" />
            </View>
            <View className="flex-1">
              <ControlledTextField control={control} name="last_name" label="Sobrenome" placeholder="Seu sobrenome" />
            </View>
          </View>

          <ControlledTextField
            control={control}
            name="zip"
            label="CEP"
            placeholder="Somente números"
            keyboardType="number-pad"
            maxLength={8}
            onBlur={onCepBlur}
          />
          <ControlledTextField control={control} name="street" label="Rua" placeholder="Logradouro" />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ControlledTextField control={control} name="number" label="Número" placeholder="123" keyboardType="number-pad" />
            </View>
            <View className="flex-[2]">
              <ControlledTextField control={control} name="complement" label="Complemento" placeholder="Apto, bloco (opcional)" />
            </View>
          </View>
          <ControlledTextField control={control} name="neighborhood" label="Bairro" placeholder="Bairro" />
          <View className="flex-row gap-3">
            <View className="flex-[2]">
              <ControlledTextField control={control} name="city" label="Cidade" placeholder="Cidade" />
            </View>
            <View className="flex-1">
              <ControlledTextField control={control} name="state" label="UF" placeholder="MG" autoCapitalize="characters" maxLength={2} />
            </View>
          </View>

          <Button label="Salvar" isLoading={isPending} disabled={isPending} onPress={onSubmit} />
        </View>
      </QueryBoundary>
    </Screen>
  )
}

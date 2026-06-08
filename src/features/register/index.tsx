import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { ControlledPasswordField } from '@/shared/components/form/controlled-password-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { fontTheme } from '@/theme/theme'
import { useRegister } from './hooks/use-register'

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <Paragraph
      appear={false}
      style={{ fontFamily: fontTheme.monoMedium }}
      className="px-1 pt-1 text-[11px] uppercase tracking-widest text-subtle"
    >
      {children}
    </Paragraph>
  )
}

/** Register view — UI only. Personal data + access + address. POST /auth/register. */
export default function RegisterScreen() {
  const { control, onCepBlur, onSubmit, isPending } = useRegister()

  return (
    <Screen contentClassName="gap-4 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Criar conta
        </Title>
      </View>

      <GroupLabel>Dados pessoais</GroupLabel>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <ControlledTextField control={control} name="first_name" label="Nome" placeholder="Seu nome" />
        </View>
        <View className="flex-1">
          <ControlledTextField control={control} name="last_name" label="Sobrenome" placeholder="Seu sobrenome" />
        </View>
      </View>
      <ControlledTextField control={control} name="email" label="E-mail" placeholder="voce@email.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <ControlledTextField control={control} name="phone" label="Telefone" placeholder="(31) 99999-9999" keyboardType="phone-pad" />
      <ControlledTextField control={control} name="cpf" label="CPF" placeholder="Somente números" keyboardType="number-pad" maxLength={11} />

      <GroupLabel>Acesso</GroupLabel>
      <ControlledPasswordField control={control} name="password" label="Senha" placeholder="Mínimo de 8 caracteres" />
      <ControlledPasswordField control={control} name="password_confirm" label="Confirmar senha" placeholder="Repita a senha" />

      <GroupLabel>Endereço</GroupLabel>
      <ControlledTextField control={control} name="zip" label="CEP" placeholder="Somente números" keyboardType="number-pad" maxLength={8} onBlur={onCepBlur} />
      <ControlledTextField control={control} name="street" label="Rua" placeholder="Logradouro" />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <ControlledTextField control={control} name="number" label="Número" placeholder="123" keyboardType="number-pad" />
        </View>
        <View className="flex-[2]">
          <ControlledTextField control={control} name="complement" label="Complemento" placeholder="Opcional" />
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

      <Button label="Criar conta" isLoading={isPending} disabled={isPending} onPress={onSubmit} delay={0} />

      <Paragraph appear={false} className="px-2 pb-2 pt-1 text-center text-xs text-subtle">
        Ao criar a conta você concorda com os Termos de Uso e a Política de Privacidade.
      </Paragraph>
    </Screen>
  )
}

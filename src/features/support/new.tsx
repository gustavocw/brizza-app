import { Controller } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { CATEGORIES, CATEGORY } from './services/support.dto'
import { useNewTicket } from './hooks/use-new-ticket'

/** New support ticket — UI only. Category chips + subject + description. POST. */
export default function NewTicketScreen() {
  const { control, onSubmit, isPending, canSubmit } = useNewTicket()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={<Button label="Enviar chamado" isLoading={isPending} disabled={isPending || !canSubmit} onPress={onSubmit} />}
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Abrir chamado
        </Title>
      </View>

      <View className="gap-4">
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <View className="gap-2">
              <Paragraph appear={false} className="font-medium text-[13px] text-muted">
                Categoria
              </Paragraph>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => onChange(c)}
                    className={twMerge(
                      'rounded-full border px-3.5 py-2',
                      value === c ? 'border-primary bg-primarySoft' : 'border-border bg-surface',
                    )}
                  >
                    <Paragraph
                      appear={false}
                      className={twMerge('text-xs font-semibold', value === c ? 'text-primary' : 'text-muted')}
                    >
                      {CATEGORY[c]}
                    </Paragraph>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        />

        <ControlledTextField control={control} name="subject" label="Assunto" placeholder="Resumo do problema" maxLength={200} />
        <ControlledTextField
          control={control}
          name="body"
          label="Descrição"
          placeholder="Conte os detalhes do que aconteceu"
          multiline
          numberOfLines={6}
          maxLength={5000}
          style={{ height: 130, textAlignVertical: 'top' }}
        />
      </View>
    </Screen>
  )
}

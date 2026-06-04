import { View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Title } from '@/shared/components/ui/title'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { useCreateExample } from '../hooks/use-example-query'

// Form standard: zod schema → resolver → controlled fields. Validation messages
// surface on the field automatically.
const schema = z.object({
  title: z.string().min(1, 'Obrigatório'),
})
type FormValues = z.infer<typeof schema>

/**
 * Lives inside a (keyboard-aware) bottom sheet, so this input is never covered.
 * `onDone` is the sheet's close() — call it after success.
 */
export function CreateExampleForm({ onDone }: { onDone: () => void }) {
  const createExample = useCreateExample()
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  })

  const submit = handleSubmit(async ({ title }) => {
    try {
      await createExample.mutateAsync({ title: title.trim() })
      onDone()
    } catch {
      // error toast is surfaced globally by the mutation cache
    }
  })

  return (
    <View className="gap-4 px-5">
      <Title className="text-lg">New example</Title>
      <ControlledTextField
        control={control}
        name="title"
        label="Title"
        placeholder="Type something"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Button label="Create" isLoading={createExample.isPending} onPress={submit} />
    </View>
  )
}

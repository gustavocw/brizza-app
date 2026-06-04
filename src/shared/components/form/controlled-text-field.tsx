import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { TextField, type TextFieldProps } from '@/shared/components/ui/text-field'

type Props<T extends FieldValues> = Omit<TextFieldProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>
  name: Path<T>
}

/**
 * react-hook-form-bound TextField. Wires value/onChange/onBlur and surfaces the
 * zod validation message as the field error.
 *
 *   const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) })
 *   <ControlledTextField control={control} name="email" label="Email" />
 */
export function ControlledTextField<T extends FieldValues>({ control, name, ...rest }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <TextField
          {...rest}
          value={(value as string) ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  )
}

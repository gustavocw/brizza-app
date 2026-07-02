import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { TextField, type TextFieldProps } from '@/shared/components/ui/text-field'

type Props<T extends FieldValues> = Omit<TextFieldProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>
  name: Path<T>
  /**
   * Optional formatter applied on every keystroke (e.g. maskCpf/maskPhone/maskCep
   * from '@/shared/utils/masks'). The form holds the MASKED string; strip it with
   * onlyDigits() before sending to the API. Masks cap the length, so no maxLength.
   */
  mask?: (raw: string) => string
}

/**
 * react-hook-form-bound TextField. Wires value/onChange/onBlur and surfaces the
 * zod validation message as the field error. Pass `mask` for formatted inputs.
 *
 *   const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) })
 *   <ControlledTextField control={control} name="email" label="Email" />
 *   <ControlledTextField control={control} name="cpf" mask={maskCpf} keyboardType="number-pad" />
 */
export function ControlledTextField<T extends FieldValues>({ control, name, onBlur: onBlurProp, mask, ...rest }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <TextField
          {...rest}
          value={mask ? mask((value as string) ?? '') : ((value as string) ?? '')}
          onChangeText={(text) => onChange(mask ? mask(text) : text)}
          onBlur={(e) => {
            onBlur()
            onBlurProp?.(e)
          }}
          error={error?.message}
        />
      )}
    />
  )
}

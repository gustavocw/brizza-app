import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { TextField, type TextFieldProps } from '@/shared/components/ui/text-field'
import { maskCpf } from '../utils/cpf'

type Props<T extends FieldValues> = Omit<TextFieldProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>
  name: Path<T>
}

/**
 * react-hook-form-bound CPF input. Like ControlledTextField, but applies the
 * 000.000.000-00 mask on every keystroke; the form holds the masked string and
 * the schema validates the digits (see auth.dto.ts).
 */
export function CpfField<T extends FieldValues>({ control, name, ...rest }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <TextField
          {...rest}
          keyboardType="number-pad"
          value={maskCpf((value as string) ?? '')}
          onChangeText={(text) => onChange(maskCpf(text))}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  )
}

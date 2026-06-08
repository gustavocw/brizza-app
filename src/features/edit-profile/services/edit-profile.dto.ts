import { z } from 'zod'

// UpdateProfileRequest = { first_name, last_name, address }. The form is flattened;
// the address is rebuilt on submit. Mirrors the Brizza API Address schema.
export const editProfileSchema = z.object({
  first_name: z.string().trim().min(2, 'Mínimo de 2 caracteres'),
  last_name: z.string().trim().min(2, 'Mínimo de 2 caracteres'),
  zip: z.string().regex(/^\d{8}$/, 'CEP de 8 dígitos'),
  street: z.string().trim().min(1, 'Informe a rua'),
  number: z.string().trim().min(1, 'Informe o número'),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(1, 'Informe o bairro'),
  city: z.string().trim().min(1, 'Informe a cidade'),
  state: z.string().trim().length(2, 'UF'),
})
export type EditProfileForm = z.infer<typeof editProfileSchema>

export type CepLookup = { cep: string; street?: string; neighborhood?: string; city?: string; state?: string }

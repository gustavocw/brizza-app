// Progressive input masks + digit helpers, shared across every form. The masked
// string is what the field/form holds; strip with onlyDigits() before sending to
// the API. Each mask caps the digit count, so no separate maxLength is needed.

/** Strip everything that isn't a digit (use before sending to the API). */
export const onlyDigits = (value: string) => value.replace(/\D/g, '')

/** CPF as the user types: 000.000.000-00 (capped at 11 digits). */
export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`
  return d
}

/** BR phone as the user types: (00) 00000-0000, also handles landlines (10 digits). */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** CEP as the user types: 00000-000 (capped at 8 digits). */
export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

/** 6-digit confirmation code (verify, trocar contato, reset): digits only, capped at 6. */
export const maskCode = (value: string) => onlyDigits(value).slice(0, 6)

/** True BR phone check: 10 (landline) or 11 (mobile) digits. */
export const isValidPhone = (value: string) => {
  const n = onlyDigits(value).length
  return n === 10 || n === 11
}

/** True CEP check: exactly 8 digits. */
export const isValidCep = (value: string) => onlyDigits(value).length === 8

/** Full CPF validation: 11 digits, not a repeated sequence, both check digits match. */
export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value)
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false

  const checkDigit = (length: number) => {
    let sum = 0
    for (let i = 0; i < length; i++) sum += Number(d[i]) * (length + 1 - i)
    const mod = (sum * 10) % 11
    return mod === 10 ? 0 : mod
  }

  return checkDigit(9) === Number(d[9]) && checkDigit(10) === Number(d[10])
}

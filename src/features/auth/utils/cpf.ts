/** CPF helpers: strip, progressively mask (000.000.000-00) and validate digits. */

export const onlyDigits = (value: string) => value.replace(/\D/g, '')

/** Format a partial CPF as the user types: 000.000.000-00 (capped at 11 digits). */
export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`
  return d
}

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

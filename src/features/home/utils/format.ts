/** pt-BR number: 2235 → "2.235", 8.4 → "8,4", 112 → "112". */
export function numberToBR(value: number): string {
  const [int, dec] = String(value).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return dec ? `${grouped},${dec}` : grouped
}

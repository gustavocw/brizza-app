import { isValidCpf, maskCpf, onlyDigits } from '../cpf'

describe('cpf utils', () => {
  it('strips non-digits', () => {
    expect(onlyDigits('529.982.247-25')).toBe('52998224725')
  })

  it('masks progressively as the user types', () => {
    expect(maskCpf('529')).toBe('529')
    expect(maskCpf('529982')).toBe('529.982')
    expect(maskCpf('529982247')).toBe('529.982.247')
    expect(maskCpf('52998224725')).toBe('529.982.247-25')
  })

  it('caps masking at 11 digits', () => {
    expect(maskCpf('5299822472599999')).toBe('529.982.247-25')
  })

  it('accepts a valid CPF (masked or raw)', () => {
    expect(isValidCpf('52998224725')).toBe(true)
    expect(isValidCpf('529.982.247-25')).toBe(true)
  })

  it('rejects wrong check digits, wrong length and repeated sequences', () => {
    expect(isValidCpf('529.982.247-24')).toBe(false)
    expect(isValidCpf('12345678900')).toBe(false)
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('529982247')).toBe(false)
  })
})

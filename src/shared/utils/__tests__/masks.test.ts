import { isValidCpf, maskCep, maskCpf, maskPhone, onlyDigits } from '../masks'

describe('masks', () => {
  it('strips non-digits', () => {
    expect(onlyDigits('529.982.247-25')).toBe('52998224725')
    expect(onlyDigits('(31) 99999-9999')).toBe('31999999999')
    expect(onlyDigits('30110-000')).toBe('30110000')
  })

  it('masks CPF progressively and caps at 11 digits', () => {
    expect(maskCpf('529')).toBe('529')
    expect(maskCpf('529982')).toBe('529.982')
    expect(maskCpf('529982247')).toBe('529.982.247')
    expect(maskCpf('52998224725')).toBe('529.982.247-25')
    expect(maskCpf('5299822472599999')).toBe('529.982.247-25')
  })

  it('masks phone for mobile (11) and landline (10)', () => {
    expect(maskPhone('31')).toBe('(31')
    expect(maskPhone('3199999')).toBe('(31) 9999-9')
    expect(maskPhone('31999999999')).toBe('(31) 99999-9999')
    expect(maskPhone('3133334444')).toBe('(31) 3333-4444')
    expect(maskPhone('319999999990000')).toBe('(31) 99999-9999')
  })

  it('masks CEP and caps at 8 digits', () => {
    expect(maskCep('301')).toBe('301')
    expect(maskCep('30110')).toBe('30110')
    expect(maskCep('30110000')).toBe('30110-000')
    expect(maskCep('301100009999')).toBe('30110-000')
  })

  it('validates CPF (masked or raw), rejecting bad check digits, length and repeats', () => {
    expect(isValidCpf('52998224725')).toBe(true)
    expect(isValidCpf('529.982.247-25')).toBe(true)
    expect(isValidCpf('529.982.247-24')).toBe(false)
    expect(isValidCpf('12345678900')).toBe(false)
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('529982247')).toBe(false)
  })
})

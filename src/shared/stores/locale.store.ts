import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zustandStorage } from './storage'

export type Locale = 'pt-BR' | 'en-US'

type LocaleState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

/** Active UI language. Drives useTexts(). Defaults to pt-BR; persists the choice. */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'pt-BR',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'locale-storage', storage: zustandStorage },
  ),
)

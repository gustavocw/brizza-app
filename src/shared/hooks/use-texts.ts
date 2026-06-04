import { useLocaleStore, type Locale } from '@/shared/stores/locale.store'

/**
 * Resolve a per-locale texts object to the active language.
 *
 *   import { commonTexts } from '@/shared/constants/texts'
 *   const t = useTexts(commonTexts)
 *   <Button label={t.actions.save} />
 *
 * Single-locale app? Skip this and import the texts object directly.
 */
export function useTexts<T>(byLocale: Record<Locale, T>): T {
  const locale = useLocaleStore((s) => s.locale)
  return byLocale[locale]
}

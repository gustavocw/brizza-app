import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { legalTitle, type LegalKind } from '../services/legal.dto'
import { useLegalQuery } from './use-legal-query'

/**
 * Legal viewer controller. Resolves the `kind` route param (defaults to privacy),
 * fetches the current document and exposes a header title + back handler.
 */
export function useLegal() {
  const nav = useNavigation()
  const { kind: raw } = useLocalSearchParams<{ kind: string }>()
  const kind: LegalKind = raw === 'terms' ? 'terms' : 'privacy'
  const query = useLegalQuery(kind)

  return { kind, query, title: legalTitle(kind), onBack: nav.back }
}

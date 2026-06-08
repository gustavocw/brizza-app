import { Linking } from 'react-native'
import Constants from 'expo-constants'
import { useToast } from '@/providers/toast/use-toast'
import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useMeQuery } from './use-me-query'
import { useSignOut } from './use-sign-out'
import { DeleteAccountSheet } from '../components/delete-account-sheet'

const SUPPORT_EMAIL = 'suporte@brizza.app'

/**
 * Profile controller. Owns the /user/me query and every account action. The view
 * paints the cached name/email instantly (from the auth store) and enriches with
 * the live profile when it lands. Privacy/terms open the API-served legal docs;
 * delete-account runs the Apple/LGPD-required flow in a confirmation sheet.
 */
export function useProfile() {
  const nav = useNavigation()
  const toast = useToast()
  const sheet = useBottomSheet()
  const storeUser = useAuthStore((s) => s.user)
  const query = useMeQuery()
  const signOut = useSignOut()

  const soon = () => toast.show({ message: 'Disponível em breve.', type: 'info' })

  return {
    query,
    profile: query.data,
    fallbackName: storeUser?.name ?? 'Piloto',
    fallbackEmail: storeUser?.email ?? '',
    onPersonalData: soon,
    onNotifications: () => nav.push(nav.routes.private.notificationSettings()),
    onChangePassword: () => nav.push(nav.routes.private.changePassword()),
    onPrivacy: () => nav.push(nav.routes.private.legal('privacy')),
    onTerms: () => nav.push(nav.routes.private.legal('terms')),
    onSupport: () => {
      Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(soon)
    },
    onSignOut: () => signOut.mutate(),
    isSigningOut: signOut.isPending,
    onDeleteAccount: () =>
      sheet.open({ snapToContent: true, children: ({ close }) => <DeleteAccountSheet onClose={close} /> }),
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
  }
}

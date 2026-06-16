import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useMeQuery } from './use-me-query'
import { useSignOut } from './use-sign-out'
import { useUpdatePhoto } from './use-update-photo'
import { DeleteAccountSheet } from '../components/delete-account-sheet'

/**
 * Profile controller. Owns the /user/me query and every account action. The view
 * paints the cached name/email instantly and enriches with the live profile. Each
 * menu item routes to its dedicated screen; delete runs in a confirmation sheet.
 */
export function useProfile() {
  const nav = useNavigation()
  const sheet = useBottomSheet()
  const storeUser = useAuthStore((s) => s.user)
  const query = useMeQuery()
  const signOut = useSignOut()
  const updatePhoto = useUpdatePhoto()

  const onChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled && result.assets[0]) updatePhoto.mutate(result.assets[0].uri)
  }

  return {
    query,
    profile: query.data,
    fallbackName: storeUser?.name ?? 'Piloto',
    fallbackEmail: storeUser?.email ?? '',
    onChangePhoto,
    uploadingPhoto: updatePhoto.isPending,
    onPersonalData: () => nav.push(nav.routes.private.editProfile()),
    onEmail: () => nav.push(nav.routes.private.changeContact('email')),
    onPhone: () => nav.push(nav.routes.private.changeContact('phone')),
    onVerifyEmail: () => nav.push(nav.routes.private.verify('email')),
    onVerifyPhone: () => nav.push(nav.routes.private.verify('phone')),
    onNotifications: () => nav.push(nav.routes.private.notificationSettings()),
    onChangePassword: () => nav.push(nav.routes.private.changePassword()),
    onSessions: () => nav.push(nav.routes.private.sessions()),
    onPrivacy: () => nav.push(nav.routes.private.legal('privacy')),
    onTerms: () => nav.push(nav.routes.private.legal('terms')),
    onExportData: () => nav.push(nav.routes.private.lgpdExport()),
    onSupport: () => nav.push(nav.routes.private.support()),
    onSignOut: () => signOut.mutate(),
    isSigningOut: signOut.isPending,
    onDeleteAccount: () =>
      sheet.open({ snapToContent: true, children: ({ close }) => <DeleteAccountSheet onClose={close} /> }),
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
  }
}

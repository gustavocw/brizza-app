import { type ReactNode } from 'react'
import { View } from 'react-native'
import { DocumentText, I24Support, LogoutCurve, ShieldTick, Trash, User } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { Button, Card, Divider, Paragraph } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { ProfileHeader } from './components/profile-header'
import { MenuRow } from './components/menu-row'
import { fullName } from './services/profile.dto'
import { useProfile } from './hooks/use-profile'

/** Grouped card with a mono section caption inside, above its rows. */
function Section({ label, delay, children }: { label: string; delay?: number; children: ReactNode }) {
  return (
    <Card delay={delay} className="rounded-3xl border-transparent px-4 pb-1 pt-4">
      <Paragraph
        appear={false}
        style={{ fontFamily: fontTheme.monoMedium }}
        className="px-1 pb-1 text-[11px] uppercase tracking-widest text-subtle"
      >
        {label}
      </Paragraph>
      {children}
    </Card>
  )
}

/**
 * Profile view — UI only. Data + handlers come from useProfile(). The hero paints
 * instantly from the cached session and enriches with /user/me; the account
 * actions (privacy, terms, sign out, delete) stay available even if the fetch
 * fails. Bottom padding clears the floating tab bar.
 */
export default function ProfileScreen() {
  const colors = useColors()
  const {
    profile,
    fallbackName,
    fallbackEmail,
    onPersonalData,
    onPrivacy,
    onTerms,
    onSupport,
    onSignOut,
    isSigningOut,
    onDeleteAccount,
    appVersion,
  } = useProfile()

  const name = fullName(profile) || fallbackName
  const email = profile?.email || fallbackEmail

  return (
    <Screen contentClassName="gap-5 px-4 pb-32 pt-1">
      <ProfileHeader name={name} email={email} photoUrl={profile?.photo_url} delay={40} />

      <Section label="Conta" delay={130}>
        <MenuRow icon={<User size={20} color={colors.primary} variant="Bold" />} label="Dados pessoais" sub="Nome e endereço" onPress={onPersonalData} />
        <Divider />
        <MenuRow tone="danger" icon={<Trash size={20} color={colors.error} variant="Bold" />} label="Excluir minha conta" onPress={onDeleteAccount} />
      </Section>

      <Section label="Privacidade e suporte" delay={170}>
        <MenuRow icon={<ShieldTick size={20} color={colors.primary} variant="Bold" />} label="Política de Privacidade" onPress={onPrivacy} />
        <Divider />
        <MenuRow icon={<DocumentText size={20} color={colors.primary} variant="Bold" />} label="Termos de Uso" onPress={onTerms} />
        <Divider />
        <MenuRow icon={<I24Support size={20} color={colors.primary} variant="Bold" />} label="Falar com o suporte" sub="suporte@brizza.app" onPress={onSupport} />
      </Section>

      <Button
        variant="outline"
        className="border-transparent bg-surface"
        iconContainerClassName="bg-error"
        label="Sair da conta"
        icon={
          <View style={{ transform: [{ scaleX: -1 }] }}>
            <LogoutCurve size={20} color={colors.onPrimary} variant="Linear" />
          </View>
        }
        isLoading={isSigningOut}
        onPress={onSignOut}
        delay={210}
      />

      <Paragraph appear={false} className="self-center text-xs text-subtle">
        Minas Brisa · versão {appVersion}
      </Paragraph>
    </Screen>
  )
}

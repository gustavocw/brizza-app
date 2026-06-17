import { Fragment, type ReactNode } from 'react'
import { View } from 'react-native'
import {
  Call,
  DocumentDownload,
  DocumentText,
  I24Support,
  Lock,
  LogoutCurve,
  MonitorMobbile,
  Notification,
  ShieldTick,
  Sms,
  Trash,
  User,
  Verify,
} from 'iconsax-react-nativejs'
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
 * Profile view — UI only. Data + handlers come from useProfile(). Hero paints
 * instantly from the cached session and enriches with /user/me; every row routes
 * to its own screen. Bottom padding clears the floating tab bar.
 */
export default function ProfileScreen() {
  const colors = useColors()
  const {
    profile,
    fallbackName,
    fallbackEmail,
    onChangePhoto,
    uploadingPhoto,
    onPersonalData,
    onEmail,
    onPhone,
    onVerifyEmail,
    onVerifyPhone,
    onNotifications,
    onChangePassword,
    onSessions,
    onPrivacy,
    onTerms,
    onExportData,
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
      <ProfileHeader name={name} email={email} photoUrl={profile?.photo_url} onChangePhoto={onChangePhoto} uploading={uploadingPhoto} delay={40} />

      <Section label="Conta" delay={120}>
        <MenuRow icon={<User size={20} color={colors.primary} variant="Bold" />} label="Dados pessoais" sub="Nome e endereço" onPress={onPersonalData} />
        <Divider />
        <MenuRow icon={<Sms size={20} color={colors.primary} variant="Bold" />} label="E-mail" sub={profile?.email} onPress={onEmail} />
        {profile && !profile.email_verified ? (
          <Fragment>
            <Divider />
            <MenuRow icon={<Verify size={20} color={colors.primary} variant="Bold" />} label="Verificar e-mail" sub="Confirme para liberar recursos" onPress={onVerifyEmail} />
          </Fragment>
        ) : null}
        <Divider />
        <MenuRow icon={<Call size={20} color={colors.primary} variant="Bold" />} label="Telefone" sub={profile?.phone} onPress={onPhone} />
        {profile && !profile.phone_verified ? (
          <Fragment>
            <Divider />
            <MenuRow icon={<Verify size={20} color={colors.primary} variant="Bold" />} label="Verificar telefone" sub="Confirme para liberar recursos" onPress={onVerifyPhone} />
          </Fragment>
        ) : null}
        <Divider />
        <MenuRow icon={<Notification size={20} color={colors.primary} variant="Bold" />} label="Notificações" sub="Preferências de alertas" onPress={onNotifications} />
      </Section>

      <Section label="Segurança" delay={160}>
        <MenuRow icon={<Lock size={20} color={colors.primary} variant="Bold" />} label="Alterar senha" sub="Atualize sua senha de acesso" onPress={onChangePassword} />
        <Divider />
        <MenuRow icon={<MonitorMobbile size={20} color={colors.primary} variant="Bold" />} label="Sessões ativas" sub="Aparelhos conectados" onPress={onSessions} />
        <Divider />
        <MenuRow tone="danger" icon={<Trash size={20} color={colors.error} variant="Bold" />} label="Excluir minha conta" onPress={onDeleteAccount} />
      </Section>

      <Section label="Privacidade e suporte" delay={200}>
        <MenuRow icon={<I24Support size={20} color={colors.primary} variant="Bold" />} label="Suporte" sub="Abra e acompanhe chamados" onPress={onSupport} />
        <Divider />
        <MenuRow icon={<ShieldTick size={20} color={colors.primary} variant="Bold" />} label="Política de Privacidade" onPress={onPrivacy} />
        <Divider />
        <MenuRow icon={<DocumentText size={20} color={colors.primary} variant="Bold" />} label="Termos de Uso" onPress={onTerms} />
        <Divider />
        <MenuRow icon={<DocumentDownload size={20} color={colors.primary} variant="Bold" />} label="Exportar meus dados" sub="Baixar uma cópia (LGPD)" onPress={onExportData} />
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
        delay={240}
      />

      <Paragraph appear={false} className="self-center text-xs text-subtle">
        Brizze · versão {appVersion}
      </Paragraph>
    </Screen>
  )
}

import { View } from 'react-native'
import { DocumentDownload, ShieldTick } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { BackButton, Button, Card, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { useLgpdExport } from './hooks/use-lgpd-export'

const INCLUDED = [
  'Cadastro, contato e endereço',
  'Preferências de notificação',
  'Histórico de aceite de termos',
  'Sessões e acessos recentes',
]

/** LGPD data export — UI only. Generates a JSON file and opens the share sheet. */
export default function LgpdExportScreen() {
  const colors = useColors()
  const { onExport, isExporting } = useLgpdExport()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={
        <Button
          label="Exportar meus dados"
          icon={<DocumentDownload size={20} color={colors.primary} variant="Bold" />}
          isLoading={isExporting}
          disabled={isExporting}
          onPress={onExport}
        />
      }
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Meus dados
        </Title>
      </View>

      <Card delay={40} className="gap-4 rounded-3xl border-transparent p-5">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primarySoft">
          <ShieldTick size={24} color={colors.primary} variant="Bold" />
        </View>
        <View className="gap-1.5">
          <Paragraph appear={false} className="text-lg font-semibold text-foreground">
            Baixe uma cópia dos seus dados
          </Paragraph>
          <Paragraph appear={false} className="text-sm leading-5 text-muted">
            Geramos um arquivo com tudo que guardamos sobre você (LGPD). Você escolhe onde salvar ou
            para quem enviar.
          </Paragraph>
        </View>

        <View className="gap-2 rounded-2xl bg-surfaceMuted p-4">
          {INCLUDED.map((item) => (
            <View key={item} className="flex-row items-center gap-2.5">
              <View className="h-1.5 w-1.5 rounded-full bg-primary" />
              <Paragraph appear={false} className="text-sm text-foreground">
                {item}
              </Paragraph>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  )
}

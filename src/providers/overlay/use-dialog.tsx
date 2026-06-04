import { useCallback, type ReactNode } from 'react'
import { View } from 'react-native'
import { useOverlay } from './use-overlay'
import { Dialog } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'

type DialogContent = ReactNode | ((api: { close: () => void }) => ReactNode)

export type ConfirmArgs = {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

/**
 * Dialogs on the stackable overlay host. confirm()/alert() always settle their
 * promise — even on backdrop tap or Android back (resolve false / void).
 *
 *   const dialog = useDialog()
 *   if (await dialog.confirm({ title: 'Excluir?', destructive: true })) remove()
 *   await dialog.alert({ title: 'Pronto' })
 *   dialog.open(({ close }) => <MyCustomDialog onDone={close} />)
 */
export function useDialog() {
  const overlay = useOverlay()

  const open = useCallback(
    (content: DialogContent, opts?: { dismissOnBackdrop?: boolean }) =>
      overlay.open(({ visible, close, remove }) => (
        <Dialog isOpen={visible} onClose={remove} dismissOnBackdrop={opts?.dismissOnBackdrop}>
          {typeof content === 'function' ? content({ close }) : content}
        </Dialog>
      )),
    [overlay],
  )

  const confirm = useCallback(
    (args: ConfirmArgs) =>
      new Promise<boolean>((resolve) => {
        // `result` is shared across re-renders; onClose settles it (false unless confirmed).
        let result = false
        overlay.open(({ visible, close, remove }) => (
          <Dialog
            isOpen={visible}
            onClose={() => {
              resolve(result)
              remove()
            }}
          >
            <View className="gap-3">
              <Title className="text-lg">{args.title}</Title>
              {args.message ? <Paragraph className="text-muted">{args.message}</Paragraph> : null}
              <View className="mt-2 flex-row gap-3">
                <View className="flex-1">
                  <Button
                    variant="secondary"
                    label={args.cancelText ?? 'Cancelar'}
                    onPress={() => {
                      result = false
                      close()
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    label={args.confirmText ?? 'Confirmar'}
                    className={args.destructive ? 'bg-error' : undefined}
                    onPress={() => {
                      result = true
                      close()
                    }}
                  />
                </View>
              </View>
            </View>
          </Dialog>
        ))
      }),
    [overlay],
  )

  const alert = useCallback(
    (args: { title: string; message?: string; okText?: string }) =>
      new Promise<void>((resolve) => {
        overlay.open(({ visible, close, remove }) => (
          <Dialog
            isOpen={visible}
            onClose={() => {
              resolve()
              remove()
            }}
          >
            <View className="gap-3">
              <Title className="text-lg">{args.title}</Title>
              {args.message ? <Paragraph className="text-muted">{args.message}</Paragraph> : null}
              <Button label={args.okText ?? 'OK'} onPress={close} />
            </View>
          </Dialog>
        ))
      }),
    [overlay],
  )

  return { open, confirm, alert, close: overlay.close, closeAll: overlay.closeAll }
}

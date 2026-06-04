import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { useOverlay } from './use-overlay'
import { BottomSheet, type BottomSheetProps } from '@/shared/components/ui/bottom-sheet'

/** Sheet body: a static node, or a render fn that receives `close` so it can dismiss itself. */
type SheetContent = ReactNode | ((api: { close: () => void }) => ReactNode)

export type OpenSheetParams = Omit<BottomSheetProps, 'isOpen' | 'onClose' | 'children'> & {
  children: SheetContent
}

/**
 * Open a bottom sheet from anywhere. Sheets STACK — open as many as you want;
 * each rides above the previous and over the keyboard.
 *
 *   const sheet = useBottomSheet()
 *   sheet.open({ children: <Menu /> })
 *   sheet.open({ children: ({ close }) => <Form onDone={close} />, snapToContent: true })
 *   sheet.closeTop()
 */
export function useBottomSheet() {
  const overlay = useOverlay()

  const open = useCallback(
    (params: OpenSheetParams) => {
      const { children, ...sheetProps } = params
      return overlay.open(({ visible, close, remove }) => (
        <BottomSheet isOpen={visible} onClose={remove} {...sheetProps}>
          {typeof children === 'function' ? children({ close }) : children}
        </BottomSheet>
      ))
    },
    [overlay],
  )

  return {
    open,
    close: overlay.close,
    closeTop: overlay.closeTop,
    closeAll: overlay.closeAll,
  }
}

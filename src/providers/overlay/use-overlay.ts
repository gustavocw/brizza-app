import { useContext } from 'react'
import { OverlayContext } from './overlay-context'

/**
 * Imperative access to the global overlay stack from anywhere in the app.
 *
 *   const overlay = useOverlay()
 *   const id = overlay.open(({ visible, close, remove }) => (
 *     <MyDialog isOpen={visible} onClose={remove} onConfirm={close} />
 *   ))
 *   overlay.close(id)   // dismiss this one
 *   overlay.closeAll()  // dismiss everything
 *
 * For bottom sheets specifically, prefer useBottomSheet() (thin wrapper on top).
 */
export function useOverlay() {
  const ctx = useContext(OverlayContext)
  if (!ctx) throw new Error('useOverlay must be used within <OverlayProvider>')
  return ctx
}

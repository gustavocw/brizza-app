import { useContext } from 'react'
import { ToastContext } from './toast-provider'

/**
 *   const toast = useToast()
 *   toast.show({ message: 'Saved', type: 'success' })
 *
 * Outside React (query client onError, services): import { showToast } from the provider.
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Toast, type ToastType } from '@/shared/components/ui/toast'

type ToastItem = { id: string; message: string; type: ToastType }

export type ShowToastArgs = { message: string; type?: ToastType; duration?: number }

export type ToastContextValue = {
  show: (args: ShowToastArgs) => string
  hide: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

// Module-level bridge so non-component code (e.g. the query client) can toast.
let externalShow: ((args: ShowToastArgs) => void) | null = null
export function showToast(args: ShowToastArgs) {
  externalShow?.(args)
}

/** Stacked, auto-dismissing, non-blocking toasts. Mount OUTSIDE the overlay host
 *  so toasts float above sheets/dialogs (see app-providers.tsx ordering). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const seqRef = useRef(0)
  const insets = useSafeAreaInsets()

  const hide = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])

  const show = useCallback(
    ({ message, type = 'info', duration = 4500 }: ShowToastArgs) => {
      const id = `toast_${++seqRef.current}`
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) setTimeout(() => hide(id), duration)
      return id
    },
    [hide],
  )

  useEffect(() => {
    externalShow = (args) => show(args)
    return () => {
      externalShow = null
    }
  }, [show])

  const value = useMemo<ToastContextValue>(() => ({ show, hide }), [show, hide])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 8 }]} className="items-center">
        <View pointerEvents="box-none" className="w-full max-w-[480px] gap-2 px-4">
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} type={t.type} onPress={() => hide(t.id)} />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  )
}

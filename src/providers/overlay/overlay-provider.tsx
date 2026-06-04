import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import {
  OverlayContext,
  type OverlayContextValue,
  type OverlayOptions,
  type OverlayRenderer,
} from './overlay-context'

type Entry = { id: string; render: OverlayRenderer; visible: boolean }

const DEFAULT_EXIT_MS = 600

/**
 * Single host for ALL stacked overlays (bottom sheets, dialogs, toasts…).
 *
 * Renders overlays as absolutely-positioned siblings ABOVE the app — NOT as RN
 * <Modal>s — so any number can stack at once (Modal stacking is unreliable on
 * Android). Each overlay owns its own backdrop + enter/exit animation.
 *
 * Mount it near the root, INSIDE SafeAreaProvider/QueryClientProvider but
 * wrapping the navigator (see app-providers.tsx).
 */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Entry[]>([])

  // Refs that survive re-renders without re-creating callbacks.
  const stackRef = useRef<Entry[]>(stack)
  stackRef.current = stack
  const seqRef = useRef(0)
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const exitMsRef = useRef(new Map<string, number>())

  const remove = useCallback((id: string) => {
    const t = timersRef.current.get(id)
    if (t) clearTimeout(t)
    timersRef.current.delete(id)
    exitMsRef.current.delete(id)
    setStack((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const close = useCallback(
    (id: string) => {
      setStack((prev) => prev.map((e) => (e.id === id ? { ...e, visible: false } : e)))
      // Safety net: if the overlay never calls remove() (e.g. no exit animation),
      // force-unmount after exitMs so nothing gets stuck on screen.
      if (!timersRef.current.has(id)) {
        const exitMs = exitMsRef.current.get(id) ?? DEFAULT_EXIT_MS
        timersRef.current.set(
          id,
          setTimeout(() => remove(id), exitMs),
        )
      }
    },
    [remove],
  )

  const open = useCallback((render: OverlayRenderer, options?: OverlayOptions) => {
    const id = `ovl_${++seqRef.current}`
    exitMsRef.current.set(id, options?.exitMs ?? DEFAULT_EXIT_MS)
    setStack((prev) => [...prev, { id, render, visible: true }])
    return id
  }, [])

  const closeTop = useCallback(() => {
    const top = [...stackRef.current].reverse().find((e) => e.visible)
    if (top) close(top.id)
  }, [close])

  const closeAll = useCallback(() => {
    stackRef.current.forEach((e) => e.visible && close(e.id))
  }, [close])

  const isOpen = useCallback(
    (id: string) => stackRef.current.some((e) => e.id === id && e.visible),
    [],
  )

  // Android hardware back closes the top overlay before navigating.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stackRef.current.some((e) => e.visible)) {
        closeTop()
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [closeTop])

  // Clear any pending timers on unmount.
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  const value = useMemo<OverlayContextValue>(
    () => ({ open, close, closeTop, closeAll, isOpen, stackSize: stack.length }),
    [open, close, closeTop, closeAll, isOpen, stack.length],
  )

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {stack.map((entry, index) => (
          <View
            key={entry.id}
            pointerEvents="box-none"
            style={[StyleSheet.absoluteFill, { zIndex: 1000 + index, elevation: 1000 + index }]}
          >
            {entry.render({
              id: entry.id,
              visible: entry.visible,
              close: () => close(entry.id),
              remove: () => remove(entry.id),
            })}
          </View>
        ))}
      </View>
    </OverlayContext.Provider>
  )
}

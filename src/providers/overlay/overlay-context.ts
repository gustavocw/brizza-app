import { createContext } from 'react'
import type { ReactNode } from 'react'

/** Handed to every overlay renderer so it can drive its own enter/exit. */
export type OverlayApi = {
  id: string
  /** True while shown; flips to false on dismiss so you can animate OUT before unmount. */
  visible: boolean
  /** Request dismissal: plays the exit animation, then unmounts. */
  close: () => void
  /** Unmount immediately. Call this when your exit animation finishes. */
  remove: () => void
}

export type OverlayRenderer = (api: OverlayApi) => ReactNode

export type OverlayOptions = {
  /** Max ms to wait for an exit animation before force-unmounting. Default 600. */
  exitMs?: number
}

export type OverlayContextValue = {
  /** Push an overlay onto the stack. Returns its id for later close(id). */
  open: (render: OverlayRenderer, options?: OverlayOptions) => string
  /** Dismiss a specific overlay by id. */
  close: (id: string) => void
  /** Dismiss the top-most overlay. */
  closeTop: () => void
  /** Dismiss every overlay. */
  closeAll: () => void
  /** Is this overlay currently visible? */
  isOpen: (id: string) => boolean
  /** How many overlays are on the stack. */
  stackSize: number
}

export const OverlayContext = createContext<OverlayContextValue | null>(null)

export type { ReactNode }

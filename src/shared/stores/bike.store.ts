import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zustandStorage } from './storage'

type BikeState = {
  /** The bike currently being viewed across the app (header, home, Motor). */
  selectedBikeId: string
  setSelectedBike: (id: string) => void
}

/**
 * Which bike the user is looking at. App-wide + persisted, so the header, home
 * dashboard and Motor screen all follow the same choice and it survives restarts.
 *
 *   const id = useBikeStore((s) => s.selectedBikeId)
 *   const select = useBikeStore((s) => s.setSelectedBike)
 */
export const useBikeStore = create<BikeState>()(
  persist(
    (set) => ({
      selectedBikeId: 'bike-1',
      setSelectedBike: (selectedBikeId) => set({ selectedBikeId }),
    }),
    {
      name: 'bike-storage',
      storage: zustandStorage,
      partialize: (s) => ({ selectedBikeId: s.selectedBikeId }),
    },
  ),
)

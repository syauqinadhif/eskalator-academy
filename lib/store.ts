import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  xp: number
  completed: string[]
  hintsUsed: Record<string, number>
  addXP: (amount: number) => void
  completeMission: (id: string) => void
  useHint: (missionId: string) => void
  reset: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      xp: 0,
      completed: [],
      hintsUsed: {},
      addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
      completeMission: (id) =>
        set((s) =>
          s.completed.includes(id) ? s : { completed: [...s.completed, id] }
        ),
      useHint: (missionId) =>
        set((s) => ({
          hintsUsed: {
            ...s.hintsUsed,
            [missionId]: (s.hintsUsed[missionId] ?? 0) + 1,
          },
        })),
      reset: () => set({ xp: 0, completed: [], hintsUsed: {} }),
    }),
    { name: 'esca_store' }
  )
)

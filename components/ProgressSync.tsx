'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase, supabaseReady } from '@/lib/supabase'
import { useAuthStore } from '@/lib/authStore'
import { useGameStore } from '@/lib/store'

export default function ProgressSync() {
  const user = useAuthStore((s) => s.user)
  const { xp, completed, hintsUsed, loadProgress } = useGameStore()
  const [synced, setSynced] = useState(false)
  const prevUserIdRef = useRef<string | null>(null)

  // On login: fetch remote progress and load it
  useEffect(() => {
    if (!supabaseReady) return

    const userId = user?.id ?? null

    if (!userId) {
      setSynced(false)
      prevUserIdRef.current = null
      return
    }

    // Avoid re-fetching for the same user
    if (prevUserIdRef.current === userId) return
    prevUserIdRef.current = userId
    setSynced(false)

    supabase
      .from('progress')
      .select('xp, completed, hints_used')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          loadProgress({
            xp: data.xp ?? 0,
            completed: data.completed ?? [],
            hintsUsed: data.hints_used ?? {},
          })
        }
        // Whether remote exists or not, mark as synced
        // (if no remote row, we'll create it on first mutation)
        setSynced(true)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // On progress change: push to Supabase
  useEffect(() => {
    if (!supabaseReady || !user?.id || !synced) return

    supabase.from('progress').upsert({
      user_id: user.id,
      xp,
      completed,
      hints_used: hintsUsed,
      updated_at: new Date().toISOString(),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, completed, hintsUsed, synced])

  return null
}

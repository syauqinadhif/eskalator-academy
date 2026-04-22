'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase, supabaseReady } from '@/lib/supabase'
import { useAuthStore } from '@/lib/authStore'
import { useGameStore } from '@/lib/store'

const PUBLIC_PATHS = ['/login', '/playground']

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { setUser, setLoading } = useAuthStore()
  const reset = useGameStore((s) => s.reset)

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (!session && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        router.push('/login')
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)

        if (event === 'SIGNED_OUT') {
          reset()
          router.push('/login')
        }

        if (event === 'SIGNED_IN' && pathname === '/login') {
          router.push('/')
        }

        if (!session && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}

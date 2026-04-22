'use client'

import { useEffect, useState } from 'react'
import { supabase, supabaseReady } from '@/lib/supabase'
import { useAuthStore } from '@/lib/authStore'

export default function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const [mounted, setMounted] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !supabaseReady) return null
  if (!user) return null

  const email = user.email ?? ''
  const shortEmail = email.length > 22 ? email.slice(0, 20) + '…' : email

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    setSigningOut(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#484f58] border border-[#30363d] px-2 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2dce89]" style={{ boxShadow: '0 0 4px #2dce89' }} />
        <span>{shortEmail}</span>
      </div>
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="font-mono text-[10px] tracking-wider border border-[#30363d] px-3 py-1 text-[#8b949e] hover:border-[#e55353] hover:text-[#e55353] transition-colors disabled:opacity-50"
      >
        {signingOut ? '…' : 'LOGOUT'}
      </button>
    </div>
  )
}

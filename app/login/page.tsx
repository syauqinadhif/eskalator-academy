'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, supabaseReady } from '@/lib/supabase'
import { useAuthStore } from '@/lib/authStore'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/')
  }, [user, router])

  // Ticker for monitor effect
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseReady) {
      setError('Supabase not configured. See SUPABASE-SETUP.md.')
      return
    }
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Account created. You can now log in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // AuthProvider will handle redirect
      }
    } catch (err: any) {
      const msg: string = err.message ?? 'Unknown error'
      if (msg.includes('Invalid login credentials')) {
        setError('Email atau password salah.')
      } else if (msg.includes('User already registered')) {
        setError('Email sudah terdaftar. Silakan login.')
      } else if (msg.includes('Password should be at least')) {
        setError('Password minimal 6 karakter.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* ambient glow */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #00e5cc 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* corner brackets */}
        <div className="absolute -top-5 -left-5 w-7 h-7 border-t-2 border-l-2 border-[#00e5cc] opacity-50" />
        <div className="absolute -top-5 -right-5 w-7 h-7 border-t-2 border-r-2 border-[#00e5cc] opacity-50" />
        <div className="absolute -bottom-5 -left-5 w-7 h-7 border-b-2 border-l-2 border-[#00e5cc] opacity-50" />
        <div className="absolute -bottom-5 -right-5 w-7 h-7 border-b-2 border-r-2 border-[#00e5cc] opacity-50" />

        {/* header */}
        <div className="text-center mb-8">
          <div className="font-mono text-[10px] tracking-[0.45em] text-[#484f58] uppercase mb-3">
            ICU Monitoring System
          </div>
          <div
            className="font-mono text-3xl font-bold tracking-[0.2em] text-[#00e5cc]"
            style={{ textShadow: '0 0 20px rgba(0,229,204,0.6), 0 0 40px rgba(0,229,204,0.3)' }}
          >
            ESKALATOR
          </div>
          <div className="font-mono text-[10px] tracking-[0.4em] text-[#30363d] mt-1">
            ACADEMY
          </div>
          <div className="font-mono text-[11px] text-[#8b949e] mt-3">
            {mode === 'login' ? 'PATIENT AUTHENTICATION' : 'REGISTER NEW OPERATOR'}
          </div>
        </div>

        {/* form card */}
        <div className="border border-[#30363d] bg-[#161b22]">
          {/* mode tabs */}
          <div className="flex border-b border-[#30363d]">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
              className={`flex-1 py-2.5 font-mono text-[10px] tracking-widest transition-colors ${
                mode === 'login'
                  ? 'text-[#00e5cc] bg-[#00e5cc]/5 border-b-2 border-[#00e5cc]'
                  : 'text-[#484f58] hover:text-[#8b949e]'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setSuccess(null) }}
              className={`flex-1 py-2.5 font-mono text-[10px] tracking-widest transition-colors ${
                mode === 'register'
                  ? 'text-[#00e5cc] bg-[#00e5cc]/5 border-b-2 border-[#00e5cc]'
                  : 'text-[#484f58] hover:text-[#8b949e]'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* sys ticker */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]/50 bg-[#0d1117]/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00e5cc] animate-teal-pulse" />
              <span className="font-mono text-[9px] text-[#484f58]">SECURE CHANNEL ACTIVE</span>
            </div>
            <span className="font-mono text-[9px] text-[#30363d]">
              SYS:{String(tick).padStart(4, '0')}
            </span>
          </div>

          {/* inputs */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block font-mono text-[9px] text-[#484f58] tracking-widest mb-1.5">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="operator@eskalator.id"
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#e6edf3] font-mono text-xs px-3 py-2.5 focus:outline-none focus:border-[#00e5cc] transition-colors placeholder-[#484f58]"
                style={{ caretColor: '#00e5cc' }}
              />
            </div>

            <div>
              <label className="block font-mono text-[9px] text-[#484f58] tracking-widest mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="w-full bg-[#0d1117] border border-[#30363d] text-[#e6edf3] font-mono text-xs px-3 py-2.5 focus:outline-none focus:border-[#00e5cc] transition-colors placeholder-[#484f58]"
                style={{ caretColor: '#00e5cc' }}
              />
              {mode === 'register' && (
                <p className="font-mono text-[9px] text-[#484f58] mt-1">Minimal 6 karakter</p>
              )}
            </div>

            {/* error / success */}
            {error && (
              <div className="border border-[#e55353]/40 bg-[#e55353]/8 px-3 py-2.5 font-mono text-[10px] text-[#e55353]">
                ✗ {error}
              </div>
            )}
            {success && (
              <div className="border border-[#2dce89]/40 bg-[#2dce89]/8 px-3 py-2.5 font-mono text-[10px] text-[#2dce89]">
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-mono text-xs tracking-widest font-semibold transition-all border mt-2 ${
                loading
                  ? 'border-[#30363d] text-[#484f58] cursor-not-allowed'
                  : 'border-[#00e5cc] text-[#00e5cc] hover:bg-[#00e5cc] hover:text-[#0d1117] active:scale-95'
              }`}
              style={loading ? {} : { boxShadow: '0 0 16px rgba(0,229,204,0.2)' }}
            >
              {loading
                ? '⟳ PROCESSING...'
                : mode === 'login'
                ? '▶ LOGIN'
                : '▶ CREATE ACCOUNT'}
            </button>
          </form>
        </div>

        <p className="font-mono text-[9px] text-[#30363d] text-center mt-6 tracking-wider">
          ESKALATOR ACADEMY · AUTHORIZED ACCESS ONLY
        </p>
      </div>
    </div>
  )
}

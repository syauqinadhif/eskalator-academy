'use client'

import { useEffect, useState } from 'react'

const BOOT_LINES = [
  { text: 'ESKALATOR SYSTEM v1.0.0', delay: 0, color: 'text-[#00e5cc]' },
  { text: 'Florence-2 VLM Runtime Layer........', delay: 200, color: 'text-[#8b949e]' },
  { text: 'Calibrating SpO₂ signal processors..', delay: 450, color: 'text-[#8b949e]' },
  { text: 'Mounting Python runtime engine.......', delay: 700, color: 'text-[#8b949e]' },
  { text: 'Loading ICU monitoring protocols.....', delay: 1000, color: 'text-[#8b949e]' },
]

interface SplashLoaderProps {
  progress?: number
  status?: string
}

export default function SplashLoader({ progress = 0, status = 'Initializing...' }: SplashLoaderProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay)
    })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80)
    return () => clearInterval(id)
  }, [])

  const barFilled = Math.round((progress / 100) * 20)
  const bar = '█'.repeat(barFilled) + '░'.repeat(20 - barFilled)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d1117] z-50">
      {/* ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00e5cc 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative font-mono w-full max-w-xl px-8">
        {/* header */}
        <div className="mb-8 text-center">
          <div className="text-[10px] tracking-[0.4em] text-[#8b949e] uppercase mb-2">
            ICU MONITORING SYSTEM
          </div>
          <div
            className="text-2xl font-bold tracking-widest text-[#00e5cc]"
            style={{ textShadow: '0 0 20px rgba(0,229,204,0.6), 0 0 40px rgba(0,229,204,0.3)' }}
          >
            ESKALATOR
          </div>
          <div className="text-[10px] tracking-[0.3em] text-[#30363d] uppercase mt-1">
            ACADEMY
          </div>
        </div>

        {/* boot log */}
        <div className="border border-[#30363d] bg-[#010409] rounded p-4 mb-6 min-h-[160px]">
          <div className="text-[10px] text-[#484f58] mb-3 flex justify-between">
            <span>BOOT LOG</span>
            <span>SYS:{String(tick).padStart(4, '0')}</span>
          </div>
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className={`text-[11px] leading-relaxed transition-opacity duration-200 ${
                visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'
              } ${line.color}`}
              style={{
                animation: visibleLines.includes(i)
                  ? 'boot-line 0.3s ease-out both'
                  : 'none',
              }}
            >
              <span className="text-[#484f58] mr-2">›</span>
              {line.text}
              {i === BOOT_LINES.length - 1 && visibleLines.includes(i) && progress < 100 && (
                <span className="animate-blink ml-1">_</span>
              )}
            </div>
          ))}
        </div>

        {/* progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-[#8b949e]">{status}</span>
            <span className="text-[#00e5cc]">{progress}%</span>
          </div>
          <div className="relative h-6 border border-[#30363d] bg-[#010409] overflow-hidden rounded-sm">
            <div
              className="absolute inset-y-0 left-0 bg-[#00e5cc] opacity-20 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center px-2">
              <span className="text-[11px] text-[#00e5cc] tracking-widest">
                [{bar}]
              </span>
            </div>
          </div>
        </div>

        {/* corner brackets */}
        <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-[#00e5cc] opacity-40" />
        <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-[#00e5cc] opacity-40" />
        <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-[#00e5cc] opacity-40" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-[#00e5cc] opacity-40" />
      </div>
    </div>
  )
}

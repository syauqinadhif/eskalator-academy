'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import SplashLoader from '@/components/SplashLoader'
import { CHAPTERS, ALL_MISSIONS } from '@/lib/missions'
import type { Mission } from '@/types/mission'

const PythonEditor = dynamic(
  () => import('@/components/PythonEditor'),
  {
    ssr: false,
    loading: () => <SplashLoader progress={0} status="Initializing Python runtime..." />,
  }
)

export default function PlaygroundPage() {
  const [selectedId, setSelectedId] = useState<string>('free')
  const [lastXP, setLastXP] = useState<number | null>(null)

  const mission: Mission | undefined = ALL_MISSIONS.find((m) => m.id === selectedId)

  function handleMissionComplete(hintsUsed: number) {
    const base = mission?.xp ?? 0
    const earned = Math.max(40, base - hintsUsed * 20)
    setLastXP(earned)
    setTimeout(() => setLastXP(null), 4000)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* top bar */}
      <header className="flex items-center gap-3 px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#00e5cc]" style={{ boxShadow: '0 0 8px #00e5cc' }} />
          <span className="font-mono text-sm font-bold tracking-[0.2em] text-[#00e5cc]"
            style={{ textShadow: '0 0 12px rgba(0,229,204,0.5)' }}>
            ESKALATOR
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#8b949e]">
            ACADEMY
          </span>
        </div>

        <div className="h-4 w-px bg-[#30363d] hidden sm:block" />

        {/* mission selector */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-mono text-[10px] text-[#484f58] tracking-wider shrink-0">MISSION:</span>
          <select
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setLastXP(null) }}
            className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] font-mono text-[11px] px-2 py-1 focus:outline-none focus:border-[#00e5cc] transition-colors flex-1 min-w-0 max-w-xs"
          >
            <option value="free">— Free Playground —</option>
            {CHAPTERS.filter(ch => ch.isBuilt).map(ch => (
              <optgroup key={ch.id} label={`${ch.id.toUpperCase()} · ${ch.title}`}>
                {ch.missions.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.id.toUpperCase()} · {m.title} ({m.xp} XP)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* XP flash */}
        {lastXP !== null && (
          <div className="font-mono text-xs text-[#2dce89] px-3 py-1 border border-[#2dce89]/40 bg-[#2dce89]/10 animate-fade-in">
            +{lastXP} XP
          </div>
        )}

        <a
          href="/"
          className="font-mono text-[10px] text-[#8b949e] hover:text-[#00e5cc] transition-colors tracking-wider ml-auto"
        >
          ← MAP
        </a>
      </header>

      {/* mission story strip */}
      {mission && (
        <div className="shrink-0 px-4 py-3 bg-[#161b22]/60 border-b border-[#30363d] flex items-start gap-3">
          <div className="font-mono text-[9px] text-[#00e5cc] tracking-[0.3em] pt-0.5 shrink-0">
            {mission.id.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-mono text-xs font-semibold text-[#e6edf3] mb-0.5">{mission.title}</div>
            <div className="font-sans text-[11px] text-[#8b949e] leading-relaxed line-clamp-2">
              {mission.story.split('\n')[0]}
            </div>
          </div>
          <div className="shrink-0 font-mono text-[10px] text-[#f5a623] ml-auto">
            {mission.xp} XP
          </div>
        </div>
      )}

      {/* editor */}
      <div className="flex-1 overflow-hidden">
        <PythonEditor
          mission={mission}
          onMissionComplete={handleMissionComplete}
          hintsUsed={0}
        />
      </div>
    </div>
  )
}

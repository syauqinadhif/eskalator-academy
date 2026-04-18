'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/store'
import { getLevel, getNextLevel, getLevelProgress } from '@/lib/xp'

export default function XPBar() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const xp = useGameStore((s) => s.xp)

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="font-mono text-[9px] text-[#484f58] tracking-wider">LEVEL 1 · ROOKIE DEV</div>
        <div className="w-32 h-1.5 bg-[#0d1117] border border-[#30363d]" />
        <div className="font-mono text-[10px] text-[#484f58]">0 XP</div>
      </div>
    )
  }

  const level = getLevel(xp)
  const next = getNextLevel(xp)
  const progress = getLevelProgress(xp)

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="font-mono text-[9px] text-[#484f58] tracking-wider whitespace-nowrap">
        LV{level.level} · {level.label.toUpperCase()}
      </div>
      <div className="relative w-28 h-1.5 bg-[#0d1117] border border-[#30363d] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#00e5cc] transition-all duration-700"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 6px rgba(0,229,204,0.6)',
          }}
        />
      </div>
      <div className="font-mono text-[10px] text-[#00e5cc]">
        {xp} XP
        {next && (
          <span className="text-[#484f58]"> / {next.minXP}</span>
        )}
      </div>
    </div>
  )
}

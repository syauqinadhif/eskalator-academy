'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store'
import { CHAPTERS } from '@/lib/missions'
import ChapterNode from '@/components/ChapterNode'
import XPBar from '@/components/XPBar'

export default function WorldMapPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const completed = useGameStore((s) => s.completed)
  const reset = useGameStore((s) => s.reset)

  useEffect(() => setMounted(true), [])

  const ch1Missions = CHAPTERS[0].missions.map((m) => m.id)
  const ch1Done = ch1Missions.every((id) => completed.includes(id))

  function isChapterUnlocked(chapterId: string) {
    if (chapterId === 'ch1') return true
    if (chapterId === 'ch2') return ch1Done
    return false
  }

  function completedCount(chapterId: string) {
    const ch = CHAPTERS.find((c) => c.id === chapterId)
    if (!ch) return 0
    return ch.missions.filter((m) => completed.includes(m.id)).length
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* nav */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-3 bg-[#0d1117]/90 backdrop-blur border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#00e5cc]" style={{ boxShadow: '0 0 8px #00e5cc' }} />
          <div>
            <div
              className="font-mono font-bold tracking-[0.25em] text-[#00e5cc] text-base leading-none"
              style={{ textShadow: '0 0 12px rgba(0,229,204,0.5)' }}
            >
              ESKALATOR
            </div>
            <div className="font-mono text-[9px] tracking-[0.35em] text-[#8b949e] leading-none mt-0.5">
              ACADEMY
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <XPBar />
          <a
            href="/playground"
            className="font-mono text-[10px] tracking-wider border border-[#30363d] px-3 py-1.5 text-[#8b949e] hover:border-[#00e5cc] hover:text-[#00e5cc] transition-colors hidden sm:block"
          >
            PLAYGROUND
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-10 max-w-5xl mx-auto w-full">
        {/* heading */}
        <div className="mb-10">
          <div className="font-mono text-[10px] text-[#484f58] tracking-[0.4em] uppercase mb-2">
            Florence-2 VLM · ICU Monitoring System
          </div>
          <h1 className="font-mono text-2xl sm:text-3xl font-bold text-[#e6edf3] tracking-tight">
            Mission Control
          </h1>
          <p className="font-sans text-[#8b949e] text-sm mt-2 max-w-lg">
            Complete missions to master Python and build the ESKALATOR system.
            Each chapter unlocks new patient monitoring capabilities.
          </p>
        </div>

        {/* chapter grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((ch) => (
            <ChapterNode
              key={ch.id}
              chapter={ch}
              completedCount={mounted ? completedCount(ch.id) : 0}
              isUnlocked={mounted ? isChapterUnlocked(ch.id) : ch.id === 'ch1'}
              onClick={() => router.push(`/chapter/${ch.id}`)}
            />
          ))}
        </div>

        {/* bottom strip */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#30363d]" />
          <div className="font-mono text-[9px] text-[#30363d] tracking-[0.4em]">
            ESKALATOR ACADEMY · v0.1
          </div>
          <div className="flex-1 h-px bg-[#30363d]" />
        </div>
      </main>

      {/* dev reset — hidden bottom corner */}
      {mounted && (
        <button
          onClick={() => { reset(); window.location.reload() }}
          className="fixed bottom-4 right-4 font-mono text-[9px] text-[#30363d] hover:text-[#484f58] transition-colors opacity-40 hover:opacity-100"
          title="Reset all progress"
        >
          RESET PROGRESS
        </button>
      )}
    </div>
  )
}

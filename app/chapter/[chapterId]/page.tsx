'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store'
import { getChapter } from '@/lib/missions'
import MissionCard from '@/components/MissionCard'
import XPBar from '@/components/XPBar'
import UserMenu from '@/components/UserMenu'

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const chapterId = params.chapterId as string

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const completed = useGameStore((s) => s.completed)
  const chapter = getChapter(chapterId)

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <div className="text-[#484f58] text-sm">Chapter not found.</div>
      </div>
    )
  }

  function getMissionStatus(index: number): 'completed' | 'available' | 'locked' {
    if (!mounted) return index === 0 ? 'available' : 'locked'
    const mission = chapter!.missions[index]
    if (completed.includes(mission.id)) return 'completed'
    if (index === 0) return 'available'
    const prev = chapter!.missions[index - 1]
    return completed.includes(prev.id) ? 'available' : 'locked'
  }

  const completedInChapter = chapter.missions.filter((m) => completed.includes(m.id)).length
  const isChapterComplete = completedInChapter === chapter.missions.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* nav */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 bg-[#0d1117]/90 backdrop-blur border-b border-[#30363d] flex-wrap">
        <button
          onClick={() => router.push('/')}
          className="font-mono text-[10px] text-[#8b949e] hover:text-[#00e5cc] transition-colors tracking-wider"
        >
          ← MAP
        </button>
        <div className="h-4 w-px bg-[#30363d]" />
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-[#00e5cc]" style={{ boxShadow: '0 0 6px #00e5cc' }} />
          <span
            className="font-mono text-sm font-bold tracking-[0.2em] text-[#00e5cc]"
            style={{ textShadow: '0 0 10px rgba(0,229,204,0.4)' }}
          >
            ESKALATOR
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <XPBar />
          <UserMenu />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full">
        {/* chapter header */}
        <div className="mb-8">
          <div className="font-mono text-[10px] text-[#484f58] tracking-[0.4em] mb-2">
            {chapterId.toUpperCase().replace('CH', 'CHAPTER ')}
          </div>
          <h1 className="font-mono text-2xl font-bold text-[#e6edf3] mb-1">
            {chapter.title}
          </h1>
          <p className="font-sans text-[#8b949e] text-sm max-w-lg">{chapter.storyBlurb}</p>

          {/* progress indicator */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-48 h-1.5 bg-[#0d1117] border border-[#30363d] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 transition-all duration-700"
                style={{
                  width: mounted ? `${(completedInChapter / chapter.missions.length) * 100}%` : '0%',
                  background: isChapterComplete ? '#2dce89' : '#00e5cc',
                  boxShadow: `0 0 6px ${isChapterComplete ? '#2dce89' : '#00e5cc'}`,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#8b949e]">
              {mounted ? completedInChapter : 0}/{chapter.missions.length} COMPLETE
            </span>
            {isChapterComplete && mounted && (
              <span className="font-mono text-[9px] text-[#2dce89] px-2 py-0.5 border border-[#2dce89]/40 bg-[#2dce89]/10">
                ✓ CHAPTER DONE
              </span>
            )}
          </div>
        </div>

        {/* mission list */}
        <div className="space-y-2">
          {chapter.missions.map((mission, i) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              status={getMissionStatus(i)}
              onClick={() => router.push(`/mission/${mission.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

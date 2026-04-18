'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useGameStore } from '@/lib/store'
import { getMission, CHAPTERS } from '@/lib/missions'
import { calcMissionXP } from '@/lib/xp'
import HintPanel from '@/components/HintPanel'
import XPBar from '@/components/XPBar'
import SplashLoader from '@/components/SplashLoader'

const PythonEditor = dynamic(
  () => import('@/components/PythonEditor'),
  { ssr: false, loading: () => <SplashLoader progress={0} status="Initializing Python runtime..." /> }
)

export default function MissionPage() {
  const params = useParams()
  const router = useRouter()
  const missionId = params.missionId as string

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const completed = useGameStore((s) => s.completed)
  const hintsUsedMap = useGameStore((s) => s.hintsUsed)
  const completeMission = useGameStore((s) => s.completeMission)
  const addXP = useGameStore((s) => s.addXP)
  const useHint = useGameStore((s) => s.useHint)

  const [xpFlash, setXpFlash] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const mission = getMission(missionId)

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="text-[#484f58] text-sm">Mission not found.</div>
          <button
            onClick={() => router.push('/')}
            className="text-[#00e5cc] text-xs hover:underline"
          >
            ← Back to map
          </button>
        </div>
      </div>
    )
  }

  const hintsUsed = mounted ? (hintsUsedMap[missionId] ?? 0) : 0
  const isCompleted = mounted ? completed.includes(missionId) : false

  // find next mission in sequence
  const chapter = CHAPTERS.find((c) => c.id === mission.chapterId)
  const missionIndex = chapter?.missions.findIndex((m) => m.id === missionId) ?? -1
  const nextMission = chapter?.missions[missionIndex + 1] ?? null

  function handleRevealHint() {
    if (hintsUsed >= 3 || isCompleted) return
    useHint(missionId)
  }

  function handleMissionComplete(hintsUsedNow: number) {
    if (completed.includes(missionId)) return
    const earned = calcMissionXP(mission!.xp, hintsUsedNow)
    completeMission(missionId)
    addXP(earned)
    setXpFlash(earned)
    setShowSuccess(true)
    setTimeout(() => setXpFlash(null), 4000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* nav */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 bg-[#0d1117]/90 backdrop-blur border-b border-[#30363d] shrink-0 flex-wrap">
        <button
          onClick={() => router.push(`/chapter/${mission.chapterId}`)}
          className="font-mono text-[10px] text-[#8b949e] hover:text-[#00e5cc] transition-colors tracking-wider"
        >
          ← {mission.chapterId.toUpperCase().replace('CH', 'CH-0')}
        </button>
        <div className="h-4 w-px bg-[#30363d]" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#00e5cc] tracking-[0.3em]">
            {missionId.toUpperCase()}
          </span>
          <span className="font-mono text-xs font-semibold text-[#e6edf3]">
            {mission.title}
          </span>
        </div>
        {isCompleted && mounted && (
          <span className="font-mono text-[9px] text-[#2dce89] px-2 py-0.5 border border-[#2dce89]/40 bg-[#2dce89]/10">
            ✓ COMPLETE
          </span>
        )}

        {/* XP flash */}
        {xpFlash !== null && (
          <div className="font-mono text-xs text-[#2dce89] px-3 py-1 border border-[#2dce89]/40 bg-[#2dce89]/10 animate-fade-in">
            +{xpFlash} XP
          </div>
        )}

        <div className="ml-auto">
          <XPBar />
        </div>
      </header>

      {/* body: left panel (story+hints) + right panel (editor) */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* LEFT: story + hints */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-[#30363d] flex flex-col overflow-y-auto">

          {/* story briefing */}
          <div className="p-5 border-b border-[#30363d]">
            <div className="font-mono text-[9px] text-[#00e5cc] tracking-[0.3em] mb-3">
              MISSION BRIEFING
            </div>
            <div className="font-sans text-[13px] text-[#e6edf3] leading-relaxed whitespace-pre-line">
              {mission.story}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-mono text-[9px] text-[#484f58]">BASE XP:</span>
              <span className="font-mono text-[10px] text-[#f5a623]">{mission.xp}</span>
            </div>
          </div>

          {/* hints */}
          <div className="p-5">
            <HintPanel
              hints={mission.hints}
              hintsUsed={hintsUsed}
              onRevealHint={handleRevealHint}
              missionCompleted={isCompleted}
            />
          </div>

          {/* next mission button (shown after completing) */}
          {showSuccess && (
            <div className="p-5 border-t border-[#30363d] mt-auto animate-slide-up">
              <div className="font-mono text-[10px] text-[#2dce89] tracking-wider mb-3">
                ✓ MISSION COMPLETE
              </div>
              {nextMission ? (
                <button
                  onClick={() => {
                    setShowSuccess(false)
                    router.push(`/mission/${nextMission.id}`)
                  }}
                  className="w-full py-2.5 font-mono text-xs tracking-widest border border-[#00e5cc] text-[#00e5cc] hover:bg-[#00e5cc] hover:text-[#0d1117] transition-all"
                  style={{ boxShadow: '0 0 12px rgba(0,229,204,0.15)' }}
                >
                  NEXT: {nextMission.title} →
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/chapter/${mission.chapterId}`)}
                  className="w-full py-2.5 font-mono text-xs tracking-widest border border-[#2dce89] text-[#2dce89] hover:bg-[#2dce89] hover:text-[#0d1117] transition-all"
                >
                  ← BACK TO CHAPTER
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Python editor (fills remaining space) */}
        <div className="flex-1 min-h-[500px] lg:min-h-0 overflow-hidden">
          <PythonEditor
            mission={mission}
            onMissionComplete={handleMissionComplete}
            hintsUsed={hintsUsed}
          />
        </div>
      </div>
    </div>
  )
}

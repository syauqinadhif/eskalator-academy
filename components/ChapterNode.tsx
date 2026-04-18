'use client'

import type { Chapter } from '@/types/mission'

interface ChapterNodeProps {
  chapter: Chapter
  completedCount: number
  isUnlocked: boolean
  onClick?: () => void
}

const SIGNAL: Record<string, number[]> = {
  ch1: [0.3, 0.9, 0.4, 1.0, 0.5, 0.7, 0.3, 0.8, 0.6, 0.4],
  ch2: [0.5, 0.3, 0.8, 0.4, 1.0, 0.3, 0.6, 0.9, 0.4, 0.7],
  ch3: [0.4, 0.7, 0.3, 1.0, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4],
  ch4: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
  ch5: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
}

export default function ChapterNode({ chapter, completedCount, isUnlocked, onClick }: ChapterNodeProps) {
  const signal = SIGNAL[chapter.id] ?? SIGNAL.ch3
  const total = chapter.missions.length
  const isComplete = total > 0 && completedCount >= total
  const isSoon = !chapter.isBuilt

  const borderColor = isSoon
    ? '#30363d'
    : isUnlocked
    ? isComplete
      ? '#2dce89'
      : '#00e5cc'
    : '#f5a623'

  const labelColor = isSoon ? '#484f58' : isUnlocked ? (isComplete ? '#2dce89' : '#00e5cc') : '#f5a623'

  const statusLabel = isSoon
    ? 'SOON'
    : isUnlocked
    ? isComplete
      ? 'COMPLETE'
      : 'ACTIVE'
    : 'LOCKED'

  const Tag = isUnlocked && !isSoon ? 'button' : 'div'

  return (
    <Tag
      onClick={isUnlocked && !isSoon ? onClick : undefined}
      className={`relative flex flex-col bg-[#161b22] border p-5 transition-all duration-200 text-left w-full ${
        isUnlocked && !isSoon
          ? 'cursor-pointer group hover:bg-[#1c2128]'
          : 'cursor-default'
      } ${isSoon ? 'opacity-35' : isUnlocked ? '' : 'opacity-60'}`}
      style={{
        borderColor,
        boxShadow: isUnlocked && !isSoon && !isComplete
          ? `0 0 20px ${borderColor}18`
          : undefined,
      }}
    >
      {/* chapter label + status */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div
            className="font-mono text-[10px] tracking-[0.3em] mb-1"
            style={{ color: labelColor }}
          >
            {chapter.id.toUpperCase().replace('CH', 'CH-0').replace('CH-010', 'CH-10')}
          </div>
          <div className="font-mono text-xs font-semibold text-[#e6edf3] leading-snug">
            {chapter.title}
          </div>
          <div className="font-mono text-[9px] text-[#484f58] mt-0.5 tracking-wider">
            {chapter.subtitle.toUpperCase()}
          </div>
        </div>
        <div
          className="font-mono text-[9px] px-2 py-0.5 border shrink-0 ml-2"
          style={{ color: labelColor, borderColor: `${borderColor}66`, background: `${borderColor}11` }}
        >
          {statusLabel}
        </div>
      </div>

      {/* ECG signal bars */}
      <div className="flex items-end gap-px h-8 mb-4">
        {signal.map((v, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-300"
            style={{
              height: `${v * 100}%`,
              background: isSoon
                ? `rgba(48,54,61,0.4)`
                : isUnlocked
                ? isComplete
                  ? `rgba(45,206,137,${0.25 + v * 0.55})`
                  : `rgba(0,229,204,${0.25 + v * 0.55})`
                : `rgba(245,166,35,${0.2 + v * 0.3})`,
            }}
          />
        ))}
      </div>

      {/* stats row */}
      <div className="flex items-center justify-between mt-auto">
        <div className="font-mono text-[10px] text-[#8b949e]">
          {total > 0 ? (
            isUnlocked
              ? `${completedCount}/${total} DONE`
              : `${total} MISSIONS`
          ) : (
            '— MISSIONS'
          )}
        </div>
        {total > 0 && (
          <div className="font-mono text-[10px]" style={{ color: labelColor }}>
            {chapter.missions.reduce((s, m) => s + m.xp, 0)} XP
          </div>
        )}
      </div>

      {/* progress bar strip (active chapters) */}
      {isUnlocked && total > 0 && (
        <div className="mt-3 h-0.5 bg-[#0d1117] overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${(completedCount / total) * 100}%`,
              background: isComplete ? '#2dce89' : '#00e5cc',
              boxShadow: `0 0 6px ${isComplete ? '#2dce89' : '#00e5cc'}`,
            }}
          />
        </div>
      )}

      {/* corner accents */}
      {isUnlocked && !isSoon && (
        <>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l" style={{ borderColor }} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r" style={{ borderColor }} />
        </>
      )}

      {/* hover arrow */}
      {isUnlocked && !isSoon && (
        <div
          className="absolute top-1/2 -translate-y-1/2 right-4 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: labelColor }}
        >
          ›
        </div>
      )}
    </Tag>
  )
}

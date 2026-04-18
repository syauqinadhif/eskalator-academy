'use client'

import type { Mission } from '@/types/mission'

type MissionStatus = 'completed' | 'available' | 'locked'

interface MissionCardProps {
  mission: Mission
  status: MissionStatus
  onClick?: () => void
}

const STATUS_CONFIG = {
  completed: {
    border: '#2dce89',
    label: 'COMPLETE',
    labelBg: 'rgba(45,206,137,0.08)',
    text: '#2dce89',
    icon: '✓',
  },
  available: {
    border: '#00e5cc',
    label: 'AVAILABLE',
    labelBg: 'rgba(0,229,204,0.08)',
    text: '#00e5cc',
    icon: '›',
  },
  locked: {
    border: '#30363d',
    label: 'LOCKED',
    labelBg: 'rgba(48,54,61,0.3)',
    text: '#484f58',
    icon: '—',
  },
}

export default function MissionCard({ mission, status, onClick }: MissionCardProps) {
  const cfg = STATUS_CONFIG[status]
  const isClickable = status !== 'locked'

  const Tag = isClickable ? 'button' : 'div'

  return (
    <Tag
      onClick={isClickable ? onClick : undefined}
      className={`relative flex items-center gap-4 w-full bg-[#161b22] border px-4 py-3.5 transition-all duration-150 text-left ${
        isClickable
          ? 'cursor-pointer hover:bg-[#1c2128] group'
          : 'cursor-default opacity-50'
      }`}
      style={{
        borderColor: cfg.border,
        boxShadow: status === 'available' ? `0 0 14px rgba(0,229,204,0.07)` : undefined,
      }}
    >
      {/* status icon */}
      <div
        className="font-mono text-base w-5 text-center shrink-0"
        style={{ color: cfg.text }}
      >
        {cfg.icon}
      </div>

      {/* mission info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: cfg.text }}>
            {mission.id.toUpperCase()}
          </span>
          <span className="font-mono text-xs font-semibold text-[#e6edf3] truncate">
            {mission.title}
          </span>
        </div>
        <div className="font-sans text-[11px] text-[#8b949e] line-clamp-1">
          {mission.story.split('\n')[0].slice(0, 80)}…
        </div>
      </div>

      {/* XP badge */}
      <div
        className="font-mono text-[10px] shrink-0 px-2 py-0.5 border"
        style={{ color: cfg.text, borderColor: `${cfg.border}55`, background: cfg.labelBg }}
      >
        {mission.xp} XP
      </div>

      {/* status badge */}
      <div
        className="font-mono text-[9px] shrink-0 px-2 py-0.5 border"
        style={{ color: cfg.text, borderColor: `${cfg.border}55`, background: cfg.labelBg }}
      >
        {cfg.label}
      </div>

      {/* hover arrow */}
      {isClickable && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: cfg.text }}
        >
          →
        </div>
      )}
    </Tag>
  )
}

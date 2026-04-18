'use client'

interface HintPanelProps {
  hints: [string, string, string]
  hintsUsed: number
  onRevealHint: () => void
  missionCompleted?: boolean
}

export default function HintPanel({ hints, hintsUsed, onRevealHint, missionCompleted }: HintPanelProps) {
  const maxHints = 3
  const canReveal = hintsUsed < maxHints && !missionCompleted

  return (
    <div className="border border-[#30363d] bg-[#0d1117]">
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d]">
        <div className="font-mono text-[9px] text-[#484f58] tracking-[0.3em]">HINTS</div>
        <div className="font-mono text-[9px] text-[#484f58]">
          {hintsUsed}/{maxHints} USED
        </div>
      </div>

      {/* revealed hints */}
      {hintsUsed > 0 ? (
        <div className="divide-y divide-[#30363d]/50">
          {hints.slice(0, hintsUsed).map((hint, i) => (
            <div key={i} className="flex gap-2.5 px-3 py-2.5">
              <span className="font-mono text-[9px] text-[#f5a623] mt-0.5 shrink-0">
                {i + 1}
              </span>
              <p className="font-sans text-[11px] text-[#8b949e] leading-relaxed whitespace-pre-wrap">
                {hint}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-3 py-2.5">
          <p className="font-sans text-[11px] text-[#30363d]">No hints revealed yet.</p>
        </div>
      )}

      {/* reveal button */}
      {canReveal && (
        <div className="px-3 py-2.5 border-t border-[#30363d]">
          <button
            onClick={onRevealHint}
            className="w-full py-2 font-mono text-[10px] tracking-wider border border-[#f5a623]/40 text-[#f5a623] hover:bg-[#f5a623]/10 transition-colors"
          >
            REVEAL HINT {hintsUsed + 1} (−20 XP)
          </button>
        </div>
      )}

      {hintsUsed >= maxHints && (
        <div className="px-3 py-2.5 border-t border-[#30363d]">
          <p className="font-mono text-[9px] text-[#484f58] tracking-wider text-center">
            ALL HINTS REVEALED
          </p>
        </div>
      )}
    </div>
  )
}

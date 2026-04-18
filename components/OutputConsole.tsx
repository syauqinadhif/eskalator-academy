'use client'

import type { TestResult } from '@/types/mission'

interface OutputLine {
  type: 'stdout' | 'stderr' | 'error' | 'info'
  text: string
}

interface OutputConsoleProps {
  output: OutputLine[]
  testResults: TestResult[] | null
  onClear: () => void
}

export type { OutputLine }

export default function OutputConsole({ output, testResults, onClear }: OutputConsoleProps) {
  const allPassed = testResults !== null && testResults.every((r) => r.passed)
  const anyFailed = testResults !== null && testResults.some((r) => !r.passed)

  return (
    <div className="flex flex-col h-full">
      {/* panel header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#010409] border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#484f58] text-[10px] tracking-wider">OUTPUT</span>
          {testResults !== null && (
            <span
              className={`text-[9px] px-1.5 py-0.5 font-mono tracking-wider ${
                allPassed
                  ? 'text-[#2dce89] bg-[#2dce89]/10 border border-[#2dce89]/30'
                  : 'text-[#e55353] bg-[#e55353]/10 border border-[#e55353]/30'
              }`}
            >
              {allPassed ? '✓ ALL PASS' : '✗ FAILED'}
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          className="text-[#484f58] text-[10px] hover:text-[#8b949e] transition-colors"
        >
          CLEAR
        </button>
      </div>

      {/* stdout / error output */}
      <div className="flex-1 bg-[#010409] p-3 overflow-y-auto text-xs leading-relaxed min-h-0 font-mono">
        {output.length === 0 && testResults === null ? (
          <div className="text-[#30363d] select-none space-y-0.5">
            <div>{'>'} No output yet.</div>
            <div>{'>'} Press RUN (Ctrl+Enter) or SUBMIT (Ctrl+Shift+Enter).</div>
          </div>
        ) : (
          output.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'stdout'
                  ? 'text-[#e6edf3]'
                  : line.type === 'stderr'
                  ? 'text-[#f5a623]'
                  : line.type === 'error'
                  ? 'text-[#e55353] whitespace-pre-wrap'
                  : 'text-[#484f58]'
              }
            >
              {line.text}
            </div>
          ))
        )}
      </div>

      {/* test results panel */}
      {testResults !== null && testResults.length > 0 && (
        <div className="border-t border-[#30363d] bg-[#0d1117] shrink-0">
          <div className="px-3 py-2 border-b border-[#30363d]">
            <span className="font-mono text-[9px] text-[#484f58] tracking-[0.3em]">TEST RESULTS</span>
          </div>
          <div className="divide-y divide-[#30363d]/50">
            {testResults.map((result, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-3 py-2 ${
                  result.passed ? 'bg-[#2dce89]/5' : 'bg-[#e55353]/5'
                }`}
              >
                <span
                  className={`font-mono text-xs mt-0.5 shrink-0 ${
                    result.passed ? 'text-[#2dce89]' : 'text-[#e55353]'
                  }`}
                >
                  {result.passed ? '✓' : '✗'}
                </span>
                <div className="min-w-0">
                  <div
                    className={`font-mono text-xs ${
                      result.passed ? 'text-[#2dce89]' : 'text-[#e55353]'
                    }`}
                  >
                    {result.label}
                  </div>
                  {result.error && (
                    <div className="font-mono text-[10px] text-[#8b949e] mt-0.5 whitespace-pre-wrap">
                      {result.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* summary footer */}
          <div
            className={`px-3 py-2 font-mono text-[10px] tracking-wider text-center border-t border-[#30363d] ${
              allPassed ? 'text-[#2dce89]' : anyFailed ? 'text-[#e55353]' : 'text-[#8b949e]'
            }`}
          >
            {allPassed
              ? `✓ MISSION COMPLETE — ${testResults.length}/${testResults.length} TESTS PASSED`
              : `✗ ${testResults.filter((r) => r.passed).length}/${testResults.length} TESTS PASSED`}
          </div>
        </div>
      )}
    </div>
  )
}

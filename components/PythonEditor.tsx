'use client'

import { useEffect, useRef, useState } from 'react'
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  highlightSpecialChars,
  keymap,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import {
  indentOnInput,
  bracketMatching,
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { getPyodide } from '@/lib/pyodide'
import SplashLoader from '@/components/SplashLoader'
import OutputConsole, { type OutputLine } from '@/components/OutputConsole'
import type { Mission, TestResult } from '@/types/mission'

interface PythonEditorProps {
  mission?: Mission
  onMissionComplete?: (hintsUsed: number) => void
  hintsUsed?: number
}

async function resetNamespace(pyodide: any) {
  await pyodide.runPythonAsync(`
import sys
_keep = {'__name__', '__doc__', '__package__', '__loader__', '__spec__', '__builtins__'}
for k in list(globals().keys()):
    if k not in _keep:
        del globals()[k]
  `)
}

async function runWithTimeout(pyodide: any, code: string): Promise<void> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Execution timed out (5s)')), 5000)
  )
  await Promise.race([pyodide.runPythonAsync(code), timeout])
}

async function submitMission(pyodide: any, userCode: string, mission: Mission): Promise<TestResult[]> {
  await resetNamespace(pyodide)
  await runWithTimeout(pyodide, userCode)
  const results: TestResult[] = []
  for (const test of mission.tests) {
    try {
      await pyodide.runPythonAsync(test.code)
      results.push({ label: test.label, passed: true })
    } catch (err: any) {
      const raw = err.message ?? String(err)
      const safeError = raw.split('AssertionError:')[0].trim().split('\n').slice(-3).join('\n')
      results.push({ label: test.label, passed: false, error: safeError })
    }
  }
  return results
}

export default function PythonEditor({ mission, onMissionComplete, hintsUsed = 0 }: PythonEditorProps) {
  const [pyodide, setPyodide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadStatus, setLoadStatus] = useState('Initializing Python runtime...')
  const [loadError, setLoadError] = useState<string | null>(null)

  const [output, setOutput] = useState<OutputLine[]>([])
  const [testResults, setTestResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const editorContainerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const pyodideRef = useRef<any>(null)
  const runningRef = useRef(false)

  const defaultCode = mission?.starterCode ?? '# ESKALATOR Academy\n\nprint("Hello, ESKALATOR!")\n'

  // boot Pyodide
  useEffect(() => {
    const progressSteps = [
      { p: 15, s: 'Fetching Pyodide WASM...', t: 200 },
      { p: 35, s: 'Compiling WebAssembly...', t: 800 },
      { p: 60, s: 'Loading Python stdlib...', t: 1600 },
      { p: 80, s: 'Mounting runtime hooks...', t: 2200 },
    ]
    const timers = progressSteps.map(({ p, s, t }) =>
      setTimeout(() => { setLoadProgress(p); setLoadStatus(s) }, t)
    )
    getPyodide()
      .then((py) => {
        pyodideRef.current = py
        setLoadProgress(100)
        setLoadStatus('Runtime ready.')
        setTimeout(() => { setPyodide(py); setLoading(false) }, 400)
      })
      .catch((err) => {
        setLoadError(err.message ?? 'Failed to load Python runtime.')
        setLoading(false)
      })
    return () => timers.forEach(clearTimeout)
  }, [])

  // mount CodeMirror once Pyodide is loaded
  useEffect(() => {
    if (!editorContainerRef.current || viewRef.current || loading) return

    const view = new EditorView({
      state: EditorState.create({
        doc: defaultCode,
        extensions: [
          // editor features
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          highlightActiveLine(),
          drawSelection(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          // keymaps
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab,
          ]),
          // language + theme
          python(),
          oneDark,
          EditorView.theme({
            '&': { height: '100%', background: '#010409' },
            '.cm-scroller': { overflow: 'auto' },
            '.cm-content': { caretColor: '#00e5cc', padding: '12px 0' },
            '.cm-line': { padding: '0 12px' },
          }),
        ],
      }),
      parent: editorContainerRef.current,
    })

    viewRef.current = view
    return () => { view.destroy(); viewRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  // update editor content when mission changes
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const newCode = mission?.starterCode ?? defaultCode
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newCode },
    })
    setOutput([])
    setTestResults(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission?.id])

  // stdout / stderr listeners
  useEffect(() => {
    const onStdout = (e: Event) => {
      const text = (e as CustomEvent<string>).detail
      setOutput(prev => [...prev, { type: 'stdout', text }])
    }
    const onStderr = (e: Event) => {
      const text = (e as CustomEvent<string>).detail
      setOutput(prev => [...prev, { type: 'stderr', text }])
    }
    window.addEventListener('pyodide-stdout', onStdout)
    window.addEventListener('pyodide-stderr', onStderr)
    return () => {
      window.removeEventListener('pyodide-stdout', onStdout)
      window.removeEventListener('pyodide-stderr', onStderr)
    }
  }, [])

  function getCode() {
    return viewRef.current?.state.doc.toString() ?? ''
  }

  async function handleRun() {
    const py = pyodideRef.current
    if (!py || runningRef.current) return
    const code = getCode()
    if (!code.trim()) { setOutput([{ type: 'info', text: '⚠ Write some code first.' }]); return }
    runningRef.current = true
    setRunning(true)
    setTestResults(null)
    setOutput([{ type: 'info', text: '▶ Running...' }])
    try {
      await resetNamespace(py)
      await runWithTimeout(py, code)
      setOutput(prev => [...prev, { type: 'info', text: '✓ Done.' }])
    } catch (err: any) {
      const msg = err.message ?? String(err)
      setOutput(prev => [...prev, { type: 'error', text: msg.split('\n').slice(-4).join('\n') }])
    } finally {
      runningRef.current = false
      setRunning(false)
    }
  }

  async function handleSubmit() {
    const py = pyodideRef.current
    if (!py || runningRef.current || !mission) return
    const code = getCode()
    if (!code.trim()) { setOutput([{ type: 'info', text: '⚠ Write some code first.' }]); return }
    runningRef.current = true
    setSubmitting(true)
    setTestResults(null)
    setOutput([{ type: 'info', text: '▶ Running tests...' }])
    try {
      const results = await submitMission(py, code, mission)
      setOutput(prev => [...prev, { type: 'info', text: '✓ Tests complete.' }])
      setTestResults(results)
      if (results.every((r) => r.passed) && onMissionComplete) {
        onMissionComplete(hintsUsed)
      }
    } catch (err: any) {
      const msg = err.message ?? String(err)
      setOutput(prev => [...prev, { type: 'error', text: msg.split('\n').slice(-4).join('\n') }])
    } finally {
      runningRef.current = false
      setSubmitting(false)
    }
  }

  // stable refs so keymap callbacks always call the latest version
  const handleRunRef = useRef(handleRun)
  const handleSubmitRef = useRef(handleSubmit)
  useEffect(() => { handleRunRef.current = handleRun }, [handleRun])
  useEffect(() => { handleSubmitRef.current = handleSubmit }, [handleSubmit])

  if (loading) return <SplashLoader progress={loadProgress} status={loadStatus} />

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d1117] font-mono">
        <div className="border border-[#e55353] bg-[#161b22] p-8 max-w-md text-center space-y-4">
          <div className="text-[#e55353] text-sm tracking-wider">RUNTIME ERROR</div>
          <div className="text-[#8b949e] text-xs">{loadError}</div>
          <button
            onClick={() => window.location.reload()}
            className="border border-[#e55353] text-[#e55353] text-xs px-4 py-2 hover:bg-[#e55353] hover:text-[#0d1117] transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    )
  }

  const busy = running || submitting

  return (
    <div className="flex flex-col h-full bg-[#0d1117] font-mono text-sm">
      {/* runtime status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00e5cc] animate-teal-pulse" />
          <span className="text-[#00e5cc] text-xs tracking-widest">PYTHON RUNTIME</span>
          <span className="text-[#484f58] text-xs">v3.11 · Pyodide 0.27</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-[#484f58]">
          <span>⌃↵ RUN</span>
          {mission && <span>⌃⇧↵ SUBMIT</span>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* CodeMirror editor */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 border-r border-[#30363d]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#010409] border-b border-[#30363d] shrink-0">
            <span className="text-[#484f58] text-[10px] tracking-wider">EDITOR</span>
            <span className="text-[#484f58] text-[10px]">{mission ? `${mission.id}.py` : 'main.py'}</span>
          </div>
          <div
          ref={editorContainerRef}
          className="flex-1 overflow-hidden"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
              e.preventDefault()
              handleSubmitRef.current?.()
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault()
              handleRunRef.current?.()
            }
          }}
        />
        </div>

        {/* output + buttons */}
        <div className="flex flex-col w-full lg:w-80 xl:w-96 min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden">
            <OutputConsole
              output={output}
              testResults={testResults}
              onClear={() => { setOutput([]); setTestResults(null) }}
            />
          </div>

          <div className="shrink-0 p-3 border-t border-[#30363d] bg-[#161b22] space-y-2">
            <button
              onClick={handleRun}
              disabled={busy}
              className={`w-full py-2.5 text-xs tracking-widest font-semibold transition-all duration-200 border ${
                busy
                  ? 'border-[#30363d] text-[#484f58] cursor-not-allowed'
                  : 'border-[#00e5cc] text-[#00e5cc] hover:bg-[#00e5cc] hover:text-[#0d1117] active:scale-95'
              }`}
              style={busy ? {} : { boxShadow: '0 0 12px rgba(0,229,204,0.15)' }}
            >
              {running ? '▶ RUNNING...' : '▶ RUN'}
            </button>

            {mission && (
              <button
                onClick={handleSubmit}
                disabled={busy}
                className={`w-full py-2.5 text-xs tracking-widest font-semibold transition-all duration-200 border ${
                  busy
                    ? 'border-[#30363d] text-[#484f58] cursor-not-allowed'
                    : 'border-[#2dce89] text-[#2dce89] hover:bg-[#2dce89] hover:text-[#0d1117] active:scale-95'
                }`}
                style={busy ? {} : { boxShadow: '0 0 12px rgba(45,206,137,0.15)' }}
              >
                {submitting ? '⟳ TESTING...' : '✓ SUBMIT'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

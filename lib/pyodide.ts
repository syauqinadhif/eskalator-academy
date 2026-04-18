let pyodideInstance: any = null
let loadingPromise: Promise<any> | null = null

declare global {
  interface Window {
    loadPyodide: (config?: any) => Promise<any>
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

export async function getPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    await loadScript('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js')

    const instance = await window.loadPyodide()

    instance.setStdout({
      batched: (s: string) => {
        window.dispatchEvent(new CustomEvent('pyodide-stdout', { detail: s }))
      },
    })

    instance.setStderr({
      batched: (s: string) => {
        window.dispatchEvent(new CustomEvent('pyodide-stderr', { detail: s }))
      },
    })

    pyodideInstance = instance
    return instance
  })()

  return loadingPromise
}

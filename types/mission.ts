export interface TestCase {
  code: string
  label: string
}

export interface Mission {
  id: string
  chapterId: string
  title: string
  xp: number
  story: string
  starterCode: string
  tests: TestCase[]
  hints: [string, string, string]
}

export interface Chapter {
  id: string
  title: string
  subtitle: string
  storyBlurb: string
  missions: Mission[]
  isBuilt: boolean
}

export interface TestResult {
  label: string
  passed: boolean
  error?: string
}

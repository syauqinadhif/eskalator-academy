export function calcMissionXP(baseXP: number, hintsUsed: number): number {
  return Math.max(40, baseXP - hintsUsed * 20)
}

export const LEVELS = [
  { level: 1, label: 'Rookie Dev',    minXP: 0    },
  { level: 2, label: 'Junior Dev',    minXP: 300  },
  { level: 3, label: 'Dev Trainee',   minXP: 700  },
  { level: 4, label: 'Dev Intern',    minXP: 1200 },
  { level: 5, label: 'ESKALATOR Dev', minXP: 2000 },
]

export function getLevel(xp: number) {
  return [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0]
}

export function getNextLevel(xp: number) {
  const current = getLevel(xp)
  return LEVELS.find((l) => l.level === current.level + 1) ?? null
}

export function getLevelProgress(xp: number): number {
  const current = getLevel(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  const range = next.minXP - current.minXP
  const earned = xp - current.minXP
  return Math.round((earned / range) * 100)
}

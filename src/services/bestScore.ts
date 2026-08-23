export const BEST_SCORE_STORAGE_KEY = 'elodiewu:shell-stack:best-score:v1'

export interface ScoreStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface BestScoreService {
  load(): number
  save(score: number): number
}

function normalizeScore(score: number): number {
  return Number.isFinite(score) && score > 0 ? Math.floor(score) : 0
}

export function createBestScoreService(storage: ScoreStorage | null): BestScoreService {
  const load = (): number => {
    if (!storage) return 0

    try {
      return normalizeScore(Number(storage.getItem(BEST_SCORE_STORAGE_KEY)))
    } catch {
      return 0
    }
  }

  return {
    load,

    save(score) {
      const candidate = normalizeScore(score)
      if (!storage) return candidate

      try {
        const bestScore = Math.max(candidate, load())
        storage.setItem(BEST_SCORE_STORAGE_KEY, String(bestScore))
        return bestScore
      } catch {
        return candidate
      }
    },
  }
}

export function createBrowserBestScoreService(): BestScoreService {
  if (typeof window === 'undefined') return createBestScoreService(null)

  try {
    return createBestScoreService(window.localStorage)
  } catch {
    return createBestScoreService(null)
  }
}

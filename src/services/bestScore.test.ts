import { describe, expect, it } from 'vitest'
import {
  BEST_SCORE_STORAGE_KEY,
  createBestScoreService,
  type ScoreStorage,
} from './bestScore'

function createMemoryStorage(): ScoreStorage {
  const values = new Map<string, string>()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}

describe('best score service', () => {
  it('keeps the highest valid score behind the service boundary', () => {
    const storage = createMemoryStorage()
    const service = createBestScoreService(storage)

    expect(service.load()).toBe(0)
    expect(service.save(120)).toBe(120)
    expect(service.save(80)).toBe(120)
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('120')
  })

  it('falls back safely when stored data is invalid', () => {
    const storage = createMemoryStorage()
    storage.setItem(BEST_SCORE_STORAGE_KEY, 'not-a-score')

    expect(createBestScoreService(storage).load()).toBe(0)
  })
})

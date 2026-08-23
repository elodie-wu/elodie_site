import { POINTS_PER_CLEARED_ROW } from './constants'

export interface ScoreUpdate {
  readonly score: number
  readonly bestScore: number
  readonly pointsAwarded: number
}

export function calculateTurnPoints(clearedRowCount: number): number {
  if (!Number.isInteger(clearedRowCount) || clearedRowCount < 0) {
    throw new Error('Cleared row count must be a non-negative integer.')
  }

  return clearedRowCount * POINTS_PER_CLEARED_ROW
}

export function updateScore(
  currentScore: number,
  currentBestScore: number,
  clearedRowCount: number,
): ScoreUpdate {
  const pointsAwarded = calculateTurnPoints(clearedRowCount)
  const score = currentScore + pointsAwarded

  return {
    score,
    bestScore: Math.max(currentBestScore, score),
    pointsAwarded,
  }
}

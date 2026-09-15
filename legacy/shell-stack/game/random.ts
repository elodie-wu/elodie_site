import {
  BLOCK_WIDTHS,
  BOTTOM_ROW,
  NEW_ROW_MAX_OCCUPIED_CELLS,
  NEW_ROW_MIN_OCCUPIED_CELLS,
} from './constants'
import type { Block, BlockWidth, RandomSource } from './types'

export interface GeneratedRow {
  readonly blocks: readonly Block[]
  readonly nextBlockId: number
}

function normalizedRandom(random: RandomSource): number {
  const value = random()

  if (!Number.isFinite(value)) {
    throw new Error('Random source must return a finite number.')
  }

  return Math.min(Math.max(value, 0), 1 - Number.EPSILON)
}

export function randomInteger(
  random: RandomSource,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum > maximum) {
    throw new Error('Random integer bounds must be ordered integers.')
  }

  return minimum + Math.floor(normalizedRandom(random) * (maximum - minimum + 1))
}

export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

export const systemRandom: RandomSource = () => Math.random()

export function generateRandomBottomRow(
  random: RandomSource,
  firstBlockId: number,
  row = BOTTOM_ROW,
): GeneratedRow {
  const occupiedCellCount = randomInteger(
    random,
    NEW_ROW_MIN_OCCUPIED_CELLS,
    NEW_ROW_MAX_OCCUPIED_CELLS,
  )
  const columns = Array.from({ length: 9 }, (_, column) => column)

  for (let index = columns.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(random, 0, index)
    ;[columns[index], columns[swapIndex]] = [columns[swapIndex], columns[index]]
  }

  const occupiedColumns = new Set(columns.slice(0, occupiedCellCount))
  const blocks: Block[] = []
  let blockId = firstBlockId
  let column = 0

  while (column < columns.length) {
    if (!occupiedColumns.has(column)) {
      column += 1
      continue
    }

    const runStart = column
    while (column < columns.length && occupiedColumns.has(column)) {
      column += 1
    }

    let runWidth = column - runStart
    let blockColumn = runStart

    while (runWidth > 0) {
      const width = (
        runWidth >= BLOCK_WIDTHS[1] ? BLOCK_WIDTHS[1] : BLOCK_WIDTHS[0]
      ) as BlockWidth
      blocks.push({
        id: `block-${blockId}`,
        row,
        column: blockColumn,
        width,
      })
      blockId += 1
      blockColumn += width
      runWidth -= width
    }
  }

  return { blocks, nextBlockId: blockId }
}

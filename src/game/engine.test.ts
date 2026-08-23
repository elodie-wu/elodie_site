import { describe, expect, it } from 'vitest'
import { NEW_ROW_MAX_OCCUPIED_CELLS, NEW_ROW_MIN_OCCUPIED_CELLS } from './constants'
import {
  buildBoard,
  createGameState,
  createInitialGame,
  findDropPosition,
  getMoveFailureReason,
  isTopMovable,
  moveBlock,
  settleFloatingBlocks,
} from './engine'
import { createSeededRandom, generateRandomBottomRow } from './random'
import type { Block } from './types'

describe('Shell Stack engine', () => {
  it('starts with three generated rows containing legal horizontal blocks', () => {
    const game = createInitialGame(createSeededRandom(23))

    expect(game.blocks.every((block) => block.width === 1 || block.width === 3)).toBe(true)
    expect(game.blocks.every((block) => findDropPosition(block, block.column, game.blocks) === block.row)).toBe(true)
    expect(() => buildBoard(game.blocks)).not.toThrow()
  })

  it('only marks a block top-movable when no occupied cell is above its columns', () => {
    const blocks: Block[] = [
      { id: 'lower', row: 5, column: 2, width: 3 },
      { id: 'blocking', row: 2, column: 4, width: 2 },
      { id: 'clear', row: 7, column: 7, width: 2 },
    ]

    expect(isTopMovable(blocks, 'lower')).toBe(false)
    expect(isTopMovable(blocks, 'blocking')).toBe(true)
    expect(isTopMovable(blocks, 'clear')).toBe(true)
  })

  it('finds the floor when a target column has no obstacles', () => {
    const mover: Block = { id: 'mover', row: 4, column: 1, width: 2 }

    expect(findDropPosition(mover, 3, [mover])).toBe(8)
  })

  it('lands immediately above the first obstacle without passing through it', () => {
    const mover: Block = { id: 'mover', row: 2, column: 0, width: 2 }
    const obstacle: Block = { id: 'obstacle', row: 6, column: 3, width: 2 }

    expect(findDropPosition(mover, 3, [mover, obstacle])).toBe(5)
  })

  it('never moves upward and ignores obstacles above the current row', () => {
    const mover: Block = { id: 'mover', row: 3, column: 0, width: 2 }
    const blockAbove: Block = { id: 'block-above', row: 0, column: 4, width: 2 }

    expect(findDropPosition(mover, 4, [mover, blockAbove])).toBe(8)
  })

  it('rejects target columns outside the board or blocked along the current row', () => {
    const state = createGameState({
      blocks: [
        { id: 'mover', row: 2, column: 0, width: 3 },
        { id: 'row-blocker', row: 2, column: 4, width: 2 },
      ],
    })

    expect(getMoveFailureReason(state, { blockId: 'mover', targetX: 7 })).toBe(
      'target-out-of-bounds',
    )
    expect(getMoveFailureReason(state, { blockId: 'mover', targetX: 4 })).toBe(
      'target-row-blocked',
    )

    const result = moveBlock(state, { blockId: 'mover', targetX: 4 }, createSeededRandom(2))
    expect(result.ok).toBe(false)
    expect(result.state).toBe(state)
    expect(result.state.turn).toBe(0)
    expect(result.state.score).toBe(0)
  })

  it('drops blocks above cleared rows, adds a bottom row, and awards 100 points per row', () => {
    const state = createGameState({
      blocks: [
        { id: 'row-a', row: 5, column: 0, width: 4 },
        { id: 'row-b', row: 5, column: 4, width: 4 },
        { id: 'mover', row: 4, column: 8, width: 1 },
        { id: 'support-a', row: 6, column: 0, width: 1 },
        { id: 'support-b', row: 6, column: 4, width: 1 },
        { id: 'support', row: 6, column: 8, width: 1 },
      ],
      nextBlockId: 20,
    })

    const result = moveBlock(
      state,
      { blockId: 'mover', targetX: 8 },
      createSeededRandom(42),
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.state.lastTurn?.clearedRows).toEqual([7])
    expect(result.state.blocks.some((block) => block.row === 8)).toBe(true)
    expect(result.state.blocks.every((block) => findDropPosition(block, block.column, result.state.blocks) === block.row)).toBe(true)
    expect(result.state.score).toBe(100)
    expect(result.state.bestScore).toBe(100)
    expect(result.state.turn).toBe(1)
    expect(() => buildBoard(result.state.blocks)).not.toThrow()
  })

  it('repeatedly drops floating blocks until the entire board is stable', () => {
    const settled = settleFloatingBlocks(
      [
        { id: 'above-support', row: 2, column: 0, width: 1 },
        { id: 'support', row: 7, column: 0, width: 1 },
        { id: 'open-floor', row: 1, column: 4, width: 3 },
      ],
    )

    expect(settled.find((block) => block.id === 'above-support')?.row).toBe(7)
    expect(settled.find((block) => block.id === 'support')?.row).toBe(8)
    expect(settled.find((block) => block.id === 'open-floor')?.row).toBe(8)
    expect(settled.every((block) => findDropPosition(block, block.column, settled) === block.row)).toBe(true)
  })

  it('marks the game over when a remaining block is pushed above the top edge', () => {
    const state = createGameState({
      blocks: [
        { id: 'overflow', row: 0, column: 0, width: 1 },
        { id: 'stack-1', row: 1, column: 0, width: 1 },
        { id: 'stack-2', row: 2, column: 0, width: 1 },
        { id: 'stack-3', row: 3, column: 0, width: 1 },
        { id: 'stack-4', row: 4, column: 0, width: 1 },
        { id: 'stack-5', row: 5, column: 0, width: 1 },
        { id: 'stack-6', row: 6, column: 0, width: 1 },
        { id: 'stack-7', row: 7, column: 0, width: 1 },
        { id: 'stack-8', row: 8, column: 0, width: 1 },
        { id: 'mover', row: 2, column: 8, width: 1 },
      ],
    })

    const result = moveBlock(
      state,
      { blockId: 'mover', targetX: 8 },
      createSeededRandom(7),
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.state.status).toBe('game-over')
    expect(result.state.lastTurn?.overflowedBlockIds).toEqual(['overflow'])
    expect(result.state.blocks.some((block) => block.id === 'overflow')).toBe(false)
  })

  it('creates deterministic non-full bottom rows with legal block widths', () => {
    const first = generateRandomBottomRow(createSeededRandom(99), 0)
    const second = generateRandomBottomRow(createSeededRandom(99), 0)
    const occupiedCells = first.blocks.reduce((total, block) => total + block.width, 0)

    expect(first).toEqual(second)
    expect(occupiedCells).toBeGreaterThanOrEqual(NEW_ROW_MIN_OCCUPIED_CELLS)
    expect(occupiedCells).toBeLessThanOrEqual(NEW_ROW_MAX_OCCUPIED_CELLS)
    expect(first.blocks.every((block) => block.row === 8)).toBe(true)
    expect(first.blocks.every((block) => block.width === 1 || block.width === 3)).toBe(true)
  })

  it('never generates width-2 or width-4 blocks across random seeds', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const generated = generateRandomBottomRow(createSeededRandom(seed), 0)
      expect(generated.blocks.every((block) => block.width === 1 || block.width === 3)).toBe(true)
    }
  })
})

import { BOARD_COLUMNS, BOARD_ROWS, INITIAL_ROW_COUNT } from './constants'
import { generateRandomBottomRow, systemRandom } from './random'
import { updateScore } from './scoring'
import type {
  Block,
  Board,
  Cell,
  GameState,
  Move,
  MoveFailureReason,
  MoveResult,
  RandomSource,
} from './types'

interface GameStateOptions {
  readonly blocks?: readonly Block[]
  readonly score?: number
  readonly bestScore?: number
  readonly turn?: number
  readonly nextBlockId?: number
  readonly status?: GameState['status']
}

function rangesOverlap(startA: number, widthA: number, startB: number, widthB: number): boolean {
  return startA < startB + widthB && startB < startA + widthA
}

function assertValidBlock(block: Block): void {
  const widthIsValid = Number.isInteger(block.width) && block.width >= 1 && block.width <= 4
  const positionIsValid =
    Number.isInteger(block.row) &&
    Number.isInteger(block.column) &&
    block.row >= 0 &&
    block.row < BOARD_ROWS &&
    block.column >= 0 &&
    block.column + block.width <= BOARD_COLUMNS

  if (!block.id || !widthIsValid || !positionIsValid) {
    throw new Error(`Invalid block: ${block.id || '<missing id>'}`)
  }
}

function inferNextBlockId(blocks: readonly Block[]): number {
  return blocks.reduce((nextId, block) => {
    const match = /^block-(\d+)$/.exec(block.id)
    return match ? Math.max(nextId, Number(match[1]) + 1) : nextId
  }, 0)
}

export function getBlockCells(block: Block): readonly Cell[] {
  return Array.from({ length: block.width }, (_, offset) => ({
    row: block.row,
    column: block.column + offset,
  }))
}

export function buildBoard(blocks: readonly Block[]): Board {
  const board: (string | null)[][] = Array.from({ length: BOARD_ROWS }, () =>
    Array<string | null>(BOARD_COLUMNS).fill(null),
  )
  const seenIds = new Set<string>()

  for (const block of blocks) {
    assertValidBlock(block)

    if (seenIds.has(block.id)) {
      throw new Error(`Duplicate block id: ${block.id}`)
    }
    seenIds.add(block.id)

    for (const cell of getBlockCells(block)) {
      if (board[cell.row][cell.column] !== null) {
        throw new Error(`Blocks overlap at row ${cell.row}, column ${cell.column}.`)
      }
      board[cell.row][cell.column] = block.id
    }
  }

  return board
}

export function createGameState(options: GameStateOptions = {}): GameState {
  const blocks = (options.blocks ?? []).map((block) => ({ ...block }))
  buildBoard(blocks)

  return {
    blocks,
    score: options.score ?? 0,
    bestScore: Math.max(options.bestScore ?? 0, options.score ?? 0),
    turn: options.turn ?? 0,
    nextBlockId: options.nextBlockId ?? inferNextBlockId(blocks),
    status: options.status ?? 'playing',
    lastTurn: null,
  }
}

export function createInitialGame(
  random: RandomSource = systemRandom,
  bestScore = 0,
): GameState {
  const blocks: Block[] = []
  let nextBlockId = 0

  for (let row = BOARD_ROWS - INITIAL_ROW_COUNT; row < BOARD_ROWS; row += 1) {
    const generated = generateRandomBottomRow(random, nextBlockId, row)
    blocks.push(...generated.blocks)
    nextBlockId = generated.nextBlockId
  }

  const settledBlocks = settleFloatingBlocks(blocks)

  return createGameState({
    blocks: settledBlocks,
    bestScore,
    nextBlockId,
  })
}

export function isTopMovable(blocks: readonly Block[], blockId: string): boolean {
  const block = blocks.find((candidate) => candidate.id === blockId)
  if (!block) return false

  return !blocks.some(
    (candidate) =>
      candidate.id !== block.id &&
      candidate.row < block.row &&
      rangesOverlap(block.column, block.width, candidate.column, candidate.width),
  )
}

export function getTopMovableBlockIds(blocks: readonly Block[]): readonly string[] {
  return blocks.filter((block) => isTopMovable(blocks, block.id)).map((block) => block.id)
}

/**
 * Returns the lowest row reachable from the block's current row. The selected
 * block is excluded from collision checks, and the move never travels upward.
 */
export function findDropPosition(
  block: Block,
  targetX: number,
  blocks: readonly Block[],
): number | null {
  assertValidBlock(block)

  const targetIsInsideBoard =
    Number.isInteger(targetX) &&
    targetX >= 0 &&
    targetX + block.width <= BOARD_COLUMNS

  if (!targetIsInsideBoard) return null

  const collisionBoard = buildBoard(blocks.filter((candidate) => candidate.id !== block.id))

  for (let targetY = block.row; targetY < BOARD_ROWS; targetY += 1) {
    const rowIsBlocked = Array.from(
      { length: block.width },
      (_, offset) => collisionBoard[targetY][targetX + offset] !== null,
    ).some(Boolean)

    if (rowIsBlocked) return targetY === block.row ? null : targetY - 1
  }

  return BOARD_ROWS - 1
}

/**
 * Repeatedly drops every unsupported block until the whole board is stable.
 * Blocks are evaluated from the bottom upward so newly settled pieces can
 * immediately support the pieces above them.
 */
export function settleFloatingBlocks(blocks: readonly Block[]): readonly Block[] {
  let settled = blocks.map((block) => ({ ...block }))

  for (let pass = 0; pass < BOARD_ROWS; pass += 1) {
    let movedInPass = false
    const blockIds = [...settled]
      .sort((left, right) => right.row - left.row)
      .map((block) => block.id)

    for (const blockId of blockIds) {
      const block = settled.find((candidate) => candidate.id === blockId)!
      const targetRow = findDropPosition(block, block.column, settled)

      if (targetRow !== null && targetRow > block.row) {
        settled = settled.map((candidate) =>
          candidate.id === block.id ? { ...candidate, row: targetRow } : candidate,
        )
        movedInPass = true
      }
    }

    if (!movedInPass) break
  }

  buildBoard(settled)
  return settled
}

function isHorizontalPathClear(
  block: Block,
  targetX: number,
  blocks: readonly Block[],
): boolean {
  const collisionBoard = buildBoard(blocks.filter((candidate) => candidate.id !== block.id))
  const pathStart = Math.min(block.column, targetX)
  const pathEnd = Math.max(block.column + block.width, targetX + block.width)

  for (let column = pathStart; column < pathEnd; column += 1) {
    if (collisionBoard[block.row][column] !== null) return false
  }

  return true
}

export function getMoveFailureReason(state: GameState, move: Move): MoveFailureReason | null {
  if (state.status === 'game-over') return 'game-over'

  const block = state.blocks.find((candidate) => candidate.id === move.blockId)
  if (!block) return 'block-not-found'
  if (!isTopMovable(state.blocks, move.blockId)) return 'block-not-top-movable'

  const targetIsInsideBoard =
    Number.isInteger(move.targetX) &&
    move.targetX >= 0 &&
    move.targetX + block.width <= BOARD_COLUMNS

  if (!targetIsInsideBoard) return 'target-out-of-bounds'
  if (!isHorizontalPathClear(block, move.targetX, state.blocks)) return 'target-row-blocked'

  return findDropPosition(block, move.targetX, state.blocks) === null
    ? 'no-legal-drop-position'
    : null
}

function getFullRows(blocks: readonly Block[]): readonly number[] {
  const occupiedPerRow = Array<number>(BOARD_ROWS).fill(0)

  for (const block of blocks) {
    occupiedPerRow[block.row] += block.width
  }

  return occupiedPerRow
    .map((occupiedCells, row) => (occupiedCells === BOARD_COLUMNS ? row : -1))
    .filter((row) => row >= 0)
}

export function moveBlock(
  state: GameState,
  move: Move,
  random: RandomSource = systemRandom,
): MoveResult {
  const failureReason = getMoveFailureReason(state, move)
  if (failureReason) return { ok: false, state, reason: failureReason }

  const selectedBlock = state.blocks.find((block) => block.id === move.blockId)!
  const targetY = findDropPosition(selectedBlock, move.targetX, state.blocks)
  if (targetY === null) {
    return { ok: false, state, reason: 'no-legal-drop-position' }
  }

  const movedBlocks = state.blocks.map((block) =>
    block.id === move.blockId
      ? { ...block, row: targetY, column: move.targetX }
      : block,
  )
  const settledAfterMove = settleFloatingBlocks(movedBlocks)
  const clearedRows = getFullRows(settledAfterMove)
  const clearedRowSet = new Set(clearedRows)
  const unclearedBlocks = settledAfterMove.filter((block) => !clearedRowSet.has(block.row))
  const gravitySettledBlocks = settleFloatingBlocks(unclearedBlocks)
  // A block on row 0 cannot survive the mandatory upward step. It leaves the
  // board and is recorded as overflow; the turn still finishes before game over.
  const overflowedBlockIds = gravitySettledBlocks
    .filter((block) => block.row === 0)
    .map((block) => block.id)
  const shiftedBlocks = gravitySettledBlocks
    .filter((block) => block.row > 0)
    .map((block) => ({ ...block, row: block.row - 1 }))
  const generated = generateRandomBottomRow(random, state.nextBlockId)
  const scoreUpdate = updateScore(state.score, state.bestScore, clearedRows.length)
  const nextBlocks = settleFloatingBlocks([...shiftedBlocks, ...generated.blocks])

  const nextState: GameState = {
    blocks: nextBlocks,
    score: scoreUpdate.score,
    bestScore: scoreUpdate.bestScore,
    turn: state.turn + 1,
    nextBlockId: generated.nextBlockId,
    status: overflowedBlockIds.length > 0 ? 'game-over' : 'playing',
    lastTurn: {
      movedBlockId: move.blockId,
      clearedRows,
      generatedBlockIds: generated.blocks.map((block) => block.id),
      overflowedBlockIds,
      pointsAwarded: scoreUpdate.pointsAwarded,
    },
  }

  buildBoard(nextState.blocks)
  return { ok: true, state: nextState }
}

export type BlockWidth = 1 | 2 | 3 | 4

export interface Block {
  readonly id: string
  readonly row: number
  readonly column: number
  readonly width: BlockWidth
}

export interface Cell {
  readonly row: number
  readonly column: number
}

export type BoardCell = string | null
export type Board = readonly (readonly BoardCell[])[]

export type GameStatus = 'playing' | 'game-over'

export interface TurnSummary {
  readonly movedBlockId: string
  readonly clearedRows: readonly number[]
  readonly generatedBlockIds: readonly string[]
  readonly overflowedBlockIds: readonly string[]
  readonly pointsAwarded: number
}

export interface GameState {
  readonly blocks: readonly Block[]
  readonly score: number
  readonly bestScore: number
  readonly turn: number
  readonly nextBlockId: number
  readonly status: GameStatus
  readonly lastTurn: TurnSummary | null
}

export interface Move {
  readonly blockId: string
  readonly targetX: number
}

export type MoveFailureReason =
  | 'game-over'
  | 'block-not-found'
  | 'block-not-top-movable'
  | 'target-out-of-bounds'
  | 'target-row-blocked'
  | 'no-legal-drop-position'

export type MoveResult =
  | { readonly ok: true; readonly state: GameState }
  | {
      readonly ok: false
      readonly state: GameState
      readonly reason: MoveFailureReason
    }

export type RandomSource = () => number

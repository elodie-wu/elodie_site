export type Direction = 'up' | 'down' | 'left' | 'right'
export type GameStatus = 'ready' | 'running' | 'paused' | 'game-over'

export interface Point {
  readonly x: number
  readonly y: number
}
export interface Food extends Point { readonly emoji: string }
export interface SnakeSession {
  readonly snake: readonly Point[]
  readonly food: Food
  readonly score: number
  readonly direction: Direction
  readonly status: GameStatus
}
export interface SnakeMove {
  readonly snake: readonly Point[]
  readonly direction: Direction
  readonly ateFood: boolean
}

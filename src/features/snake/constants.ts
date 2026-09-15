import type { Direction } from './types'

export const BOARD_SIZE = 20
export const TICK_MS = 155
export const FOOD_EMOJIS = ['🍓', '🍒', '🍉', '🍋', '🍑', '🍇', '🥝', '🍄', '🌙', '⭐', '💎', '🧁'] as const
export const keyDirections: Record<string, Direction | undefined> = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

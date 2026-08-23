import type { BlockWidth } from './types'

export const BOARD_COLUMNS = 9
export const BOARD_ROWS = 9
export const BOTTOM_ROW = BOARD_ROWS - 1
export const INITIAL_ROW_COUNT = 3

export const BLOCK_WIDTHS = [1, 3] as const satisfies readonly BlockWidth[]

// New rows always leave at least one open cell, so they cannot arrive already full.
export const NEW_ROW_MIN_OCCUPIED_CELLS = 5
export const NEW_ROW_MAX_OCCUPIED_CELLS = BOARD_COLUMNS - 1

export const POINTS_PER_CLEARED_ROW = 100

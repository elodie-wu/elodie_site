import { BOARD_COLUMNS, BOARD_ROWS } from '../../game/constants'

export interface GridRectangle {
  readonly left: number
  readonly top: number
  readonly width: number
  readonly height: number
}

export interface SnappedCell {
  readonly row: number
  readonly column: number
}

export function getSnappedCell(
  pointerX: number,
  pointerY: number,
  grabOffsetX: number,
  grabOffsetY: number,
  board: GridRectangle,
): SnappedCell {
  const cellWidth = board.width / BOARD_COLUMNS
  const cellHeight = board.height / BOARD_ROWS

  return {
    row: Math.round((pointerY - board.top - grabOffsetY) / cellHeight),
    column: Math.round((pointerX - board.left - grabOffsetX) / cellWidth),
  }
}

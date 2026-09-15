import { describe, expect, it } from 'vitest'
import { getSnappedCell } from './drag'

const board = { left: 100, top: 50, width: 450, height: 450 }

describe('Shell Stack pointer snapping', () => {
  it('snaps the dragged block origin to the nearest cell', () => {
    expect(getSnappedCell(231, 181, 25, 25, board)).toEqual({ row: 2, column: 2 })
  })

  it('preserves out-of-board coordinates for engine validation', () => {
    expect(getSnappedCell(60, 10, 25, 25, board)).toEqual({ row: -1, column: -1 })
  })
})

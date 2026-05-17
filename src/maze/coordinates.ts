import type { Coordinate, Direction } from './types'

export const directions: Direction[] = ['north', 'east', 'south', 'west']

export const directionDelta: Record<Direction, Coordinate> = {
  north: { row: -1, col: 0 },
  east: { row: 0, col: 1 },
  south: { row: 1, col: 0 },
  west: { row: 0, col: -1 },
}

export const oppositeDirection: Record<Direction, Direction> = {
  north: 'south',
  east: 'west',
  south: 'north',
  west: 'east',
}

export function cellKey(cell: Coordinate): string {
  return `${cell.row}:${cell.col}`
}

export function parseCellKey(key: string): Coordinate {
  const [row, col] = key.split(':').map(Number)

  return { row, col }
}

export function sameCell(left: Coordinate, right: Coordinate): boolean {
  return left.row === right.row && left.col === right.col
}

export function manhattanDistance(left: Coordinate, right: Coordinate): number {
  return Math.abs(left.row - right.row) + Math.abs(left.col - right.col)
}

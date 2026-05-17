import {
  cellKey,
  directionDelta,
  directions,
  oppositeDirection,
} from './coordinates'
import type { Coordinate, Direction, Maze, MazeCell } from './types'

export function createClosedMaze(rows: number, cols: number): Maze {
  const cells = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      walls: {
        north: true,
        east: true,
        south: true,
        west: true,
      },
    })),
  )

  return {
    rows,
    cols,
    cells,
    start: { row: 0, col: 0 },
    goal: { row: rows - 1, col: cols - 1 },
  }
}

export function inBounds(maze: Maze, cell: Coordinate): boolean {
  return (
    cell.row >= 0 &&
    cell.row < maze.rows &&
    cell.col >= 0 &&
    cell.col < maze.cols
  )
}

export function getCell(maze: Maze, cell: Coordinate): MazeCell {
  return maze.cells[cell.row][cell.col]
}

export function move(cell: Coordinate, direction: Direction): Coordinate {
  const delta = directionDelta[direction]

  return {
    row: cell.row + delta.row,
    col: cell.col + delta.col,
  }
}

export function removeWall(
  maze: Maze,
  cell: Coordinate,
  direction: Direction,
): void {
  const next = move(cell, direction)

  getCell(maze, cell).walls[direction] = false
  getCell(maze, next).walls[oppositeDirection[direction]] = false
}

export function getUnvisitedNeighbors(
  maze: Maze,
  cell: Coordinate,
  visited: Set<string>,
): Array<{ direction: Direction; cell: Coordinate }> {
  return directions
    .map((direction) => ({ direction, cell: move(cell, direction) }))
    .filter((candidate) => {
      return inBounds(maze, candidate.cell) && !visited.has(cellKey(candidate.cell))
    })
}

export function getOpenNeighbors(maze: Maze, cell: Coordinate): Coordinate[] {
  const mazeCell = getCell(maze, cell)

  return directions
    .filter((direction) => !mazeCell.walls[direction])
    .map((direction) => move(cell, direction))
    .filter((next) => inBounds(maze, next))
}

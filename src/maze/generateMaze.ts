import { cellKey } from './coordinates'
import { createClosedMaze, getUnvisitedNeighbors, removeWall } from './grid'
import { createSeededRandom, randomInt } from './random'
import type { Coordinate, Maze } from './types'

export type MazeGenerationOptions = {
  rows: number
  cols: number
  seed: number
}

export function generateMaze({
  rows,
  cols,
  seed,
}: MazeGenerationOptions): Maze {
  const maze = createClosedMaze(rows, cols)
  const random = createSeededRandom(seed)
  const start: Coordinate = { row: 0, col: 0 }
  const stack: Coordinate[] = [start]
  const visited = new Set<string>([cellKey(start)])

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = getUnvisitedNeighbors(maze, current, visited)

    if (neighbors.length === 0) {
      stack.pop()
      continue
    }

    const next = neighbors[randomInt(random, neighbors.length)]
    removeWall(maze, current, next.direction)
    visited.add(cellKey(next.cell))
    stack.push(next.cell)
  }

  return maze
}

import { cellKey, directions, sameCell } from '../coordinates'
import { getCell, move } from '../grid'
import type { Coordinate, Direction, Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'

const rightTurn: Record<Direction, Direction> = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
}

const leftTurn: Record<Direction, Direction> = {
  north: 'west',
  east: 'north',
  south: 'east',
  west: 'south',
}

const backTurn: Record<Direction, Direction> = {
  north: 'south',
  east: 'west',
  south: 'north',
  west: 'east',
}

function chooseRightHandDirection(maze: Maze, cell: Coordinate, facing: Direction) {
  const options = [rightTurn[facing], facing, leftTurn[facing], backTurn[facing]]
  const walls = getCell(maze, cell).walls

  return options.find((direction) => !walls[direction]) ?? facing
}

function pruneWalkedPath(path: Coordinate[]): Coordinate[] {
  const pruned: Coordinate[] = []
  const indexByCell = new Map<string, number>()

  for (const cell of path) {
    const key = cellKey(cell)
    const previousIndex = indexByCell.get(key)

    if (previousIndex !== undefined) {
      for (const removed of pruned.slice(previousIndex + 1)) {
        indexByCell.delete(cellKey(removed))
      }

      pruned.splice(previousIndex + 1)
      continue
    }

    indexByCell.set(key, pruned.length)
    pruned.push(cell)
  }

  return pruned
}

export function solveWithWallFollower(maze: Maze): SolverResult {
  const visited = new Set<string>()
  const traces: SearchTrace[] = []
  const path: Coordinate[] = [maze.start]
  const maxSteps = maze.rows * maze.cols * directions.length * 2
  let current = maze.start
  let facing: Direction = 'east'

  for (let step = 0; step < maxSteps && !sameCell(current, maze.goal); step += 1) {
    visited.add(cellKey(current))
    facing = chooseRightHandDirection(maze, current, facing)

    traces.push({
      current,
      visited: new Set(visited),
      frontier: [move(current, facing)],
      path: [],
      walkedTrail: [...path],
      label: 'The mouse keeps its right hand on the wall and advances one cell',
    })

    current = move(current, facing)
    path.push(current)
  }

  visited.add(cellKey(current))
  const solved = sameCell(current, maze.goal)
  const finalPath = solved ? pruneWalkedPath(path) : []

  traces.push({
    current,
    visited,
    frontier: [],
    path: finalPath,
    walkedTrail: path,
    label: solved
      ? 'Wall following reached the exit and pruned loops from its route'
      : 'Wall following stopped after a full traversal budget',
  })

  return toResult({
    algorithm: 'wallFollower',
    title: 'Wall follower',
    description: 'A single-head right-hand rule that loop-erases its route after escape.',
    traces,
    path: finalPath,
    frontierPeak: 1,
  })
}

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
      path: [...path],
      label: 'The mouse keeps its right hand on the wall and advances one cell',
    })

    current = move(current, facing)
    path.push(current)
  }

  visited.add(cellKey(current))
  traces.push({
    current,
    visited,
    frontier: [],
    path,
    label: sameCell(current, maze.goal)
      ? 'Wall following reached the exit'
      : 'Wall following stopped after a full traversal budget',
  })

  return toResult({
    algorithm: 'wallFollower',
    title: 'Wall follower',
    description: 'A single-head right-hand rule that needs no global map.',
    traces,
    path: sameCell(current, maze.goal) ? path : [],
    frontierPeak: 1,
  })
}

import { cellKey, parseCellKey, sameCell } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { Coordinate, Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'
import { reconstructPath } from './reconstructPath'

function isProtectedEndpoint(maze: Maze, cell: Coordinate): boolean {
  return sameCell(cell, maze.start) || sameCell(cell, maze.goal)
}

export function solveWithDeadEndFilling(maze: Maze): SolverResult {
  const filled = new Set<string>()
  const queue: Coordinate[] = maze.cells
    .flat()
    .filter((cell) => !isProtectedEndpoint(maze, cell))
    .filter((cell) => getOpenNeighbors(maze, cell).length <= 1)
  const traces: SearchTrace[] = []
  let frontierPeak = queue.length

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentKey = cellKey(current)

    if (filled.has(currentKey) || isProtectedEndpoint(maze, current)) {
      continue
    }

    const openUnfilledNeighbors = getOpenNeighbors(maze, current).filter(
      (neighbor) => !filled.has(cellKey(neighbor)),
    )

    if (openUnfilledNeighbors.length > 1) {
      continue
    }

    filled.add(currentKey)

    for (const neighbor of openUnfilledNeighbors) {
      if (!isProtectedEndpoint(maze, neighbor)) {
        queue.push(neighbor)
      }
    }

    frontierPeak = Math.max(frontierPeak, queue.length)
    traces.push({
      current,
      visited: new Set(filled),
      frontier: [...queue],
      path: [],
      label: 'Dead-end filling removes corridors that cannot belong to the solution',
    })
  }

  const remainingPathKeys = maze.cells
    .flat()
    .map(cellKey)
    .filter((key) => !filled.has(key))
  const remaining = new Set(remainingPathKeys)
  const cameFrom = new Map<string, string>()
  const queuePath = [maze.start]
  const seen = new Set<string>([cellKey(maze.start)])

  while (queuePath.length > 0) {
    const current = queuePath.shift()!

    if (sameCell(current, maze.goal)) {
      break
    }

    for (const neighbor of getOpenNeighbors(maze, current)) {
      const key = cellKey(neighbor)

      if (!remaining.has(key) || seen.has(key)) {
        continue
      }

      seen.add(key)
      cameFrom.set(key, cellKey(current))
      queuePath.push(neighbor)
    }
  }

  const path = reconstructPath(cameFrom, maze.start, maze.goal)
  traces.push({
    current: path.at(-1) ?? maze.goal,
    visited: filled,
    frontier: remainingPathKeys.map(parseCellKey),
    path,
    label: 'Only the viable corridor remains after filling dead ends',
  })

  return toResult({
    algorithm: 'deadEndFilling',
    title: 'Dead-end filling',
    description: 'Prunes dead ends until the surviving corridor reveals the route.',
    traces,
    path,
    frontierPeak,
  })
}

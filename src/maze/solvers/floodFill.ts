import { cellKey, sameCell } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { Coordinate, Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'

function buildDistanceMap(maze: Maze): Map<string, number> {
  const queue = [maze.goal]
  const distances = new Map<string, number>([[cellKey(maze.goal), 0]])

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentDistance = distances.get(cellKey(current)) ?? 0

    for (const neighbor of getOpenNeighbors(maze, current)) {
      const key = cellKey(neighbor)

      if (distances.has(key)) {
        continue
      }

      distances.set(key, currentDistance + 1)
      queue.push(neighbor)
    }
  }

  return distances
}

function lowestDistanceNeighbor(
  maze: Maze,
  cell: Coordinate,
  distances: Map<string, number>,
): Coordinate | undefined {
  return getOpenNeighbors(maze, cell).sort((left, right) => {
    return (
      (distances.get(cellKey(left)) ?? Number.POSITIVE_INFINITY) -
      (distances.get(cellKey(right)) ?? Number.POSITIVE_INFINITY)
    )
  })[0]
}

export function solveWithFloodFill(maze: Maze): SolverResult {
  const distances = buildDistanceMap(maze)
  const traces: SearchTrace[] = []
  const visited = new Set<string>()
  const path: Coordinate[] = [maze.start]
  let current = maze.start

  while (!sameCell(current, maze.goal)) {
    visited.add(cellKey(current))
    const next = lowestDistanceNeighbor(maze, current, distances)

    if (!next) {
      break
    }

    const frontier = getOpenNeighbors(maze, current)
    traces.push({
      current,
      visited: new Set(visited),
      frontier,
      path: [...path],
      label: 'Flood fill follows the steepest distance drop toward the goal',
    })

    current = next
    path.push(current)
  }

  visited.add(cellKey(current))
  traces.push({
    current,
    visited,
    frontier: [],
    path,
    label: 'The distance gradient reaches the goal',
  })

  return toResult({
    algorithm: 'floodFill',
    title: 'Flood fill',
    description: 'Builds a distance grid from the goal, then walks downhill from the start.',
    traces,
    path,
    frontierPeak: Math.max(...traces.map((trace) => trace.frontier.length), 1),
  })
}

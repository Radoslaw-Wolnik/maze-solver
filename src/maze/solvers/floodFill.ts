import { cellKey, sameCell } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { Coordinate, Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'

type DistanceMapResult = {
  distances: Map<string, number>
  traces: SearchTrace[]
  frontierPeak: number
}

function buildDistanceMap(maze: Maze): DistanceMapResult {
  const queue = [maze.goal]
  const distances = new Map<string, number>([[cellKey(maze.goal), 0]])
  const traces: SearchTrace[] = []
  let frontierPeak = queue.length

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

    frontierPeak = Math.max(frontierPeak, queue.length)
    traces.push({
      current,
      visited: new Set(distances.keys()),
      frontier: [...queue],
      path: [],
      label: 'Flood fill spreads distance labels outward from the goal',
    })
  }

  return { distances, traces, frontierPeak }
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
  const distanceMap = buildDistanceMap(maze)
  const { distances } = distanceMap
  const traces: SearchTrace[] = [...distanceMap.traces]
  const labelledCells = new Set(distances.keys())
  const path: Coordinate[] = [maze.start]
  let current = maze.start
  let frontierPeak = distanceMap.frontierPeak

  while (!sameCell(current, maze.goal)) {
    const next = lowestDistanceNeighbor(maze, current, distances)

    if (!next) {
      break
    }

    const frontier = getOpenNeighbors(maze, current)
    frontierPeak = Math.max(frontierPeak, frontier.length)
    traces.push({
      current,
      visited: new Set(labelledCells),
      frontier,
      path: [...path],
      label: 'Flood fill follows lower distance labels toward the goal',
    })

    current = next
    path.push(current)
  }

  traces.push({
    current,
    visited: labelledCells,
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
    frontierPeak,
  })
}

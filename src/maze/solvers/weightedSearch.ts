import { cellKey, manhattanDistance, sameCell } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { AlgorithmId, Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'
import { PriorityQueue } from './priorityQueue'
import { reconstructPath } from './reconstructPath'

type WeightedSearchOptions = {
  algorithm: AlgorithmId
  title: string
  description: string
  useHeuristic: boolean
}

export function solveWithWeightedSearch(
  maze: Maze,
  options: WeightedSearchOptions,
): SolverResult {
  const frontier = new PriorityQueue()
  const cameFrom = new Map<string, string>()
  const costs = new Map<string, number>([[cellKey(maze.start), 0]])
  const visited = new Set<string>()
  const traces: SearchTrace[] = []
  let frontierPeak = 1

  frontier.enqueue(maze.start, 0)

  while (frontier.length > 0) {
    const current = frontier.dequeue()!
    const currentKey = cellKey(current)

    if (visited.has(currentKey)) {
      continue
    }

    visited.add(currentKey)

    if (sameCell(current, maze.goal)) {
      traces.push({
        current,
        visited: new Set(visited),
        frontier: frontier.snapshot(),
        path: reconstructPath(cameFrom, maze.start, current),
        label: 'Goal reached by the lowest-cost candidate',
      })
      break
    }

    for (const neighbor of getOpenNeighbors(maze, current)) {
      const neighborKey = cellKey(neighbor)
      const nextCost = (costs.get(currentKey) ?? 0) + 1

      if (nextCost >= (costs.get(neighborKey) ?? Number.POSITIVE_INFINITY)) {
        continue
      }

      costs.set(neighborKey, nextCost)
      cameFrom.set(neighborKey, currentKey)

      const heuristic = options.useHeuristic
        ? manhattanDistance(neighbor, maze.goal)
        : 0

      frontier.enqueue(neighbor, nextCost + heuristic)
    }

    frontierPeak = Math.max(frontierPeak, frontier.length)
    traces.push({
      current,
      visited: new Set(visited),
      frontier: frontier.snapshot(),
      path: reconstructPath(cameFrom, maze.start, current),
      label: options.useHeuristic
        ? 'A* ranks the frontier by path cost plus distance to the goal'
        : 'Dijkstra ranks the frontier by known path cost only',
    })
  }

  return toResult({
    algorithm: options.algorithm,
    title: options.title,
    description: options.description,
    traces,
    path: reconstructPath(cameFrom, maze.start, maze.goal),
    frontierPeak,
  })
}

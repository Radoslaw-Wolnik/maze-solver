import { cellKey, sameCell } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'
import { reconstructPath } from './reconstructPath'

export function solveWithBfs(maze: Maze): SolverResult {
  const queue = [maze.start]
  const visited = new Set<string>([cellKey(maze.start)])
  const cameFrom = new Map<string, string>()
  const traces: SearchTrace[] = []
  let frontierPeak = queue.length

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentKey = cellKey(current)

    if (sameCell(current, maze.goal)) {
      traces.push({
        current,
        visited: new Set(visited),
        frontier: [...queue],
        path: reconstructPath(cameFrom, maze.start, current),
        label: 'Goal reached by expanding the shallowest frontier first',
      })
      break
    }

    for (const neighbor of getOpenNeighbors(maze, current)) {
      const neighborKey = cellKey(neighbor)

      if (visited.has(neighborKey)) {
        continue
      }

      visited.add(neighborKey)
      cameFrom.set(neighborKey, currentKey)
      queue.push(neighbor)
    }

    frontierPeak = Math.max(frontierPeak, queue.length)
    traces.push({
      current,
      visited: new Set(visited),
      frontier: [...queue],
      path: reconstructPath(cameFrom, maze.start, current),
      label: 'BFS has one active head; the amber queue shows where it may jump next',
    })
  }

  return toResult({
    algorithm: 'bfs',
    title: 'Breadth-first search',
    description: 'Guarantees the shortest path in an unweighted maze.',
    traces,
    path: reconstructPath(cameFrom, maze.start, maze.goal),
    frontierPeak,
  })
}

import { cellKey, sameCell } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'
import { reconstructPath } from './reconstructPath'

export function solveWithDfs(maze: Maze): SolverResult {
  const stack = [maze.start]
  const visited = new Set<string>([cellKey(maze.start)])
  const cameFrom = new Map<string, string>()
  const traces: SearchTrace[] = []
  let frontierPeak = stack.length

  while (stack.length > 0) {
    const current = stack.pop()!
    const currentKey = cellKey(current)

    if (sameCell(current, maze.goal)) {
      traces.push({
        current,
        visited: new Set(visited),
        frontier: [...stack],
        path: reconstructPath(cameFrom, maze.start, current),
        label: 'Goal reached by following one corridor deeply',
      })
      break
    }

    const neighbors = getOpenNeighbors(maze, current).reverse()

    for (const neighbor of neighbors) {
      const neighborKey = cellKey(neighbor)

      if (visited.has(neighborKey)) {
        continue
      }

      visited.add(neighborKey)
      cameFrom.set(neighborKey, currentKey)
      stack.push(neighbor)
    }

    frontierPeak = Math.max(frontierPeak, stack.length)
    traces.push({
      current,
      visited: new Set(visited),
      frontier: [...stack],
      path: reconstructPath(cameFrom, maze.start, current),
      label: 'Depth-first search keeps pushing down the newest branch',
    })
  }

  return toResult({
    algorithm: 'dfs',
    title: 'Depth-first search',
    description: 'Fast to run and memory-light, but it does not guarantee the shortest route.',
    traces,
    path: reconstructPath(cameFrom, maze.start, maze.goal),
    frontierPeak,
  })
}

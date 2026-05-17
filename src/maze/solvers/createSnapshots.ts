import { cellKey } from '../coordinates'
import type { AlgorithmId, Coordinate, SolverResult, SolverSnapshot } from '../types'

export type SearchTrace = {
  current: Coordinate
  visited: Set<string>
  frontier: Coordinate[]
  path: Coordinate[]
  label: string
}

export function toResult({
  algorithm,
  title,
  description,
  traces,
  path,
  frontierPeak,
}: {
  algorithm: AlgorithmId
  title: string
  description: string
  traces: SearchTrace[]
  path: Coordinate[]
  frontierPeak: number
}): SolverResult {
  const pathKeys = path.map(cellKey)
  const snapshots: SolverSnapshot[] = traces.map((trace, index) => ({
    id: index,
    current: trace.current,
    visited: [...trace.visited],
    frontier: trace.frontier.map(cellKey),
    path: trace.path.map(cellKey),
    label: trace.label,
  }))

  snapshots.push({
    id: snapshots.length,
    visited: snapshots.at(-1)?.visited ?? [],
    frontier: [],
    path: pathKeys,
    label: path.length > 0 ? `Shortest path found (${path.length} cells)` : 'No path found',
  })

  return {
    algorithm,
    title,
    description,
    snapshots,
    path,
    visitedCount: snapshots.at(-1)?.visited.length ?? 0,
    frontierPeak,
    exploredOrder: traces.map((trace) => trace.current),
  }
}

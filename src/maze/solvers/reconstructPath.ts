import { cellKey, parseCellKey } from '../coordinates'
import type { Coordinate } from '../types'

export function reconstructPath(
  cameFrom: Map<string, string>,
  start: Coordinate,
  goal: Coordinate,
): Coordinate[] {
  const startKey = cellKey(start)
  let cursor = cellKey(goal)
  const path = [parseCellKey(cursor)]

  while (cursor !== startKey) {
    const previous = cameFrom.get(cursor)

    if (!previous) {
      return []
    }

    cursor = previous
    path.push(parseCellKey(cursor))
  }

  return path.reverse()
}

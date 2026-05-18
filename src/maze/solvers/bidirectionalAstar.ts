import { cellKey, manhattanDistance, parseCellKey } from '../coordinates'
import { getOpenNeighbors } from '../grid'
import type { Coordinate, Maze, SolverResult } from '../types'
import type { SearchTrace } from './createSnapshots'
import { toResult } from './createSnapshots'
import { PriorityQueue } from './priorityQueue'
import { reconstructPath } from './reconstructPath'

type SearchSide = {
  frontier: PriorityQueue
  cameFrom: Map<string, string>
  costs: Map<string, number>
  visited: Set<string>
  target: Coordinate
}

function reconstructPartialPath(
  side: SearchSide,
  origin: Coordinate,
  current?: Coordinate,
): Coordinate[] {
  return current ? reconstructPath(side.cameFrom, origin, current) : []
}

function createSide(origin: Coordinate, target: Coordinate): SearchSide {
  const frontier = new PriorityQueue()

  frontier.enqueue(origin, manhattanDistance(origin, target))

  return {
    frontier,
    cameFrom: new Map(),
    costs: new Map([[cellKey(origin), 0]]),
    visited: new Set(),
    target,
  }
}

function expandSide(maze: Maze, side: SearchSide): Coordinate | undefined {
  while (side.frontier.length > 0) {
    const current = side.frontier.dequeue()!
    const currentKey = cellKey(current)

    if (side.visited.has(currentKey)) {
      continue
    }

    side.visited.add(currentKey)

    for (const neighbor of getOpenNeighbors(maze, current)) {
      const neighborKey = cellKey(neighbor)
      const nextCost = (side.costs.get(currentKey) ?? 0) + 1

      if (nextCost >= (side.costs.get(neighborKey) ?? Number.POSITIVE_INFINITY)) {
        continue
      }

      side.costs.set(neighborKey, nextCost)
      side.cameFrom.set(neighborKey, currentKey)
      side.frontier.enqueue(neighbor, nextCost + manhattanDistance(neighbor, side.target))
    }

    return current
  }
}

function combinePath(
  startSide: SearchSide,
  goalSide: SearchSide,
  start: Coordinate,
  goal: Coordinate,
  meetingPoint: Coordinate,
): Coordinate[] {
  const startToMeeting = reconstructPath(startSide.cameFrom, start, meetingPoint)
  const goalToMeeting = reconstructPath(goalSide.cameFrom, goal, meetingPoint)

  if (startToMeeting.length === 0 || goalToMeeting.length === 0) {
    return []
  }

  return [...startToMeeting, ...goalToMeeting.reverse().slice(1)]
}

export function solveWithBidirectionalAstar(maze: Maze): SolverResult {
  const startSide = createSide(maze.start, maze.goal)
  const goalSide = createSide(maze.goal, maze.start)
  const traces: SearchTrace[] = []
  let frontierPeak = startSide.frontier.length + goalSide.frontier.length
  let meetingPoint: Coordinate | undefined

  while (startSide.frontier.length > 0 && goalSide.frontier.length > 0) {
    const fromStart = expandSide(maze, startSide)
    const fromGoal = expandSide(maze, goalSide)
    const visited = new Set([...startSide.visited, ...goalSide.visited])
    const frontier = [...startSide.frontier.snapshot(), ...goalSide.frontier.snapshot()]
    const contact = [...startSide.visited].find((key) => goalSide.visited.has(key))

    frontierPeak = Math.max(frontierPeak, frontier.length)

    if (contact) {
      meetingPoint = parseCellKey(contact)
      traces.push({
        current: meetingPoint,
        currentHeads: [fromStart, fromGoal].filter(Boolean) as Coordinate[],
        visited,
        frontier,
        path: reconstructPath(startSide.cameFrom, maze.start, meetingPoint),
        secondaryPath: reconstructPath(goalSide.cameFrom, maze.goal, meetingPoint),
        label: 'The two A* frontiers met in the maze',
      })
      break
    }

    traces.push({
      current: fromStart ?? fromGoal ?? maze.start,
      currentHeads: [fromStart, fromGoal].filter(Boolean) as Coordinate[],
      visited,
      frontier,
      path: reconstructPartialPath(startSide, maze.start, fromStart),
      secondaryPath: reconstructPartialPath(goalSide, maze.goal, fromGoal),
      label: 'Bidirectional A* previews both searches until the frontiers meet',
    })
  }

  const path = meetingPoint
    ? combinePath(startSide, goalSide, maze.start, maze.goal, meetingPoint)
    : []

  return toResult({
    algorithm: 'bidirectionalAstar',
    title: 'Bidirectional A*',
    description: 'Runs goal-directed searches from the start and finish at the same time.',
    traces,
    path,
    frontierPeak,
  })
}

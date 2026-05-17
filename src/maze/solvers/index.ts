import { solveWithBfs } from './bfs'
import { solveWithDfs } from './dfs'
import { solveWithWeightedSearch } from './weightedSearch'
import type { AlgorithmId, Maze, SolverDefinition, SolverResult } from '../types'

export const solverDefinitions: SolverDefinition[] = [
  {
    id: 'bfs',
    title: 'Breadth-first search',
    shortName: 'BFS',
    description: 'Shortest path through equal-cost corridors.',
    details:
      'BFS explores the maze in layers: every cell one step from the start, then every cell two steps away, and so on. Because every corridor costs the same here, the first time BFS reaches the goal it has found a shortest path.',
    bestFor: 'Unweighted mazes where the shortest route matters.',
    tradeOff: 'It can visit a lot of cells because it spreads evenly in every direction.',
    solve: solveWithBfs,
  },
  {
    id: 'dfs',
    title: 'Depth-first search',
    shortName: 'DFS',
    description: 'A deep exploratory walk that can find long routes quickly.',
    details:
      'DFS commits to the newest branch and follows it until it cannot go farther, then backtracks. It feels like walking a corridor by instinct: very direct, sometimes lucky, but not careful about distance.',
    bestFor: 'Fast exploration when any valid route is enough.',
    tradeOff: 'It does not guarantee the shortest route and can wander deep into the wrong branch.',
    solve: solveWithDfs,
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra',
    shortName: 'Dijkstra',
    description: 'Uniform-cost search, ready for weighted mazes.',
    details:
      'Dijkstra always expands the cheapest known route next. In this app each move costs one, so it behaves similarly to BFS, but the structure is ready for weighted terrain or penalties.',
    bestFor: 'Weighted mazes where different cells or moves have different costs.',
    tradeOff: 'Without a goal-directed heuristic it may still explore broadly before reaching the exit.',
    solve: (maze: Maze) =>
      solveWithWeightedSearch(maze, {
        algorithm: 'dijkstra',
        title: 'Dijkstra',
        description: 'Expands the cheapest known route first.',
        useHeuristic: false,
      }),
  },
  {
    id: 'astar',
    title: 'A* search',
    shortName: 'A*',
    description: 'Uses Manhattan distance to aim the search.',
    details:
      'A* combines the route cost so far with a Manhattan-distance estimate to the goal. That estimate nudges the frontier toward the exit while still preserving optimal paths for this grid.',
    bestFor: 'Finding shortest paths quickly when a useful distance estimate exists.',
    tradeOff: 'Its quality depends on the heuristic; a bad heuristic can remove much of the advantage.',
    solve: (maze: Maze) =>
      solveWithWeightedSearch(maze, {
        algorithm: 'astar',
        title: 'A* search',
        description: 'Balances known route cost with a goal-directed heuristic.',
        useHeuristic: true,
      }),
  },
]

export function solveMaze(maze: Maze, algorithm: AlgorithmId): SolverResult {
  const solver = solverDefinitions.find((definition) => definition.id === algorithm)

  if (!solver) {
    throw new Error(`Unknown solver: ${algorithm}`)
  }

  return solver.solve(maze)
}

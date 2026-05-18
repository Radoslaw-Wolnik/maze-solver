import { solveWithBidirectionalAstar } from './bidirectionalAstar'
import { solveWithBfs } from './bfs'
import { solveWithDeadEndFilling } from './deadEndFilling'
import { solveWithDfs } from './dfs'
import { solveWithFloodFill } from './floodFill'
import { solveWithWallFollower } from './wallFollower'
import { solveWithWeightedSearch } from './weightedSearch'
import type { AlgorithmId, Maze, SolverDefinition, SolverResult } from '../types'

export const solverDefinitions: SolverDefinition[] = [
  {
    id: 'bfs',
    title: 'Breadth-first search',
    shortName: 'BFS',
    category: 'multiHead',
    description: 'Shortest path through equal-cost corridors.',
    details:
      'BFS explores the maze in layers: every cell one step from the start, then every cell two steps away, and so on. Because every corridor costs the same here, the first time BFS reaches the goal it has found a shortest path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Unweighted mazes where the shortest route matters.',
    tradeOff: 'It can visit a lot of cells because it spreads evenly in every direction.',
    solve: solveWithBfs,
  },
  {
    id: 'dfs',
    title: 'Depth-first search',
    shortName: 'DFS',
    category: 'multiHead',
    description: 'A deep exploratory walk that can find long routes quickly.',
    details:
      'DFS commits to the newest branch and follows it until it cannot go farther, then backtracks. It feels like walking a corridor by instinct: very direct, sometimes lucky, but not careful about distance.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Fast exploration when any valid route is enough.',
    tradeOff: 'It does not guarantee the shortest route and can wander deep into the wrong branch.',
    solve: solveWithDfs,
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra',
    shortName: 'Dijkstra',
    category: 'multiHead',
    description: 'Uniform-cost search, ready for weighted mazes.',
    details:
      'Dijkstra always expands the cheapest known route next. In this app each move costs one, so it behaves similarly to BFS, but the structure is ready for weighted terrain or penalties.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
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
    category: 'multiHead',
    description: 'Uses Manhattan distance to aim the search.',
    details:
      'A* combines the route cost so far with a Manhattan-distance estimate to the goal. That estimate nudges the frontier toward the exit while still preserving optimal paths for this grid.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
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
  {
    id: 'bidirectionalAstar',
    title: 'Bidirectional A*',
    shortName: 'Bi-A*',
    category: 'multiHead',
    description: 'Two heuristic frontiers meet in the middle.',
    details:
      'Bidirectional A* launches one search head from the start and one from the goal. Each head still uses Manhattan distance, but the search depth is split between the two sides, which is often much cheaper on large maps.',
    timeComplexity: 'O(b^(d/2)) typical',
    spaceComplexity: 'O(b^(d/2)) typical',
    bestFor: 'Large mazes with known start and goal positions.',
    tradeOff: 'The bookkeeping is more complex, and the win depends on the two searches meeting cleanly.',
    solve: solveWithBidirectionalAstar,
  },
  {
    id: 'floodFill',
    title: 'Flood fill',
    shortName: 'Flood',
    category: 'singleHead',
    description: 'Micromouse-style distance gradient to the goal.',
    details:
      'Flood fill labels cells by distance from the goal, then the mouse advances one cell at a time toward lower numbers. Competition micromice use related variants because the same map can guide both exploration and fast runs.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Micromouse simulations where a local robot follows a compact distance map.',
    tradeOff: 'This version assumes the maze map is already known before the run begins.',
    solve: solveWithFloodFill,
  },
  {
    id: 'wallFollower',
    title: 'Wall follower',
    shortName: 'Wall',
    category: 'singleHead',
    description: 'Right-hand rule with one physical cursor.',
    details:
      'The wall follower keeps one hand on a wall and chooses right, forward, left, then back. Once it reaches the exit, this visualizer loop-erases the walk so you can compare the messy physical run with the cleaned route.',
    timeComplexity: 'O(V) on simply connected mazes',
    spaceComplexity: 'O(1)',
    bestFor: 'Robots with almost no memory in mazes without isolated wall islands.',
    tradeOff: 'The run can take a long tour; pruning only happens after the exit is already found.',
    solve: solveWithWallFollower,
  },
  {
    id: 'deadEndFilling',
    title: 'Dead-end filling',
    shortName: 'Dead ends',
    category: 'singleHead',
    description: 'Simplifies the maze by pruning impossible corridors.',
    details:
      'Dead-end filling repeatedly marks non-goal leaves as unusable. Once every dead end has been filled, the remaining corridor contains the solution route, making it a useful preprocessing idea for maze reasoning.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Perfect mazes or preprocessing passes that reveal the essential corridor.',
    tradeOff: 'It needs enough map knowledge to identify dead ends before committing to the final route.',
    solve: solveWithDeadEndFilling,
  },
]

export function solveMaze(maze: Maze, algorithm: AlgorithmId): SolverResult {
  const solver = solverDefinitions.find((definition) => definition.id === algorithm)

  if (!solver) {
    throw new Error(`Unknown solver: ${algorithm}`)
  }

  return solver.solve(maze)
}

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
    category: 'mapBased',
    description: 'Shortest path through equal-cost corridors.',
    details:
      'BFS keeps a queue of cells to inspect and expands them in distance layers: all cells one move away, then two moves away, and so on. Because every corridor has the same cost, the first time the wave reaches the exit, that route is guaranteed to be shortest.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Unweighted mazes where shortest route matters.',
    tradeOff: 'Can visit many cells because it spreads evenly.',
    watchFor:
      'The frontier forms a widening wave; the first goal hit gives the route.',
    solve: solveWithBfs,
  },
  {
    id: 'dfs',
    title: 'Depth-first search',
    shortName: 'DFS',
    category: 'mapBased',
    description: 'A deep exploratory walk that can find long routes quickly.',
    details:
      'DFS uses a stack-like memory of choices. It follows the newest branch as far as possible, then backs up when that branch runs out of unvisited neighbors. It can hit the exit quickly in narrow mazes, but it does not compare route lengths while exploring.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Fast exploration when any route is enough.',
    tradeOff: 'No shortest-path guarantee; can dive into bad branches.',
    watchFor:
      'The current cell dives down one corridor, then backs out at dead ends.',
    solve: solveWithDfs,
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra',
    shortName: 'Dijkstra',
    category: 'mapBased',
    description: 'Uniform-cost search, ready for weighted mazes.',
    details:
      'Dijkstra stores the cheapest known cost to each cell and always expands the lowest-cost candidate next. In this maze every move costs one, so its path length matches BFS, but the same structure would handle weighted terrain or penalties.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    bestFor: 'Weighted mazes with different move costs.',
    tradeOff: 'No goal heuristic, so it can still explore broadly.',
    watchFor:
      'Cells are chosen by lowest known cost; equal costs make a BFS-like wave.',
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
    category: 'mapBased',
    description: 'Uses Manhattan distance to aim the search.',
    details:
      'A* scores each candidate by combining the route cost so far with a Manhattan-distance estimate to the exit. The estimate pulls the frontier toward the goal, while the cost-so-far check keeps the route optimal for this grid.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    bestFor: 'Shortest paths with a good distance estimate.',
    tradeOff: 'Depends on heuristic quality.',
    watchFor:
      'The frontier leans toward the exit while keeping alternatives open.',
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
    category: 'mapBased',
    description: 'Two heuristic frontiers meet in the middle.',
    details:
      'Bidirectional A* runs two guided searches at the same time: one from the start and one from the goal. When the explored regions touch, the solver stitches the two partial routes together. Splitting the depth can reduce work dramatically on larger mazes.',
    timeComplexity: 'O(b^(d/2)) typical',
    spaceComplexity: 'O(b^(d/2)) typical',
    bestFor: 'Large mazes with known start and goal.',
    tradeOff: 'More bookkeeping; benefit depends on meeting cleanly.',
    watchFor:
      'Two fronts grow from opposite ends until their explored regions connect.',
    solve: solveWithBidirectionalAstar,
  },
  {
    id: 'floodFill',
    title: 'Flood fill',
    shortName: 'Flood',
    category: 'mapBased',
    description: 'Distance labels spread from the goal, then guide the route.',
    details:
      'Flood fill first spreads distance labels outward from the goal, giving each reachable cell a number. After the labels are built, solving is simple: start at the entrance and repeatedly step into a neighboring cell with a smaller distance label.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Mazes where distance labels can guide the route.',
    tradeOff: 'Labels reachable space before walking.',
    watchFor:
      'Labels spread from the goal; the route follows decreasing distances.',
    solve: solveWithFloodFill,
  },
  {
    id: 'wallFollower',
    title: 'Wall follower',
    shortName: 'Wall',
    category: 'localWalker',
    description: 'Right-hand rule with one physical cursor.',
    details:
      'Wall follower behaves like a tiny robot with almost no map memory. It keeps one hand on the wall and tries right, forward, left, then back. This works well in simply connected mazes, but the raw walk can loop around before the visualizer cleans it up.',
    timeComplexity: 'O(V) on simply connected mazes',
    spaceComplexity: 'O(1)',
    bestFor: 'Tiny-memory robots in simply connected mazes.',
    tradeOff: 'Can take a long tour before cleanup.',
    watchFor:
      'It turns right when possible; the trail may be messy before cleanup.',
    solve: solveWithWallFollower,
  },
  {
    id: 'deadEndFilling',
    title: 'Dead-end filling',
    shortName: 'Dead ends',
    category: 'mapBased',
    description: 'Simplifies the maze by pruning impossible corridors.',
    details:
      'Dead-end filling reasons from the maze shape instead of walking from the start. It repeatedly removes dead-end corridors that cannot contain the goal. Once those branches are pruned away, the remaining connected corridor contains the solution path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Known mazes where pruning can reveal the route.',
    tradeOff: 'Needs map knowledge before committing.',
    watchFor:
      'Dead ends disappear first, leaving the useful corridor behind.',
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

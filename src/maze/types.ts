export type AlgorithmCategory = 'multiHead' | 'singleHead'

export type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'bidirectionalAstar'
  | 'floodFill'
  | 'wallFollower'
  | 'deadEndFilling'

export type Direction = 'north' | 'east' | 'south' | 'west'

export type Coordinate = {
  row: number
  col: number
}

export type CellWalls = Record<Direction, boolean>

export type MazeCell = Coordinate & {
  walls: CellWalls
}

export type Maze = {
  rows: number
  cols: number
  cells: MazeCell[][]
  start: Coordinate
  goal: Coordinate
}

export type SolverSnapshot = {
  id: number
  current?: Coordinate
  currentHeads?: Coordinate[]
  visited: string[]
  frontier: string[]
  path: string[]
  label: string
}

export type SolverResult = {
  algorithm: AlgorithmId
  title: string
  description: string
  snapshots: SolverSnapshot[]
  path: Coordinate[]
  visitedCount: number
  frontierPeak: number
  exploredOrder: Coordinate[]
}

export type SolverDefinition = {
  id: AlgorithmId
  title: string
  shortName: string
  category: AlgorithmCategory
  description: string
  details: string
  timeComplexity: string
  spaceComplexity: string
  bestFor: string
  tradeOff: string
  solve: (maze: Maze) => SolverResult
}

export type AlgorithmId = 'bfs' | 'dfs' | 'dijkstra' | 'astar'

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
  description: string
  details: string
  bestFor: string
  tradeOff: string
  solve: (maze: Maze) => SolverResult
}

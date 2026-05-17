import { describe, expect, it } from 'vitest'
import { generateMaze } from '../generateMaze'
import { solverDefinitions } from '.'

describe('maze solvers', () => {
  it('finds a route from start to goal for every algorithm', () => {
    const maze = generateMaze({ rows: 13, cols: 13, seed: 42 })

    for (const solver of solverDefinitions) {
      const result = solver.solve(maze)

      expect(result.path.length).toBeGreaterThan(0)
      expect(result.path[0]).toEqual(maze.start)
      expect(result.path.at(-1)).toEqual(maze.goal)
      expect(result.snapshots.length).toBeGreaterThan(1)
    }
  })

  it('keeps optimal algorithms on the same shortest path length', () => {
    const maze = generateMaze({ rows: 17, cols: 17, seed: 256 })
    const pathLengths = ['bfs', 'dijkstra', 'astar'].map((id) => {
      const solver = solverDefinitions.find((definition) => definition.id === id)!

      return solver.solve(maze).path.length
    })

    expect(new Set(pathLengths).size).toBe(1)
  })

  it('emits a visible route trail during solving', () => {
    const maze = generateMaze({ rows: 11, cols: 11, seed: 99 })
    const result = solverDefinitions[0].solve(maze)
    const solvingFrame = result.snapshots.find((snapshot) => snapshot.path.length > 1)

    expect(solvingFrame).toBeDefined()
    expect(result.snapshots.at(-1)?.path.length).toBe(result.path.length)
  })
})

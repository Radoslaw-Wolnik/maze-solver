import clsx from 'clsx'
import { cellKey, sameCell } from '../maze/coordinates'
import type { Maze, SolverSnapshot } from '../maze/types'

type MazeBoardProps = {
  maze: Maze
  snapshot: SolverSnapshot
}

export function MazeBoard({ maze, snapshot }: MazeBoardProps) {
  const visited = new Set(snapshot.visited)
  const frontier = new Set(snapshot.frontier)
  const path = new Set(snapshot.path)
  const secondaryPath = new Set(snapshot.secondaryPath ?? [])
  const current = snapshot.current ? cellKey(snapshot.current) : undefined
  const currentHeads = new Set(snapshot.currentHeads?.map(cellKey) ?? [])

  return (
    <div className="maze-board-viewport flex h-full min-h-0 min-w-0 items-center justify-center overflow-hidden">
      <div className="maze-board-frame">
        <div
          className="grid h-full w-full min-w-0 overflow-hidden rounded-md bg-zinc-100"
          style={{
            gridTemplateColumns: `repeat(${maze.cols}, minmax(0, 1fr))`,
            aspectRatio: `${maze.cols} / ${maze.rows}`,
          }}
        >
          {maze.cells.flat().map((cell) => {
            const key = cellKey(cell)
            const isStart = sameCell(cell, maze.start)
            const isGoal = sameCell(cell, maze.goal)
            const isCurrent = current === key
            const isCandidateHead =
              (frontier.has(key) || currentHeads.has(key)) && !isCurrent

            return (
              <div
                key={key}
                className={clsx(
                  'maze-cell relative min-h-0 transition-colors duration-150',
                  cell.walls.north && 'maze-cell-wall-north',
                  cell.walls.east && 'maze-cell-wall-east',
                  cell.walls.south && 'maze-cell-wall-south',
                  cell.walls.west && 'maze-cell-wall-west',
                  isCandidateHead
                    ? 'bg-yellow-200'
                    : visited.has(key) && 'bg-sky-100',
                )}
              >
                {secondaryPath.has(key) && !isStart && !isGoal && (
                  <span className="maze-marker maze-marker-secondary" />
                )}
                {path.has(key) && !isStart && !isGoal && (
                  <span className="maze-marker maze-marker-path" />
                )}
                {isCurrent && !isStart && !isGoal && (
                  <span className="maze-marker maze-marker-current" />
                )}
                {(isStart || isGoal) && (
                  <span
                    className={clsx(
                      'maze-terminal-marker',
                      isStart ? 'bg-emerald-700' : 'bg-rose-600',
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

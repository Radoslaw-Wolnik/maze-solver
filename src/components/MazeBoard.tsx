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
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <div
        className="grid overflow-hidden rounded-md bg-zinc-100"
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
                'relative min-h-0 transition-colors duration-150',
                isCandidateHead
                  ? 'bg-yellow-200'
                  : visited.has(key) && 'bg-sky-100',
              )}
              style={{
                borderTop: cell.walls.north
                  ? '2px solid #18181b'
                  : '2px solid rgba(212, 212, 216, 0.4)',
                borderRight: cell.walls.east
                  ? '2px solid #18181b'
                  : '2px solid rgba(212, 212, 216, 0.4)',
                borderBottom: cell.walls.south
                  ? '2px solid #18181b'
                  : '2px solid rgba(212, 212, 216, 0.4)',
                borderLeft: cell.walls.west
                  ? '2px solid #18181b'
                  : '2px solid rgba(212, 212, 216, 0.4)',
              }}
            >
              {secondaryPath.has(key) && !isStart && !isGoal && (
                <span className="absolute inset-[28%] rounded-full bg-emerald-700/70 shadow-[0_0_0_1px_rgba(4,120,87,0.2)]" />
              )}
              {path.has(key) && !isStart && !isGoal && (
                <span className="absolute inset-[18%] rounded-full bg-emerald-500/75 shadow-[0_0_0_1px_rgba(4,120,87,0.25)]" />
              )}
              {isCurrent && !isStart && !isGoal && (
                <span className="absolute inset-[22%] z-10 rounded-full bg-violet-600 shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_0_4px_rgba(109,40,217,0.35)]" />
              )}
              {(isStart || isGoal) && (
                <span
                  className={clsx(
                    'absolute inset-1 z-20 rounded-[2px]',
                    isStart ? 'bg-emerald-700' : 'bg-rose-600',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

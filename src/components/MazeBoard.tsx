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
  const walkedTrail = new Set(snapshot.walkedTrail ?? [])
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

          return (
            <div
              key={key}
              className={clsx(
                'relative min-h-0 transition-colors duration-150',
                visited.has(key) && 'bg-sky-100',
                frontier.has(key) && 'bg-amber-200',
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
              {walkedTrail.has(key) && !isStart && !isGoal && (
                <span className="absolute inset-[34%] rounded-sm bg-teal-600/45" />
              )}
              {secondaryPath.has(key) && !isStart && !isGoal && (
                <span className="absolute inset-x-[30%] inset-y-[18%] rounded-sm bg-violet-600/65" />
              )}
              {path.has(key) && !isStart && !isGoal && (
                <span className="absolute inset-[18%] rounded-sm bg-emerald-600/75 shadow-[0_0_0_1px_rgba(4,120,87,0.25)]" />
              )}
              {(current === key || currentHeads.has(key)) && (
                <span className="absolute inset-0 z-10 rounded-[2px] ring-2 ring-inset ring-white shadow-[inset_0_0_0_3px_rgba(5,150,105,0.9)]" />
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

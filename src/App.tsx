import { useMemo, useState } from 'react'
import { AlgorithmTabs } from './components/AlgorithmTabs'
import { AlgorithmDetails } from './components/AlgorithmDetails'
import { ComparisonTable } from './components/ComparisonTable'
import { MazeBoard } from './components/MazeBoard'
import { PlaybackControls } from './components/PlaybackControls'
import { StatsPanel } from './components/StatsPanel'
import { usePlayback } from './hooks/usePlayback'
import { generateMaze } from './maze/generateMaze'
import { solverDefinitions } from './maze/solvers'
import type { AlgorithmId } from './maze/types'

function App() {
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('astar')
  const [size, setSize] = useState(21)
  const [seed, setSeed] = useState(20260517)
  const [speedLevel, setSpeedLevel] = useState(8)

  const maze = useMemo(
    () => generateMaze({ rows: size, cols: size, seed }),
    [seed, size],
  )

  const results = useMemo(
    () => solverDefinitions.map((solver) => solver.solve(maze)),
    [maze],
  )

  const selectedResult =
    results.find((result) => result.algorithm === algorithm) ?? results[0]
  const selectedDefinition =
    solverDefinitions.find((definition) => definition.id === algorithm) ??
    solverDefinitions[0]

  const playback = usePlayback({
    frameCount: selectedResult.snapshots.length,
    speed: 255 - speedLevel * 24,
    resetKey: `${algorithm}-${seed}-${size}`,
  })

  const snapshot =
    selectedResult.snapshots[
      Math.min(playback.frame, selectedResult.snapshots.length - 1)
    ]

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-6">
        <section className="grid gap-5">
          <header className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Maze Solver
            </p>
            <div className="mt-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-normal text-zinc-950 md:text-5xl">
                  Algorithm explorer
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
                  Generate a perfect maze, choose a strategy, and watch the
                  visited cells, queued candidates, active head, route previews,
                  and final route appear frame by frame.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-md bg-sky-100 px-3 py-2 text-sky-800">
                  visited
                </span>
                <span className="rounded-md bg-yellow-200 px-3 py-2 text-yellow-950">
                  queued candidate
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-zinc-800 ring-1 ring-zinc-200">
                  <span className="h-3 w-3 rounded-[2px] bg-emerald-500" />
                  start route
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-zinc-800 ring-1 ring-zinc-200">
                  <span className="h-3 w-3 rounded-full bg-violet-600 shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_0_3px_rgba(109,40,217,0.3)]" />
                  current cell
                </span>
              </div>
            </div>
          </header>

          <AlgorithmTabs
            algorithms={solverDefinitions}
            selected={algorithm}
            onSelect={setAlgorithm}
          />

          <MazeBoard maze={maze} snapshot={snapshot} />
        </section>

        <aside className="grid content-start gap-5">
          <StatsPanel result={selectedResult} snapshot={snapshot} />
          <PlaybackControls
            isPlaying={playback.isPlaying}
            progress={playback.progress}
            speedLevel={speedLevel}
            size={size}
            frame={playback.frame}
            frameCount={selectedResult.snapshots.length}
            onPlay={playback.play}
            onPause={playback.pause}
            onReset={playback.reset}
            onStep={playback.step}
            onRegenerate={() => setSeed((current) => current + 7919)}
            onSpeedChange={setSpeedLevel}
            onSizeChange={setSize}
          />
          <ComparisonTable
            results={results}
            selected={algorithm}
            onSelect={setAlgorithm}
          />
          <AlgorithmDetails algorithm={selectedDefinition} />
        </aside>
      </div>
    </main>
  )
}

export default App

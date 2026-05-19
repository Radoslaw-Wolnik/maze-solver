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
    <main className="min-h-screen bg-maze-page p-3 text-zinc-900 lg:h-screen lg:overflow-hidden">
      <div className="app-shell mx-auto grid w-full max-w-[1840px] gap-3 p-3 lg:h-full lg:grid-rows-[auto_minmax(0,1fr)]">
        <header className="grid gap-3 border-b border-zinc-200 pb-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Maze Solver
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h1 className="text-3xl font-bold tracking-normal text-zinc-950">
                Algorithm explorer
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-md bg-sky-100 px-3 py-2 text-sky-800">
              visited
            </span>
            <span className="rounded-md bg-yellow-200 px-3 py-2 text-yellow-950">
              queued
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-zinc-800 ring-1 ring-zinc-200">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              route
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-zinc-800 ring-1 ring-zinc-200">
              <span className="maze-current-ring h-3 w-3 rounded-full bg-violet-600" />
              current
            </span>
          </div>
        </header>

        <div className="grid min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(310px,340px)_minmax(0,1fr)_minmax(420px,460px)]">
          <section className="grid min-h-0 min-w-0 content-start overflow-visible">
            <AlgorithmTabs
              algorithms={solverDefinitions}
              selected={algorithm}
              onSelect={setAlgorithm}
            />
            <div className="mt-3 hidden 2xl:block">
              <ComparisonTable
                results={results}
                selected={algorithm}
                onSelect={setAlgorithm}
              />
            </div>
          </section>

          <section className="min-h-[360px] min-w-0 overflow-hidden lg:min-h-0">
            <MazeBoard maze={maze} snapshot={snapshot} />
          </section>

          <aside className="grid min-h-0 min-w-0 content-start gap-3 overflow-auto pr-1">
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
            <AlgorithmDetails algorithm={selectedDefinition} />
          </aside>
        </div>
        <div className="lg:hidden">
          <ComparisonTable
            results={results}
            selected={algorithm}
            onSelect={setAlgorithm}
          />
        </div>
      </div>
    </main>
  )
}

export default App

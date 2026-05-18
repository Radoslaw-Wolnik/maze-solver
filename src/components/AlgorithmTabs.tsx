import clsx from 'clsx'
import type { AlgorithmId, SolverDefinition } from '../maze/types'

type AlgorithmTabsProps = {
  algorithms: SolverDefinition[]
  selected: AlgorithmId
  onSelect: (algorithm: AlgorithmId) => void
}

export function AlgorithmTabs({
  algorithms,
  selected,
  onSelect,
}: AlgorithmTabsProps) {
  return (
    <section className="grid content-start gap-2">
      <div>
        <h2 className="text-sm font-semibold text-zinc-950">Algorithms</h2>
        <p className="text-xs leading-5 text-zinc-500">
          Select an algorithm and watch how it works through the maze.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {algorithms.map((algorithm) => (
          <button
            key={algorithm.id}
            type="button"
            onClick={() => onSelect(algorithm.id)}
            className={clsx(
              'rounded-md border px-3 py-3 text-left transition',
              selected === algorithm.id
                ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100',
            )}
          >
            <span className="block text-sm font-semibold">
              {algorithm.shortName}
            </span>
            <span
              className={clsx(
                'mt-1 block text-xs leading-4',
                selected === algorithm.id ? 'text-zinc-300' : 'text-zinc-500',
              )}
            >
              {algorithm.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

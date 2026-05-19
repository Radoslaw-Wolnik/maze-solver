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
    <section className="grid min-w-0 content-start gap-2">
      <div className="grid min-w-0 grid-cols-2 gap-2">
        {algorithms.map((algorithm) => (
          <button
            key={algorithm.id}
            type="button"
            onClick={() => onSelect(algorithm.id)}
            className={clsx(
              'min-w-0 rounded-md border px-3 py-2 text-left transition',
              selected === algorithm.id
                ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100',
            )}
          >
            <span className="block truncate text-sm font-semibold">
              {algorithm.shortName}
            </span>
            <span
              className={clsx(
                'mt-0.5 block line-clamp-2 text-xs leading-4',
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

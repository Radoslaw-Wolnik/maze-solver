import clsx from 'clsx'
import type { AlgorithmCategory, AlgorithmId, SolverDefinition } from '../maze/types'

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
  const groups: Array<{
    category: AlgorithmCategory
    title: string
    description: string
  }> = [
    {
      category: 'multiHead',
      title: 'Multi-head / global map',
      description: 'Several candidates or frontiers can be evaluated at once.',
    },
    {
      category: 'singleHead',
      title: 'Single-head / micromouse',
      description: 'One active cursor moves through the maze step by step.',
    },
  ]

  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <section key={group.category} className="grid gap-2">
          <div>
            <h2 className="text-sm font-semibold text-zinc-950">{group.title}</h2>
            <p className="text-xs leading-5 text-zinc-500">{group.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {algorithms
              .filter((algorithm) => algorithm.category === group.category)
              .map((algorithm) => (
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
      ))}
    </div>
  )
}

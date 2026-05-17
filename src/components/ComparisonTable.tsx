import clsx from 'clsx'
import type { AlgorithmId, SolverResult } from '../maze/types'

type ComparisonTableProps = {
  results: SolverResult[]
  selected: AlgorithmId
  onSelect: (algorithm: AlgorithmId) => void
}

export function ComparisonTable({
  results,
  selected,
  onSelect,
}: ComparisonTableProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Algorithm comparison</h2>
      <div className="mt-4 overflow-hidden rounded-md border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2">Solver</th>
              <th className="px-3 py-2">Visited</th>
              <th className="px-3 py-2">Path</th>
              <th className="px-3 py-2">Frames</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.algorithm}
                className={clsx(
                  'border-t border-zinc-200 transition',
                  selected === result.algorithm && 'bg-emerald-50',
                )}
              >
                <td className="p-0">
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left font-medium text-zinc-900 hover:bg-zinc-100"
                    onClick={() => onSelect(result.algorithm)}
                  >
                    {result.title}
                  </button>
                </td>
                <td className="p-0">
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-zinc-600 hover:bg-zinc-100"
                    onClick={() => onSelect(result.algorithm)}
                  >
                    {result.visitedCount}
                  </button>
                </td>
                <td className="p-0">
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-zinc-600 hover:bg-zinc-100"
                    onClick={() => onSelect(result.algorithm)}
                  >
                    {result.path.length}
                  </button>
                </td>
                <td className="p-0">
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-zinc-600 hover:bg-zinc-100"
                    onClick={() => onSelect(result.algorithm)}
                  >
                    {result.snapshots.length}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

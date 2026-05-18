import { Activity, LocateFixed, Route } from 'lucide-react'
import type { SolverResult, SolverSnapshot } from '../maze/types'

type StatsPanelProps = {
  result: SolverResult
  snapshot: SolverSnapshot
}

export function StatsPanel({ result, snapshot }: StatsPanelProps) {
  const displayLabel =
    result.snapshots.find(
      (candidate) =>
        !candidate.label.startsWith('Shortest path found') &&
        candidate.label !== 'No path found',
    )?.label ?? snapshot.label

  const stats = [
    {
      label: 'Visited',
      value: snapshot.visited.length,
      icon: Activity,
    },
    {
      label: 'Path length',
      value: result.path.length,
      icon: Route,
    },
    {
      label: 'Frontier peak',
      value: result.frontierPeak,
      icon: LocateFixed,
    },
  ]

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-3">
      <h2 className="text-xl font-semibold leading-6 text-zinc-950">
        {result.title}
      </h2>
      <p className="mt-1 text-sm font-medium text-fuchsia-700">
        {displayLabel}
      </p>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-zinc-100 p-2.5">
            <stat.icon className="mb-1 text-zinc-500" size={16} />
            <p className="text-lg font-semibold text-zinc-950">{stat.value}</p>
            <p className="text-xs leading-4 text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

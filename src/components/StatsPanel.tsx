import { Activity, LocateFixed, Route } from 'lucide-react'
import type { SolverResult, SolverSnapshot } from '../maze/types'

type StatsPanelProps = {
  result: SolverResult
  snapshot: SolverSnapshot
}

export function StatsPanel({ result, snapshot }: StatsPanelProps) {
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
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-fuchsia-700">{result.title}</p>
      <h2 className="mt-1 text-xl font-semibold text-zinc-950">
        {snapshot.label}
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{result.description}</p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-zinc-100 p-3">
            <stat.icon className="mb-2 text-zinc-500" size={16} />
            <p className="text-lg font-semibold text-zinc-950">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

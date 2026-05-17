import { Lightbulb, Scale, Target } from 'lucide-react'
import type { SolverDefinition } from '../maze/types'

type AlgorithmDetailsProps = {
  algorithm: SolverDefinition
}

export function AlgorithmDetails({ algorithm }: AlgorithmDetailsProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-sky-700">Current algorithm</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-950">
        {algorithm.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{algorithm.details}</p>

      <div className="mt-4 grid gap-3">
        <div className="rounded-md bg-sky-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-900">
            <Target size={16} />
            Best for
          </div>
          <p className="mt-1 text-sm leading-5 text-sky-900">
            {algorithm.bestFor}
          </p>
        </div>
        <div className="rounded-md bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-950">
            <Scale size={16} />
            Trade-off
          </div>
          <p className="mt-1 text-sm leading-5 text-amber-950">
            {algorithm.tradeOff}
          </p>
        </div>
        <div className="rounded-md bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
            <Lightbulb size={16} />
            What to watch
          </div>
          <p className="mt-1 text-sm leading-5 text-emerald-950">
            Follow the green trail to see the route this algorithm currently
            believes is promising.
          </p>
        </div>
      </div>
    </section>
  )
}

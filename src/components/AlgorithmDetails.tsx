import { Lightbulb, Scale, Target } from 'lucide-react'
import type { SolverDefinition } from '../maze/types'

type AlgorithmDetailsProps = {
  algorithm: SolverDefinition
}

export function AlgorithmDetails({ algorithm }: AlgorithmDetailsProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-3">
      <h2 className="text-base font-semibold text-zinc-950">How it works</h2>
      <p className="mt-2 text-sm leading-5 text-zinc-600">
        {algorithm.details}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-sky-50 px-2 py-1.5">
          <div className="flex items-center gap-2 font-semibold text-sky-900">
            <Target size={15} />
            Best
          </div>
          <p className="mt-0.5 leading-4 text-sky-900">
            {algorithm.bestFor}
          </p>
        </div>
        <div className="rounded-md bg-amber-50 px-2 py-1.5">
          <div className="flex items-center gap-2 font-semibold text-amber-950">
            <Scale size={15} />
            Trade
          </div>
          <p className="mt-0.5 leading-4 text-amber-950">
            {algorithm.tradeOff}
          </p>
        </div>
        <div className="col-span-2 rounded-md bg-emerald-50 px-2 py-1.5">
          <div className="flex items-center gap-2 font-semibold text-emerald-950">
            <Lightbulb size={15} />
            Watch
          </div>
          <p className="mt-0.5 leading-4 text-emerald-950">
            {algorithm.watchFor}
          </p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-zinc-100 px-2 py-1.5">
          <span className="block font-semibold uppercase text-zinc-500">
            Time
          </span>
          <span className="font-medium text-zinc-950">
            {algorithm.timeComplexity}
          </span>
        </div>
        <div className="rounded-md bg-zinc-100 px-2 py-1.5">
          <span className="block font-semibold uppercase text-zinc-500">
            Space
          </span>
          <span className="font-medium text-zinc-950">
            {algorithm.spaceComplexity}
          </span>
        </div>
      </div>
      <p className="mt-1 text-xs leading-4 text-zinc-500">
        V = cells, E = passages, b = choices per step, d = solution length.
      </p>
    </section>
  )
}

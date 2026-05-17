import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipForward,
  StepForward,
} from 'lucide-react'

type PlaybackControlsProps = {
  isPlaying: boolean
  progress: number
  speedLevel: number
  size: number
  frame: number
  frameCount: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStep: () => void
  onRegenerate: () => void
  onSpeedChange: (speedLevel: number) => void
  onSizeChange: (size: number) => void
}

export function PlaybackControls({
  isPlaying,
  progress,
  speedLevel,
  size,
  frame,
  frameCount,
  onPlay,
  onPause,
  onReset,
  onStep,
  onRegenerate,
  onSpeedChange,
  onSizeChange,
}: PlaybackControlsProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-white transition hover:bg-zinc-800"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 transition hover:bg-zinc-100"
          onClick={onStep}
          aria-label="Step forward"
          title="Step forward"
        >
          <StepForward size={18} />
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 transition hover:bg-zinc-100"
          onClick={onReset}
          aria-label="Reset animation"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
          onClick={onRegenerate}
        >
          <Shuffle size={16} />
          New maze
        </button>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          <span className="flex items-center gap-2">
            <SkipForward size={16} />
            Speed {speedLevel}/10
          </span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={speedLevel}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="range-control range-control-speed"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          <span className="flex items-center gap-2">
            <Shuffle size={16} />
            Maze {size} x {size}
          </span>
          <input
            type="range"
            min="9"
            max="31"
            step="2"
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="range-control range-control-size"
          />
        </label>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Frame {frame + 1} of {frameCount}
      </p>
    </section>
  )
}

import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipForward,
  StepForward,
} from 'lucide-react'
import type { CSSProperties } from 'react'

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

function rangePercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100
}

function rangeStyle(percent: number) {
  return {
    '--range-progress': `${percent}%`,
  } as CSSProperties
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
  const speedPercent = rangePercent(speedLevel, 1, 10)
  const sizePercent = rangePercent(size, 9, 31)

  return (
    <section className="app-panel">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="control-button control-button-icon control-button-primary"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="control-button control-button-icon control-button-secondary"
          onClick={onStep}
          aria-label="Step forward"
          title="Step forward"
        >
          <StepForward size={18} />
        </button>
        <button
          type="button"
          className="control-button control-button-icon control-button-secondary"
          onClick={onReset}
          aria-label="Reset animation"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          className="control-button control-button-label control-button-secondary"
          onClick={onRegenerate}
        >
          <Shuffle size={16} />
          New maze
        </button>
      </div>

      <div className="relative mb-3 h-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 shadow-inner">
        <div
          className="absolute inset-y-0 right-0 bg-zinc-100 transition-all"
          style={{ width: `${100 - progress}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
            style={rangeStyle(speedPercent)}
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
            style={rangeStyle(sizePercent)}
          />
        </label>
      </div>

      <p className="mt-3 text-sm text-zinc-500">
        Frame {frame + 1} of {frameCount}
      </p>
    </section>
  )
}

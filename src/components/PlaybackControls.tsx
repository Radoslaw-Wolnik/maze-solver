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

type Rgb = {
  red: number
  green: number
  blue: number
}

function rangePercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100
}

function hexToRgb(hex: string): Rgb {
  const value = hex.replace('#', '')

  return {
    red: parseInt(value.slice(0, 2), 16),
    green: parseInt(value.slice(2, 4), 16),
    blue: parseInt(value.slice(4, 6), 16),
  }
}

function gradientColor(start: string, end: string, percent: number) {
  const startRgb = hexToRgb(start)
  const endRgb = hexToRgb(end)
  const ratio = percent / 100
  const mix = (from: number, to: number) => Math.round(from + (to - from) * ratio)

  return `rgb(${mix(startRgb.red, endRgb.red)}, ${mix(startRgb.green, endRgb.green)}, ${mix(startRgb.blue, endRgb.blue)})`
}

function rangeStyle({
  percent,
  start,
  end,
}: {
  percent: number
  start: string
  end: string
}) {
  return {
    '--range-progress': `${percent}%`,
    '--range-start': start,
    '--range-end': end,
    '--thumb-color': gradientColor(start, end, percent),
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
    <section className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white transition hover:bg-zinc-800"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 transition hover:bg-zinc-100"
          onClick={onStep}
          aria-label="Step forward"
          title="Step forward"
        >
          <StepForward size={18} />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 transition hover:bg-zinc-100"
          onClick={onReset}
          aria-label="Reset animation"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
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
            style={rangeStyle({
              percent: speedPercent,
              start: '#bae6fd',
              end: '#2dd4bf',
            })}
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
            style={rangeStyle({
              percent: sizePercent,
              start: '#e4e4e7',
              end: '#38bdf8',
            })}
          />
        </label>
      </div>

      <p className="mt-3 text-sm text-zinc-500">
        Frame {frame + 1} of {frameCount}
      </p>
    </section>
  )
}

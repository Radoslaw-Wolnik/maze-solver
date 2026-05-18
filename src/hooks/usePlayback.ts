import { useEffect, useMemo, useState } from 'react'

type PlaybackOptions = {
  frameCount: number
  speed: number
  resetKey: string
}

export function usePlayback({ frameCount, speed, resetKey }: PlaybackOptions) {
  const [frame, setFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    setFrame(0)
    setIsPlaying(true)
  }, [resetKey])

  useEffect(() => {
    if (!isPlaying || frame >= frameCount - 1) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setFrame((current) => Math.min(current + 1, frameCount - 1))
    }, speed)

    return () => window.clearTimeout(timeoutId)
  }, [frame, frameCount, isPlaying, speed])

  const progress = useMemo(() => {
    if (frameCount <= 1) {
      return 100
    }

    return Math.round((frame / (frameCount - 1)) * 100)
  }, [frame, frameCount])

  return {
    frame,
    isPlaying,
    progress,
    pause: () => setIsPlaying(false),
    play: () => setIsPlaying(true),
    reset: () => {
      setFrame(0)
      setIsPlaying(true)
    },
    step: () => {
      setFrame((current) => Math.min(current + 1, frameCount - 1))
      setIsPlaying(false)
    },
  }
}

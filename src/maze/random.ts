export function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export function randomInt(random: () => number, maxExclusive: number): number {
  return Math.floor(random() * maxExclusive)
}

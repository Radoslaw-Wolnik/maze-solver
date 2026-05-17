import { cellKey } from '../coordinates'
import type { Coordinate } from '../types'

type QueueItem = {
  cell: Coordinate
  priority: number
}

export class PriorityQueue {
  private readonly items: QueueItem[] = []

  get length() {
    return this.items.length
  }

  enqueue(cell: Coordinate, priority: number) {
    this.items.push({ cell, priority })
    this.items.sort((left, right) => left.priority - right.priority)
  }

  dequeue(): Coordinate | undefined {
    return this.items.shift()?.cell
  }

  snapshot(): Coordinate[] {
    return this.items.map((item) => item.cell)
  }

  has(cell: Coordinate): boolean {
    const key = cellKey(cell)

    return this.items.some((item) => cellKey(item.cell) === key)
  }
}

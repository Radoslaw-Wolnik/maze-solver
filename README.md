# Maze Solver · Algorithm Explorer

A polished React + TypeScript app for watching classic graph-search algorithms solve generated mazes. The point is not only getting the answer; it is seeing how each algorithm explores the maze, how its frontier grows, and how much work it does before the final path appears.

## What it does

- Generates a perfect maze with a seeded recursive backtracker.
- Animates four solving algorithms frame by frame.
- Highlights visited cells, frontier cells, the current cell, and the final route.
- Lets you change maze size, speed, selected algorithm, and maze seed.
- Compares algorithms side by side with visited count, path length, and frame count.

## Getting started

```bash
npm install
npm run dev
npm run build
npm test
```

The dev server defaults to `http://localhost:5173`.

## The algorithms

### Breadth-first search

Breadth-first search explores the maze in distance layers. In an unweighted maze, the first time it reaches the goal is guaranteed to be through a shortest path. It is dependable and easy to reason about, but the frontier can grow wide.

### Depth-first search

Depth-first search follows one branch as far as it can before backing out. It can find a route quickly in narrow mazes and uses little memory, but it does not guarantee the shortest route.

### Dijkstra

Dijkstra's algorithm expands the cheapest known route first. In this project every corridor has equal cost, so it matches BFS on path length, but the implementation is ready for weighted cells.

### A* search

A* adds a Manhattan-distance heuristic to Dijkstra's cost model. It still finds an optimal path for this maze setup, but it usually reaches the goal with fewer explored cells because it has a sense of direction.

## Code structure

`src/maze/` contains pure maze logic with no React dependency. `generateMaze.ts` creates perfect mazes, `grid.ts` handles wall and neighbor operations, and `solvers/` contains the BFS, DFS, Dijkstra, and A* implementations.

`src/components/` contains the UI: maze rendering, playback controls, algorithm tabs, stats, and comparison table.

`src/hooks/` contains reusable React state for animation playback.

## Built with

React, TypeScript, Vite, Tailwind CSS, Lucide icons, Vitest.

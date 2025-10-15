# Dependency Mapping Tool

A modern, interactive web application for visualizing and analyzing dependency graphs with topological sorting capabilities.

![Dependency Mapping Tool](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue) ![Vite](https://img.shields.io/badge/Vite-5+-purple)

## ✨ Features

- 📝 **Multiple Input Methods**: Direct text input, file import, and export capabilities
- 🎨 **Interactive Visualization**: Drag, zoom, and pan through dependency graphs
- 🔄 **Topological Sorting**: Automatic dependency resolution with cycle detection
- 📤 **Export Functionality**: Export both graph data and sorted results
- 🎯 **Modern UI**: Clean, minimalist design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to project directory
cd depender

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📖 Usage Guide

### Input Format

The tool accepts a two-section format:

```
# Nodes Section
A, B, C, D, E

# Dependencies Section
A -> B
A -> C
B -> D
C -> D
D -> E
```

**Section 1: Nodes**
- Comma-separated list of node identifiers
- Can use any alphanumeric characters
- Example: `Node1, Node2, Task_A, TaskB`

**Section 2: Dependencies**
- One dependency per line
- Format: `Source -> Target`
- Also supports Unicode arrow: `Source → Target`
- Example: `A -> B` means "A depends on B" or "B must come before A"

### Features

#### 1. Direct Text Input
- Type or paste dependency definitions in the left panel
- Changes are reflected in real-time
- Default example provided for quick start

#### 2. File Import
- Click "Import File" button
- Supports `.txt` and `.dep` files
- Automatically parses and visualizes the content

#### 3. Interactive Graph
- **Zoom**: Use mouse wheel or pinch gesture
- **Pan**: Click and drag the background
- **Move Nodes**: Drag individual nodes to rearrange
- **Controls**: Use on-screen controls for zoom and fit-to-view

#### 4. Topological Sorting
- Automatically computed when dependencies change
- Shows linear order respecting all dependencies
- **Cycle Detection**: Warns if circular dependencies exist
- **Flattened Output**: Displays complete sorted sequence

#### 5. Export Options
- **Export Graph**: Download original dependency definitions
- **Export Sort**: Download topological sort result
- Both export as `.txt` files

## 🏗️ Project Structure

```
depender/
├── src/
│   ├── components/
│   │   ├── InputPanel.tsx       # Input interface component
│   │   ├── DependencyGraph.tsx  # ReactFlow visualization
│   │   └── OutputPanel.tsx      # Sorted results display
│   ├── utils/
│   │   ├── parser.ts            # Input parsing logic
│   │   └── topologicalSort.ts   # Kahn's algorithm implementation
│   ├── types.ts                 # TypeScript type definitions
│   ├── App.tsx                  # Main application component
│   └── index.css                # Tailwind CSS imports
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Graph Visualization**: ReactFlow (@xyflow/react)
- **Styling**: Tailwind CSS
- **Algorithm**: Kahn's Topological Sort (BFS-based)

## 📝 Examples

### Simple Linear Dependencies
```
# Nodes Section
Install, Configure, Build, Test, Deploy

# Dependencies Section
Install -> Configure
Configure -> Build
Build -> Test
Test -> Deploy
```

**Result**: `Install → Configure → Build → Test → Deploy`

### Complex Dependencies
```
# Nodes Section
A, B, C, D, E, F

# Dependencies Section
A -> D
B -> D
C -> E
D -> E
E -> F
```

**Result**: One possible order: `A → B → C → D → E → F`

### Circular Dependency (Error Case)
```
# Nodes Section
A, B, C

# Dependencies Section
A -> B
B -> C
C -> A
```

**Result**: ⚠️ Cycle detected! No valid topological sort exists.

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## 🎯 Algorithm Details

The tool uses **Kahn's Algorithm** for topological sorting:

1. Calculate in-degree for each node
2. Add all nodes with in-degree 0 to queue
3. Process queue:
   - Remove node from queue
   - Add to sorted list
   - Reduce in-degree of neighbors
   - Add neighbors with in-degree 0 to queue
4. If sorted list contains all nodes → success
5. Otherwise → cycle detected

**Time Complexity**: O(V + E) where V = nodes, E = edges
**Space Complexity**: O(V + E)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [ReactFlow](https://reactflow.dev/) - Powerful graph visualization library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

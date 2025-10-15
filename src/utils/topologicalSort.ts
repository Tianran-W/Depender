import type { DependencyEdge, TopologicalSortResult } from '../types';

/**
 * Perform topological sort using Kahn's algorithm (BFS-based)
 * Returns sorted array and cycle detection flag
 */
export function topologicalSort(
  nodes: string[],
  edges: DependencyEdge[]
): TopologicalSortResult {
  // Build adjacency list and in-degree map
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize all nodes
  nodes.forEach(node => {
    adjacency.set(node, []);
    inDegree.set(node, 0);
  });

  // Build graph
  edges.forEach(edge => {
    const fromList = adjacency.get(edge.from) || [];
    fromList.push(edge.to);
    adjacency.set(edge.from, fromList);
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  // Find all nodes with in-degree 0
  const queue: string[] = [];
  inDegree.forEach((degree, node) => {
    if (degree === 0) {
      queue.push(node);
    }
  });

  const sorted: string[] = [];

  // Process queue
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    // Reduce in-degree for neighbors
    const neighbors = adjacency.get(current) || [];
    neighbors.forEach(neighbor => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Check for cycles
  const hasCycle = sorted.length !== nodes.length;

  return { sorted, hasCycle };
}

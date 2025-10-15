export interface DependencyNode {
  id: string;
  label: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export interface ParsedInput {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface TopologicalSortResult {
  sorted: string[];
  hasCycle: boolean;
}

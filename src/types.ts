export interface DependencyNode {
  id: string;
  label: string;
  description?: string;
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

// YAML input format interfaces
export interface YamlNodeDefinition {
  id: string;
  title: string;
  description?: string;
  dependencies?: string[]; // 新增：节点依赖的其他节点ID列表
}

export interface YamlInputFormat {
  nodes: YamlNodeDefinition[];
  dependencies?: string[]; // 保持向后兼容，现在是可选的
}

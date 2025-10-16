import yaml from 'js-yaml';
import type { ParsedInput, YamlInputFormat } from '../types';

/**
 * Parse YAML format input
 * Expected format:
 * nodes:
 *   - id: "1"
 *     title: "Node A"
 *     description: "Description of A"  # Optional
 *     dependencies: ["0"]  # Optional: nodes this one depends on
 *   - id: "2"
 *     title: "Node B"
 *     dependencies: ["1"]
 */
export function parseInput(text: string): ParsedInput {
  try {
    const data = yaml.load(text) as YamlInputFormat;
    
    if (!data || !data.nodes || !Array.isArray(data.nodes)) {
      return { nodes: [], edges: [] };
    }

    const nodes = data.nodes.map(node => ({
      id: node.id,
      label: node.title,
      description: node.description,
    }));

    const edges: { from: string; to: string }[] = [];

    // Check for node-level dependencies
    data.nodes.forEach(node => {
      if (node.dependencies && Array.isArray(node.dependencies)) {
        node.dependencies.forEach(depId => {
          // depId -> node.id (depId is the prerequisite)
          edges.push({ from: depId.trim(), to: node.id });
        });
      }
    });

    // Also check for top-level dependencies (for backward compatibility)
    if (data.dependencies && Array.isArray(data.dependencies)) {
      data.dependencies.forEach(dep => {
        const match = dep.match(/^([^-→]+)(?:->|→)(.+)$/);
        if (match) {
          const from = match[1].trim();
          const to = match[2].trim();
          edges.push({ from, to });
        }
      });
    }

    return { nodes, edges };
  } catch (error) {
    console.error('YAML parsing error:', error);
    return { nodes: [], edges: [] };
  }
}

/**
 * Export parsed data to YAML format
 */
export function exportToYaml(nodes: { id: string; label: string; description?: string }[], edges: { from: string; to: string }[]): string {
  // Group dependencies by target node
  const dependenciesByNode = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!dependenciesByNode.has(edge.to)) {
      dependenciesByNode.set(edge.to, []);
    }
    dependenciesByNode.get(edge.to)!.push(edge.from);
  });

  const yamlData = {
    nodes: nodes.map(node => {
      const nodeDeps = dependenciesByNode.get(node.id);
      return {
        id: node.id,
        title: node.label,
        ...(node.description && { description: node.description }),
        ...(nodeDeps && nodeDeps.length > 0 && { dependencies: nodeDeps }),
      };
    }),
  };
  
  return yaml.dump(yamlData, {
    indent: 2,
    lineWidth: -1,
  });
}

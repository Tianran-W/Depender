import type { ParsedInput } from '../types';

/**
 * Parse the input text following the two-section format:
 * Section 1: Nodes (comma-separated list)
 * Section 2: Dependencies (A -> B format)
 */
export function parseInput(text: string): ParsedInput {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  
  if (lines.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Find the section divider (empty line or "---")
  let sectionDivider = lines.findIndex((line) => {
    // Look for arrow pattern to detect dependencies section
    return line.includes('->') || line.includes('→');
  });

  // If no arrow found, assume first line is nodes, rest are dependencies
  if (sectionDivider === -1) {
    sectionDivider = 1;
  }

  // Parse nodes section
  const nodesText = lines.slice(0, sectionDivider).join(',');
  const nodeIds = nodesText
    .split(',')
    .map(n => n.trim())
    .filter(n => n && !n.includes('->') && !n.includes('→'));

  const nodes = nodeIds.map(id => ({
    id,
    label: id,
  }));

  // Parse dependencies section
  const edges = lines
    .slice(sectionDivider)
    .map(line => {
      // Support both -> and →
      const match = line.match(/^([^-→]+)(?:->|→)(.+)$/);
      if (!match) return null;
      
      const from = match[1].trim();
      const to = match[2].trim();
      
      return { from, to };
    })
    .filter((edge): edge is { from: string; to: string } => edge !== null);

  return { nodes, edges };
}

/**
 * Export parsed data to text format
 */
export function exportToText(nodes: string[], edges: { from: string; to: string }[]): string {
  let output = '# Nodes Section\n';
  output += nodes.join(', ') + '\n\n';
  output += '# Dependencies Section\n';
  edges.forEach(edge => {
    output += `${edge.from} -> ${edge.to}\n`;
  });
  return output;
}

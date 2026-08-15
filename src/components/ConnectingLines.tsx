import React from 'react';
import { GridNodeData, BranchPerspective } from '../types';

interface ConnectingLinesProps {
  nodes: GridNodeData[];
  selectedNodeId?: string | null;
}

const getPerspectiveColor = (mode?: BranchPerspective) => {
  switch (mode) {
    case 'deep-dive':
      return { stroke: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8', label: 'DEEP DIVE' };
    case 'contrarian':
      return { stroke: '#DC2626', bg: '#FEF2F2', text: '#B91C1C', label: 'CONTRARIAN' };
    case 'applications':
      return { stroke: '#059669', bg: '#ECFDF5', text: '#047857', label: 'APPLICATION' };
    case 'timeline':
      return { stroke: '#D97706', bg: '#FFFBEB', text: '#B45309', label: 'TIMELINE' };
    case 'analogy':
      return { stroke: '#7C3AED', bg: '#F5F3FF', text: '#6D28D9', label: 'ANALOGY' };
    case 'synthesis':
      return { stroke: '#0891B2', bg: '#ECFEFF', text: '#0E7490', label: 'SYNTHESIS' };
    default:
      return { stroke: '#64748B', bg: '#F1F5F9', text: '#475569', label: 'EXPLORE' };
  }
};

export const ConnectingLines: React.FC<ConnectingLinesProps> = ({ nodes, selectedNodeId }) => {
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
    >
      <defs>
        <marker
          id="arrow-default"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748B" />
        </marker>
        <marker
          id="arrow-synthesis"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill="#0891B2" />
        </marker>
      </defs>

      {nodes.map(node => {
        // Standard parent-child connection
        if (node.parentId) {
          const parent = nodes.find(n => n.id === node.parentId);
          if (!parent) return null;

          const startX = parent.x + parent.width;
          const startY = parent.y + 240;
          const endX = node.x;
          const endY = node.y + 240;

          const dx = endX - startX;
          const cp1X = startX + Math.max(dx * 0.45, 60);
          const cp1Y = startY;
          const cp2X = endX - Math.max(dx * 0.45, 60);
          const cp2Y = endY;

          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          const isHighlighted = selectedNodeId === node.id || selectedNodeId === parent.id;
          const style = getPerspectiveColor(node.mode);

          return (
            <g key={`line-${node.id}`} className="transition-opacity duration-300">
              {/* Outer soft halo */}
              <path
                d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                fill="none"
                stroke={isHighlighted ? style.stroke : 'rgba(148, 163, 184, 0.3)'}
                strokeWidth={isHighlighted ? 4 : 2}
                strokeLinecap="round"
                className={isHighlighted ? "animate-flow" : ""}
                strokeDasharray={isHighlighted ? "8 6" : "6 4"}
              />
              
              {/* Midpoint perspective badge */}
              {node.mode && node.mode !== 'standard' && (
                <g transform={`translate(${midX - 38}, ${midY - 10})`}>
                  <rect
                    width="76"
                    height="20"
                    rx="10"
                    fill={style.bg}
                    stroke={style.stroke}
                    strokeWidth="1"
                  />
                  <text
                    x="38"
                    y="13"
                    textAnchor="middle"
                    fill={style.text}
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fontWeight="600"
                    letterSpacing="0.05em"
                  >
                    {style.label}
                  </text>
                </g>
              )}
            </g>
          );
        }

        // Dual connection for synthesized nodes
        if (node.synthesizedFrom && node.synthesizedFrom.length === 2) {
          const [parentAId, parentBId] = node.synthesizedFrom;
          const parentA = nodes.find(n => n.id === parentAId);
          const parentB = nodes.find(n => n.id === parentBId);

          return (
            <g key={`synth-lines-${node.id}`}>
              {parentA && (
                <path
                  d={`M ${parentA.x + parentA.width} ${parentA.y + 240} C ${parentA.x + parentA.width + 120} ${parentA.y + 240}, ${node.x - 120} ${node.y + 200}, ${node.x} ${node.y + 200}`}
                  fill="none"
                  stroke="#0891B2"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-flow"
                />
              )}
              {parentB && (
                <path
                  d={`M ${parentB.x + parentB.width} ${parentB.y + 240} C ${parentB.x + parentB.width + 120} ${parentB.y + 240}, ${node.x - 120} ${node.y + 280}, ${node.x} ${node.y + 280}`}
                  fill="none"
                  stroke="#0891B2"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-flow"
                />
              )}
            </g>
          );
        }

        return null;
      })}
    </svg>
  );
};

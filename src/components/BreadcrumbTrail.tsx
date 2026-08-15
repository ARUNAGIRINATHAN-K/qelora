import React from 'react';
import { 
  ChevronRight, 
  Compass, 
  Sparkles, 
  GitBranch, 
  GitMerge, 
  Layers, 
  Target,
  ArrowUpRight,
  Clock,
  FlaskConical,
  Scale,
  Wrench,
  Shapes
} from 'lucide-react';
import { motion } from 'motion/react';
import { GridNodeData, BranchPerspective } from '../types';

interface BreadcrumbTrailProps {
  nodes: GridNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onCenterNode: (x: number, y: number) => void;
}

const getPerspectiveConfig = (mode?: BranchPerspective) => {
  switch (mode) {
    case 'deep-dive':
      return { 
        label: 'Deep Dive', 
        icon: FlaskConical,
        dotColor: 'bg-blue-500', 
        textColor: 'text-blue-700', 
        bgBadge: 'bg-blue-50 border-blue-200' 
      };
    case 'contrarian':
      return { 
        label: 'Contrarian', 
        icon: Scale,
        dotColor: 'bg-rose-500', 
        textColor: 'text-rose-700', 
        bgBadge: 'bg-rose-50 border-rose-200' 
      };
    case 'applications':
      return { 
        label: 'Application', 
        icon: Wrench,
        dotColor: 'bg-emerald-500', 
        textColor: 'text-emerald-700', 
        bgBadge: 'bg-emerald-50 border-emerald-200' 
      };
    case 'timeline':
      return { 
        label: 'Timeline', 
        icon: Clock,
        dotColor: 'bg-amber-500', 
        textColor: 'text-amber-700', 
        bgBadge: 'bg-amber-50 border-amber-200' 
      };
    case 'analogy':
      return { 
        label: 'Analogy', 
        icon: Shapes,
        dotColor: 'bg-purple-500', 
        textColor: 'text-purple-700', 
        bgBadge: 'bg-purple-50 border-purple-200' 
      };
    case 'synthesis':
      return { 
        label: 'Synthesis', 
        icon: GitMerge,
        dotColor: 'bg-cyan-500', 
        textColor: 'text-cyan-700', 
        bgBadge: 'bg-cyan-50 border-cyan-200' 
      };
    default:
      return { 
        label: 'Explore', 
        icon: Compass,
        dotColor: 'bg-indigo-500', 
        textColor: 'text-indigo-700', 
        bgBadge: 'bg-indigo-50 border-indigo-200' 
      };
  }
};

export const BreadcrumbTrail: React.FC<BreadcrumbTrailProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onCenterNode
}) => {
  if (nodes.length === 0) return null;

  // Determine the active target node
  let activeNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  if (!activeNode) {
    activeNode = nodes[nodes.length - 1]; // default to latest node
  }
  if (!activeNode) return null;

  // Build the lineage path by traversing upward
  const lineage: GridNodeData[] = [];
  const visited = new Set<string>();

  let curr: GridNodeData | undefined = activeNode;
  while (curr && !visited.has(curr.id)) {
    visited.add(curr.id);
    lineage.unshift(curr);

    if (curr.parentId) {
      curr = nodes.find(n => n.id === curr!.parentId);
    } else if (curr.synthesizedFrom && curr.synthesizedFrom.length > 0) {
      curr = nodes.find(n => n.id === curr!.synthesizedFrom![0]);
    } else {
      break;
    }
  }

  // Count total branching depth & total root count
  const depth = lineage.length;
  const isRoot = depth === 1;

  return (
    <div 
      id="breadcrumb-navigation-trail"
      className="pointer-events-auto flex items-center max-w-[90vw] md:max-w-3xl overflow-hidden"
    >
      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
        {/* Navigation Icon / Origin marker */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 text-slate-600 shrink-0 select-none"
          title={`Lineage depth: ${depth} level${depth > 1 ? 's' : ''}`}
        >
          <GitBranch size={13} className="text-indigo-600" />
          <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider hidden sm:inline">
            Trail
          </span>
          <span className="font-mono text-[10px] font-semibold text-slate-400">
            L{depth}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 shrink-0 mx-0.5" />

        {/* Trail Crumbs List */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {lineage.map((node, index) => {
            const isLast = index === lineage.length - 1;
            const version = node.versions[node.versionIndex] || node;
            const title = version.title || node.prompt || 'Node';
            const config = getPerspectiveConfig(node.mode);
            const IconComponent = config.icon;

            return (
              <React.Fragment key={node.id}>
                {index > 0 && (
                  <ChevronRight size={13} className="text-slate-300 shrink-0 mx-0.5" />
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectNode(node.id);
                    onCenterNode(node.x, node.y);
                  }}
                  className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs transition-all shrink-0 cursor-pointer border ${
                    isLast
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-medium'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200/80'
                  }`}
                  title={`Navigate to: ${title} (${config.label})`}
                >
                  {/* Perspective Indicator Dot or Icon */}
                  {isLast ? (
                    <span className={`w-2 h-2 rounded-full ${config.dotColor} shrink-0 animate-pulse`} />
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0 opacity-75 group-hover:opacity-100`} />
                  )}

                  {/* Title */}
                  <span className="max-w-[110px] sm:max-w-[140px] md:max-w-[180px] truncate font-sans text-xs">
                    {title}
                  </span>

                  {/* Mode tag for intermediate & leaf crumbs */}
                  {node.mode && node.mode !== 'standard' && (
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold hidden md:inline-block ${
                      isLast 
                        ? 'bg-white/20 text-slate-100' 
                        : `${config.textColor} bg-white border border-slate-200/60`
                    }`}>
                      {config.label.toUpperCase()}
                    </span>
                  )}
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Focus Active Node Button */}
        <button
          onClick={() => onCenterNode(activeNode!.x, activeNode!.y)}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0 cursor-pointer"
          title="Center active node in viewport"
        >
          <Target size={14} />
        </button>
      </div>
    </div>
  );
};

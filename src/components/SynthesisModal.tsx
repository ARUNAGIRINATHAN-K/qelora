import React, { useState } from 'react';
import { Sparkles, X, GitMerge, ArrowRight, Layers, Check } from 'lucide-react';
import { GridNodeData } from '../types';

interface SynthesisModalProps {
  nodes: GridNodeData[];
  onClose: () => void;
  onSynthesize: (nodeA: GridNodeData, nodeB: GridNodeData) => void;
  initialNodeId?: string | null;
}

export const SynthesisModal: React.FC<SynthesisModalProps> = ({
  nodes,
  onClose,
  onSynthesize,
  initialNodeId
}) => {
  const [selectedA, setSelectedA] = useState<string | null>(initialNodeId || (nodes[0]?.id ?? null));
  const [selectedB, setSelectedB] = useState<string | null>(
    nodes.find(n => n.id !== initialNodeId)?.id || (nodes[1]?.id ?? null)
  );

  const nodeA = nodes.find(n => n.id === selectedA);
  const nodeB = nodes.find(n => n.id === selectedB);

  const handleExecute = () => {
    if (nodeA && nodeB && nodeA.id !== nodeB.id) {
      onSynthesize(nodeA, nodeB);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-700 flex items-center justify-center font-bold">
              <GitMerge size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Cross-Disciplinary Synthesis Engine
              </h2>
              <p className="text-xs text-slate-500">
                Fuse two distinct concepts into a hybrid breakthrough node
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Dual Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative">
            {/* Concept A */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border-2 border-cyan-500/40 bg-cyan-50/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-700 uppercase tracking-wider">Concept 1</span>
                {nodeA && <Check size={14} className="text-cyan-600" />}
              </div>
              <select
                value={selectedA || ''}
                onChange={(e) => setSelectedA(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-cyan-500 text-slate-800"
              >
                {nodes.map(n => (
                  <option key={`a-${n.id}`} value={n.id} disabled={n.id === selectedB}>
                    {n.prompt}
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-600 line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-100">
                {nodeA?.summary || nodeA?.text?.slice(0, 150) || 'Select first node'}
              </div>
            </div>

            {/* Bridge connector */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900 text-white items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-cyan-400" />
            </div>

            {/* Concept B */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border-2 border-indigo-500/40 bg-indigo-50/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider">Concept 2</span>
                {nodeB && <Check size={14} className="text-indigo-600" />}
              </div>
              <select
                value={selectedB || ''}
                onChange={(e) => setSelectedB(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-slate-800"
              >
                {nodes.map(n => (
                  <option key={`b-${n.id}`} value={n.id} disabled={n.id === selectedA}>
                    {n.prompt}
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-600 line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-100">
                {nodeB?.summary || nodeB?.text?.slice(0, 150) || 'Select second node'}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Layers size={16} className="text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Emergent Synergy Discovery:</span> Qelora will analyze the semantic space between both topics, finding underlying structural analogies, cross-pollinated applications, and frontier research questions.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={!nodeA || !nodeB || nodeA.id === nodeB.id}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>Generate Synthesis Node</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

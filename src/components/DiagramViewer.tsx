import React from 'react';
import { Layers, Network, ArrowRight } from 'lucide-react';

interface DiagramViewerProps {
  diagramData?: string;
  title: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ diagramData, title }) => {
  if (!diagramData) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
        <Network size={28} className="text-slate-300 mb-2" />
        <p className="text-xs font-mono">No structural diagram generated for this node.</p>
      </div>
    );
  }

  // Parse simple mermaid or formatted relations
  // e.g. "A[Concept] --> B[Subconcept]" or lines with arrows
  const lines = diagramData
    .replace(/^```(mermaid)?/gi, '')
    .replace(/```$/gi, '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('graph ') && !l.startsWith('flowchart '));

  const relations: { from: string; to: string; label?: string }[] = [];

  lines.forEach(line => {
    // Match patterns like A --> B or A -- label --> B or A[Text] --> B[Text]
    const match = line.match(/(.+?)(?:--\s*(.*?)\s*-->|-->|->|=>)(.+)/);
    if (match) {
      const from = match[1].replace(/[[\]()]/g, '').trim();
      const label = match[2]?.replace(/[[\]()]/g, '').trim();
      const to = match[3]?.replace(/[[\]()]/g, '').trim();
      if (from && to) {
        relations.push({ from, to, label });
      }
    }
  });

  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto custom-scrollbar border border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
          <Layers size={14} />
          <span>Mechanisms & Relationship Flow</span>
        </div>
        <span className="text-[10px] text-slate-400">STRUCTURED SCHEMATIC</span>
      </div>

      {relations.length > 0 ? (
        <div className="flex flex-col gap-2.5 py-1">
          {relations.map((rel, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 p-2 rounded bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
            >
              <span className="px-2 py-1 rounded bg-slate-700 font-medium text-slate-200 text-[11px] truncate max-w-[130px]">
                {rel.from}
              </span>
              
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                {rel.label && (
                  <span className="text-[9px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                    {rel.label}
                  </span>
                )}
                <ArrowRight size={13} className="text-cyan-400" />
              </div>

              <span className="px-2 py-1 rounded bg-cyan-950/70 border border-cyan-800/50 font-medium text-cyan-200 text-[11px] truncate max-w-[150px]">
                {rel.to}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <pre className="text-emerald-400 whitespace-pre-wrap text-[11px] leading-relaxed p-2 bg-slate-950/60 rounded">
          {diagramData.replace(/^```(mermaid)?/gi, '').replace(/```$/gi, '').trim()}
        </pre>
      )}
    </div>
  );
};

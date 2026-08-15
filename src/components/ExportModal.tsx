import React, { useState } from 'react';
import { Download, Copy, Check, FileText, Code2, Share2, X, Sparkles } from 'lucide-react';
import { GridNodeData } from '../types';

interface ExportModalProps {
  nodes: GridNodeData[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ nodes, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');

  const generateMarkdown = () => {
    let md = `# Qelora Knowledge Graph Report\n`;
    md += `*Generated on ${new Date().toLocaleDateString()} with ${nodes.length} interconnected concept nodes*\n\n---\n\n`;

    nodes.forEach((node, index) => {
      const v = node.versions[node.versionIndex] || node;
      md += `## ${index + 1}. ${v.title || node.prompt}\n`;
      if (node.mode && node.mode !== 'standard') {
        md += `**Exploration Angle:** \`${node.mode.toUpperCase()}\`\n\n`;
      }
      if (v.summary) {
        md += `> ${v.summary}\n\n`;
      }
      md += `${v.text}\n\n`;

      if (v.keyTakeaways && v.keyTakeaways.length > 0) {
        md += `### Key Insights\n`;
        v.keyTakeaways.forEach(k => {
          md += `- ${k}\n`;
        });
        md += `\n`;
      }

      if (v.prompts && v.prompts.length > 0) {
        md += `### Branching Frontiers\n`;
        v.prompts.forEach(p => {
          md += `- ${p}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });

    return md;
  };

  const generateJSON = () => {
    return JSON.stringify(nodes, null, 2);
  };

  const content = activeTab === 'markdown' ? generateMarkdown() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'markdown' ? `qelora-research-${Date.now()}.md` : `qelora-graph-${Date.now()}.json`;
    const mimeType = activeTab === 'markdown' ? 'text/markdown' : 'application/json';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-700 flex items-center justify-center font-bold">
              <Download size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Export Knowledge Workspace
              </h2>
              <p className="text-xs text-slate-500">
                Save your research findings as structured Markdown or full JSON project
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

        {/* Format Selector Tabs */}
        <div className="px-6 pt-4 pb-2 flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText size={14} />
            <span>Markdown Report (.md)</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Code2 size={14} />
            <span>JSON Project Backup</span>
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-hidden flex-1 flex flex-col">
          <div className="relative flex-1 bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-auto custom-scrollbar border border-slate-800">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500 font-mono">
            {nodes.length} nodes included
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy All'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              <Download size={14} />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

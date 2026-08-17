import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, ChevronLeft, ChevronRight, Loader2, 
  Volume2, GitMerge, Layers, FileText, Image as ImageIcon,
  Compass, ArrowRight, CornerDownRight, CheckCircle2,
  RefreshCw, PlusCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GridNodeData, BranchPerspective, VisualStyle } from '../types';
import { DiagramViewer } from './DiagramViewer';
import { AudioBriefing } from './AudioBriefing';

interface NodeCardProps {
  index: number;
  node: GridNodeData;
  onExpand: (prompt: string, parentId: string, mode?: BranchPerspective) => void;
  onRegenerate: (nodeId: string) => void;
  onRegenerateImage: (nodeId: string, style: VisualStyle) => void;
  onClose: (nodeId: string) => void;
  onOpenSynthesis?: (nodeId: string) => void;
  setVersion: (nodeId: string, versionIndex: number) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onSelect?: (nodeId: string) => void;
  isFocused?: boolean;
}

const getPerspectiveBadge = (mode?: BranchPerspective) => {
  switch (mode) {
    case 'deep-dive':
      return { label: 'DEEP DIVE', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'contrarian':
      return { label: 'CONTRARIAN', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'applications':
      return { label: 'APPLICATION', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'timeline':
      return { label: 'TIMELINE', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'analogy':
      return { label: 'ANALOGY', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'synthesis':
      return { label: 'SYNTHESIS', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
    default:
      return { label: 'EXPLORATION', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

export const NodeCard: React.FC<NodeCardProps> = ({
  index,
  node,
  onExpand,
  onRegenerate,
  onRegenerateImage,
  onClose,
  onOpenSynthesis,
  setVersion,
  onPointerDown,
  onSelect,
  isFocused = false
}) => {
  const version = node.versions[node.versionIndex] || node;
  const isGenerating = node.status === 'generating';
  const [activeTab, setActiveTab] = useState<'text' | 'diagram' | 'audio'>('text');
  const [selectedText, setSelectedText] = useState('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [customBranchText, setCustomBranchText] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const badge = getPerspectiveBadge(node.mode);

  // Handle text selection for quick branching
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    } else {
      setSelectedText('');
      setSelectionPos(null);
    }
  };

  const handleQuickBranch = (perspective: BranchPerspective = 'standard') => {
    if (selectedText) {
      onExpand(selectedText, node.id, perspective);
      setSelectedText('');
      setSelectionPos(null);
    }
  };

  const handleCustomBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBranchText.trim()) {
      onExpand(customBranchText.trim(), node.id, 'standard');
      setCustomBranchText('');
    }
  };

  // Pre-process text to fix bad markdown links where href has spaces
  const processedText = (version.text || '').replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, (match, p1, p2) => {
    return `[${p1}](${p2.replace(/\s/g, '%20')})`;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        width: node.width,
        zIndex: isFocused ? 30 : 10
      }}
      className="flex flex-col gap-2 origin-top-left group"
      onClick={() => onSelect?.(node.id)}
    >
      {/* Node Header Pill Toolbar */}
      <div 
        className="flex items-center justify-between text-xs font-mono cursor-grab active:cursor-grabbing w-full px-1"
        onPointerDown={(e) => onPointerDown?.(e)}
      >
        <div className="flex items-center gap-2">
          {/* Node Number & Perspective Tag */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-2.5 py-1 shadow-sm flex items-center gap-2">
            <span className="font-bold text-slate-800 text-[11px]">NODE {index + 1}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
              {badge.label}
            </span>
          </div>

          {/* Version Switcher */}
          {node.versions.length > 1 && (
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-1.5 py-1 shadow-sm flex items-center gap-1">
              <button 
                onClick={() => setVersion(node.id, Math.max(0, node.versionIndex - 1))}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={node.versionIndex === 0}
                className="hover:bg-slate-100 p-0.5 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-slate-600"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="text-[10px] text-slate-600 font-semibold px-1">
                {node.versionIndex + 1}/{node.versions.length}
              </span>
              <button 
                onClick={() => setVersion(node.id, Math.min(node.versions.length - 1, node.versionIndex + 1))}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={node.versionIndex === node.versions.length - 1}
                className="hover:bg-slate-100 p-0.5 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-slate-600"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Node Actions */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-2 py-1 shadow-sm flex items-center gap-1.5 text-slate-600">
          <button 
            onClick={() => onOpenSynthesis?.(node.id)}
            onPointerDown={(e) => e.stopPropagation()}
            className="hover:text-cyan-600 hover:bg-cyan-50 p-1 rounded transition-colors cursor-pointer"
            title="Synthesize with another node"
          >
            <GitMerge size={13} />
          </button>

          <button 
            onClick={() => onRegenerate(node.id)}
            onPointerDown={(e) => e.stopPropagation()}
            className="hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors cursor-pointer"
            title="Regenerate content"
          >
            <RefreshCw size={13} />
          </button>

          <div className="h-3 w-px bg-slate-200"></div>

          <button 
            onClick={() => onClose(node.id)}
            onPointerDown={(e) => e.stopPropagation()}
            className="hover:text-rose-600 hover:bg-rose-50 p-1 rounded transition-colors cursor-pointer"
            title="Delete node"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div 
        className={`flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
          isFocused ? 'ring-2 ring-indigo-500 border-indigo-300' : 'border-slate-200/90'
        }`}
        onPointerDown={(e) => onPointerDown?.(e)}
      >
        {node.status === 'error' ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[360px] bg-rose-50/30">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <X size={20} />
            </div>
            <div className="font-mono text-xs uppercase tracking-wider text-rose-700 font-bold">
              Processing Anomaly
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              Unable to complete generation. Click regenerate to retry.
            </p>
            <button
              onClick={() => onRegenerate(node.id)}
              className="mt-2 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Retry Node
            </button>
          </div>
        ) : isGenerating ? (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[380px] bg-slate-50/50">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-800 font-display">Generating Concept Space</span>
              <span className="font-mono text-[11px] text-slate-400">Expanding multi-dimensional knowledge...</span>
            </div>
            <div className="w-36 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-indigo-500 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Visual Media Header (16:9 Aspect) */}
            <div className="relative bg-slate-950 overflow-hidden group/img">
              {version.imageUrl ? (
                <img 
                  src={version.imageUrl} 
                  alt={node.prompt} 
                  className="w-full h-[210px] object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : version.imageLoading ? (
                <div className="h-[210px] flex flex-col items-center justify-center gap-2 bg-slate-900 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Rendering visual context...</span>
                </div>
              ) : version.asciiArt ? (
                <div className="h-[210px] overflow-auto bg-slate-950 p-3 flex items-center justify-center">
                  <pre className="text-emerald-400 font-mono text-[9px] leading-none">
                    {version.asciiArt}
                  </pre>
                </div>
              ) : (
                <div className="h-[160px] flex flex-col items-center justify-center gap-2 bg-slate-900/60 text-slate-500">
                  <ImageIcon size={22} className="text-slate-600" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Visual generation ready</span>
                </div>
              )}

              {/* Visual Style Selector overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md rounded-lg p-1 border border-slate-800">
                {(['editorial', 'schematic', 'sketch', 'abstract'] as VisualStyle[]).map(style => (
                  <button
                    key={style}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegenerateImage(node.id, style);
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold transition-all cursor-pointer ${
                      node.imageStyle === style
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title={`Regenerate visual as ${style}`}
                  >
                    {style.slice(0, 4)}
                  </button>
                ))}
              </div>

              {/* Title & Headline on Image Bottom Gradient */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3.5 pt-8">
                <h3 className="font-display font-bold text-base text-white leading-tight tracking-tight drop-shadow-sm">
                  {version.title || node.prompt}
                </h3>
              </div>
            </div>

            {/* Segmented View Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/70 px-4 pt-1 gap-1 text-xs">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'text'
                    ? 'border-indigo-600 text-indigo-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={13} />
                <span>Insight</span>
              </button>
              <button
                onClick={() => setActiveTab('diagram')}
                className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'diagram'
                    ? 'border-indigo-600 text-indigo-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers size={13} />
                <span>Diagram</span>
              </button>
              <button
                onClick={() => setActiveTab('audio')}
                className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'audio'
                    ? 'border-indigo-600 text-indigo-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Volume2 size={13} />
                <span>Briefing</span>
              </button>
            </div>

            {/* Tab Body Content */}
            <div 
              ref={contentRef}
              onMouseUp={handleMouseUp}
              className="p-4 min-h-[220px] max-h-[380px] overflow-y-auto custom-scrollbar text-xs leading-relaxed text-slate-700 cursor-text selection:bg-indigo-100 selection:text-indigo-900 flex flex-col gap-3"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {activeTab === 'text' && (
                <>
                  {/* Executive Summary */}
                  {version.summary && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800 font-medium text-xs leading-relaxed">
                      {version.summary}
                    </div>
                  )}

                  {/* Main Markdown Body with interactive link branching */}
                  <div className="prose-xs space-y-2">
                    <ReactMarkdown
                      components={{
                        a: ({ node: _mdNode, ...props }) => (
                          <button 
                            type="button"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200/60 transition-all cursor-pointer text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              let promptText = props.href || "";
                              if (promptText.startsWith('#')) promptText = promptText.substring(1);
                              promptText = decodeURIComponent(promptText);
                              if (Array.isArray(props.children) && typeof props.children[0] === 'string') {
                                promptText = props.children[0];
                              } else if (typeof props.children === 'string') {
                                promptText = props.children;
                              }
                              onExpand(promptText, node.id, 'standard');
                            }}
                          >
                            <span>{props.children}</span>
                            <CornerDownRight size={10} className="opacity-60" />
                          </button>
                        ),
                        h3: ({ children }) => <h3 className="text-xs font-bold text-slate-900 mt-3 mb-1.5 font-display tracking-tight border-b border-slate-100 pb-1">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-[11px] font-bold text-slate-800 mt-2.5 mb-1 tracking-tight flex items-center gap-1.5">{children}</h4>,
                        h5: ({ children }) => <h5 className="text-[11px] font-semibold text-slate-700 mt-2 mb-1">{children}</h5>,
                        p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1.5 mb-2 text-slate-700">{children}</ul>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>
                      }}
                    >
                      {processedText}
                    </ReactMarkdown>

                  </div>

                  {/* Key Takeaways */}
                  {version.keyTakeaways && version.keyTakeaways.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                      <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Core Takeaways
                      </div>
                      <div className="flex flex-col gap-1">
                        {version.keyTakeaways.map((t, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'diagram' && (
                <DiagramViewer 
                  diagramData={version.diagramData}
                  title={version.title || node.prompt}
                />
              )}

              {activeTab === 'audio' && (
                <AudioBriefing 
                  text={version.text}
                  title={version.title || node.prompt}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Selection Quick Branch Tool */}
      {selectedText && (
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-xl shadow-xl p-1.5 flex items-center gap-1 text-xs border border-slate-700 animate-in fade-in zoom-in-95"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] font-mono text-slate-300 px-2 truncate max-w-[120px]">
            "{selectedText}"
          </span>
          <button
            onClick={() => handleQuickBranch('deep-dive')}
            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            Deep Dive
          </button>
          <button
            onClick={() => handleQuickBranch('contrarian')}
            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            Contrarian
          </button>
          <button
            onClick={() => handleQuickBranch('standard')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            Explore
          </button>
        </div>
      )}

      {/* Multi-Perspective Suggested Branches Dock */}
      <AnimatePresence>
        {!isGenerating && version.prompts && version.prompts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}
            className="absolute left-full top-12 ml-6 flex flex-col gap-2.5 w-72"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {version.prompts.map((prompt: string, idx: number) => {
              // Assign perspective based on index
              const perspectiveList: BranchPerspective[] = ['deep-dive', 'contrarian', 'applications', 'analogy'];
              const assignedMode = perspectiveList[idx % perspectiveList.length];
              const modeMeta = getPerspectiveBadge(assignedMode);

              return (
                <div key={idx} className="relative group/prompt">
                  {/* Subtle horizontal connecting bridge */}
                  <div className="absolute top-1/2 right-full w-6 h-[1.5px] bg-slate-300 group-hover/prompt:bg-indigo-500 transition-colors" />
                  
                  <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${modeMeta.bg} ${modeMeta.text} ${modeMeta.border}`}>
                        {modeMeta.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExpand(prompt, node.id, assignedMode);
                        }}
                        className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpand(prompt, node.id, assignedMode);
                      }}
                      className="text-left text-xs font-medium text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 leading-snug w-full"
                    >
                      {prompt}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Custom Branch Prompt Input */}
            <form onSubmit={handleCustomBranchSubmit} className="relative mt-1">
              <div className="absolute top-1/2 right-full w-6 h-[1.5px] bg-slate-300" />
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm focus-within:border-indigo-500">
                <input
                  type="text"
                  placeholder="Ask custom follow-up..."
                  value={customBranchText}
                  onChange={(e) => setCustomBranchText(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 outline-none text-slate-800 bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!customBranchText.trim()}
                  className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

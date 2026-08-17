import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, Play, Sparkles, ZoomIn, ZoomOut, Maximize2, 
  GitMerge, Download, RefreshCw, Layers, Compass, 
  ArrowRight, Grid, Filter, Share2, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GridNodeData, BranchPerspective, VisualStyle, CanvasTransform } from './types';
import { NodeCard } from './components/NodeCard';
import { ConnectingLines } from './components/ConnectingLines';
import { Minimap } from './components/Minimap';
import { BreadcrumbTrail } from './components/BreadcrumbTrail';
import { SynthesisModal } from './components/SynthesisModal';
import { ExportModal } from './components/ExportModal';

const NODE_WIDTH = 380;

const STARTER_TOPICS = [
  { title: "Quantum Superposition", category: "Physics" },
  { title: "Neuroplasticity & Memory", category: "Neuroscience" },
  { title: "Artificial General Intelligence", category: "AI Frontiers" },
  { title: "Cellular Senescence & Longevity", category: "Biology" },
  { title: "Fermi Paradox & Great Filters", category: "Astrophysics" },
  { title: "Game Theory & Mechanism Design", category: "Economics" }
];

export default function App() {
  const [nodes, setNodes] = useState<GridNodeData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  
  // Modals state
  const [showSynthesisModal, setShowSynthesisModal] = useState(false);
  const [synthesisInitialNodeId, setSynthesisInitialNodeId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Canvas Transform State
  const [transform, setTransform] = useState<CanvasTransform>({ 
    x: 0, 
    y: 0, 
    scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.65 : 0.85 
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartInfo = useRef({ x: 0, y: 0, transformX: 0, transformY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Node dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const nodeDragStartInfo = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });

  // Panning Support
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragStartInfo.current = {
        x: e.clientX,
        y: e.clientY,
        transformX: transform.x,
        transformY: transform.y,
      };
      e.preventDefault();
    }
  };

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setFocusedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    nodeDragStartInfo.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartInfo.current.x;
      const dy = e.clientY - dragStartInfo.current.y;
      setTransform(prev => ({
        ...prev,
        x: dragStartInfo.current.transformX + dx,
        y: dragStartInfo.current.transformY + dy,
      }));
    } else if (draggingNodeId) {
      const dx = (e.clientX - nodeDragStartInfo.current.x) / transform.scale;
      const dy = (e.clientY - nodeDragStartInfo.current.y) / transform.scale;
      setNodes(prev => prev.map(n => 
        n.id === draggingNodeId ? { ...n, x: nodeDragStartInfo.current.nodeX + dx, y: nodeDragStartInfo.current.nodeY + dy } : n
      ));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setDraggingNodeId(null);
    if ((e.target as HTMLElement).hasPointerCapture && (e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = -e.deltaY * 0.002;
      handleZoom(zoomFactor, e.clientX, e.clientY);
    } else {
      setTransform(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  const handleZoom = (delta: number, originX?: number, originY?: number) => {
    setTransform(prev => {
      const newScale = Math.min(Math.max(0.2, prev.scale + delta), 2.5);
      
      if (originX === undefined || originY === undefined) {
        originX = window.innerWidth / 2;
        originY = window.innerHeight / 2;
      }

      const scaleRatio = newScale / prev.scale;
      const newX = originX - (originX - prev.x) * scaleRatio;
      const newY = originY - (originY - prev.y) * scaleRatio;

      return { x: newX, y: newY, scale: newScale };
    });
  };

  const centerOnPosition = useCallback((x: number, y: number) => {
    const hw = window.innerWidth / 2;
    const hh = window.innerHeight / 2;
    setTransform(prev => ({
      ...prev,
      x: hw - x * prev.scale - (NODE_WIDTH / 2) * prev.scale,
      y: hh - y * prev.scale - 220 * prev.scale
    }));
  }, []);

  const handleCenterViewport = useCallback((x: number, y: number) => {
    const hw = window.innerWidth / 2;
    const hh = window.innerHeight / 2;
    setTransform(prev => ({
      ...prev,
      x: hw - x * prev.scale,
      y: hh - y * prev.scale
    }));
  }, []);

  const handleFitView = useCallback(() => {
    if (nodes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + 450);
    });

    const padding = 100;
    const totalW = maxX - minX + padding * 2;
    const totalH = maxY - minY + padding * 2;

    const scaleX = window.innerWidth / totalW;
    const scaleY = window.innerHeight / totalH;
    const newScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 1.2);

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    setTransform({
      x: window.innerWidth / 2 - midX * newScale,
      y: window.innerHeight / 2 - midY * newScale,
      scale: newScale
    });
  }, [nodes]);

  // Clean auto-layout for tree structure
  const handleAutoLayout = () => {
    if (nodes.length === 0) return;

    // Group nodes by levels
    const roots = nodes.filter(n => !n.parentId && !n.synthesizedFrom);
    const layoutMap = new Map<string, { x: number; y: number }>();

    const LEVEL_GAP_X = 520;
    const NODE_GAP_Y = 560;

    let currentRootY = 0;

    const layoutSubtree = (nodeId: string, depth: number, startY: number): number => {
      const children = nodes.filter(n => n.parentId === nodeId);
      const x = depth * LEVEL_GAP_X;
      
      if (children.length === 0) {
        layoutMap.set(nodeId, { x, y: startY });
        return startY + NODE_GAP_Y;
      }

      let childY = startY;
      children.forEach(child => {
        childY = layoutSubtree(child.id, depth + 1, childY);
      });

      const avgY = (startY + (childY - NODE_GAP_Y)) / 2;
      layoutMap.set(nodeId, { x, y: avgY });
      return childY;
    };

    roots.forEach(root => {
      currentRootY = layoutSubtree(root.id, 0, currentRootY);
    });

    setNodes(prev => prev.map(n => {
      const pos = layoutMap.get(n.id);
      return pos ? { ...n, x: pos.x, y: pos.y } : n;
    }));

    setTimeout(handleFitView, 100);
  };

  // Node generator function
  const generateNode = async (
    prompt: string, 
    x: number, 
    y: number, 
    parentId?: string, 
    isRegenerationOf?: string,
    mode: BranchPerspective = 'standard',
    imageStyle: VisualStyle = 'editorial'
  ) => {
    const id = isRegenerationOf || `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const parent = parentId ? nodes.find(n => n.id === parentId) : null;
    
    if (isRegenerationOf) {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'generating' } : n));
    } else {
      const newNode: GridNodeData = {
        id, x, y,
        width: NODE_WIDTH,
        prompt,
        text: '',
        prompts: [],
        status: 'generating',
        versionIndex: 0,
        versions: [],
        parentId,
        mode,
        imageStyle
      };
      setNodes(prev => [...prev, newNode]);
      setFocusedNodeId(id);
    }
    
    setTimeout(() => centerOnPosition(x, y), 50);

    try {
      // Structural hierarchy system prompt: factual definition -> progressive theoretical complexity
      const systemPrompt = `You are Qelora, an authoritative knowledge graph and concept intelligence engine.
Enforce the following strict structural hierarchy:
1. OBJECTIVE & FACTUAL DEFINITION: Begin with an unambiguous, objective, and factually accurate definition of the concept in plain terms. Explain what it is, its core purpose, and what problem it solves. Avoid vague, pretentious, or pseudo-intellectual filler.
2. PROGRESSIVE THEORETICAL COMPLEXITY:
   - Level 1 (Fundamentals & Mechanics): Detail the step-by-step working mechanics, structural components, or operational pipeline using domain-accurate terminology.
   - Level 2 (Theoretical Depth & Constraints): Progressively introduce deeper mathematical principles, system constraints, trade-offs, and empirical edge cases.
   - Level 3 (Frontiers & Applications): Highlight real-world implementations, active research frontiers, and foundational connections.
3. KEY TAKEAWAYS: Output exactly 3 concise, highly factual bullet points summarizing core principles.
4. INTERACTIVE BRANCHING: Embed 3-5 sub-concepts as markdown links formatted EXACTLY as [Concept Name](Concept Name).`;

      // 1. Fetch text content & breakdown
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          parentContext: parent ? `${parent.prompt}: ${parent.text?.slice(0, 200)}` : undefined,
          mode,
          systemPrompt
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Robust parsing for text enforcing structural hierarchy
      let parsedText = typeof data.text === 'string' ? data.text.trim() : '';
      if (!parsedText && data.definition) {
        parsedText = `### Overview\n\n#### 1. Factual Definition & Purpose\n${data.definition}\n\n#### 2. Working Principles & Mechanics\n${data.mechanics || ''}\n\n#### 3. Advanced Theoretical Depth\n${data.advanced || ''}`;
      }
      if (!parsedText) {
        parsedText = 'No text generated';
      }

      // Robust parsing for keyTakeaways ensuring clean string array
      let parsedKeyTakeaways: string[] = [];
      if (Array.isArray(data.keyTakeaways)) {
        parsedKeyTakeaways = data.keyTakeaways
          .map((item: any) => (typeof item === 'string' ? item.trim() : JSON.stringify(item)))
          .filter(Boolean);
      } else if (typeof data.keyTakeaways === 'string') {
        parsedKeyTakeaways = data.keyTakeaways
          .split('\n')
          .map((s: string) => s.replace(/^[-*•\d.]+\s*/, '').trim())
          .filter(Boolean);
      }

      let insertIndex = 0;

      setNodes(prev => prev.map(node => {
        if (node.id === id) {
          insertIndex = isRegenerationOf ? node.versions.length : 0;
          const newVersion = {
            prompt,
            title: data.title || prompt,
            summary: data.summary,
            text: parsedText,
            prompts: Array.isArray(data.prompts) ? data.prompts : [],
            keyTakeaways: parsedKeyTakeaways,
            diagramData: data.diagramData,
            imageUrl: '',
            imageLoading: true,
            imageStyle,
            mode
          };
          
          return {
            ...node,
            title: newVersion.title,
            summary: newVersion.summary,
            text: newVersion.text,
            prompts: newVersion.prompts,
            keyTakeaways: newVersion.keyTakeaways,
            diagramData: newVersion.diagramData,
            status: 'ready',
            versions: isRegenerationOf ? [...node.versions, newVersion] : [newVersion],
            versionIndex: insertIndex,
            mode
          };
        }
        return node;
      }));

      // 2. Fetch contextual imagery in background
      fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.title || prompt, style: imageStyle }),
      }).then(r => r.json()).then(imgData => {
        if (imgData.imageUrl) {
          setNodes(prev => prev.map(node => {
            if (node.id === id) {
              const versions = [...node.versions];
              if (versions[insertIndex]) {
                versions[insertIndex] = { ...versions[insertIndex], imageUrl: imgData.imageUrl, imageLoading: false };
              }
              const isCurrentVersion = node.versionIndex === insertIndex;
              return {
                ...node,
                versions,
                ...(isCurrentVersion ? { imageUrl: imgData.imageUrl } : {})
              };
            }
            return node;
          }));
        } else {
          setNodes(prev => prev.map(node => {
            if (node.id === id) {
              const versions = [...node.versions];
              if (versions[insertIndex]) {
                versions[insertIndex] = { ...versions[insertIndex], imageLoading: false };
              }
              return { ...node, versions };
            }
            return node;
          }));
        }
      }).catch(err => {
        console.error('Image fetch error:', err);
        setNodes(prev => prev.map(node => {
          if (node.id === id) {
            const versions = [...node.versions];
            if (versions[insertIndex]) {
              versions[insertIndex] = { ...versions[insertIndex], imageLoading: false };
            }
            return { ...node, versions };
          }
          return node;
        }));
      });

    } catch (error) {
      console.error(error);
      setNodes(prev => prev.map(node => node.id === id ? { ...node, status: 'error' } : node));
    }
  };

  // Node synthesis execution (Feature 1 extension)
  const handleExecuteSynthesis = async (nodeA: GridNodeData, nodeB: GridNodeData) => {
    const id = `synth-${Date.now()}`;
    const newX = Math.max(nodeA.x, nodeB.x) + 480;
    const newY = (nodeA.y + nodeB.y) / 2;

    const synthPrompt = `${nodeA.prompt} ⟁ ${nodeB.prompt}`;

    const newNode: GridNodeData = {
      id,
      x: newX,
      y: newY,
      width: NODE_WIDTH,
      prompt: synthPrompt,
      text: '',
      prompts: [],
      status: 'generating',
      versionIndex: 0,
      versions: [],
      synthesizedFrom: [nodeA.id, nodeB.id],
      mode: 'synthesis'
    };

    setNodes(prev => [...prev, newNode]);
    setFocusedNodeId(id);
    setTimeout(() => centerOnPosition(newX, newY), 50);

    try {
      const res = await fetch('/api/synthesize-nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeA, nodeB }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const newVersion = {
        prompt: synthPrompt,
        title: data.title || synthPrompt,
        summary: data.summary,
        text: data.text || 'No text generated',
        prompts: data.prompts || [],
        keyTakeaways: data.keyTakeaways || [],
        diagramData: data.diagramData,
        imageUrl: '',
        imageLoading: true,
        mode: 'synthesis' as BranchPerspective
      };

      setNodes(prev => prev.map(node => {
        if (node.id === id) {
          return {
            ...node,
            title: newVersion.title,
            summary: newVersion.summary,
            text: newVersion.text,
            prompts: newVersion.prompts,
            keyTakeaways: newVersion.keyTakeaways,
            diagramData: newVersion.diagramData,
            status: 'ready',
            versions: [newVersion],
            versionIndex: 0,
          };
        }
        return node;
      }));

      // Generate imagery for synthesis
      fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.title || synthPrompt, style: 'abstract' }),
      }).then(r => r.json()).then(imgData => {
        if (imgData.imageUrl) {
          setNodes(prev => prev.map(node => {
            if (node.id === id) {
              const versions = [...node.versions];
              if (versions[0]) {
                versions[0] = { ...versions[0], imageUrl: imgData.imageUrl, imageLoading: false };
              }
              return { ...node, versions, imageUrl: imgData.imageUrl };
            }
            return node;
          }));
        }
      });

    } catch (err) {
      console.error("Synthesis error:", err);
      setNodes(prev => prev.map(node => node.id === id ? { ...node, status: 'error' } : node));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    let targetX = 0;
    let targetY = 0;
    if (nodes.length > 0) {
      // Find rightmost or lowest region to avoid overlapping
      const maxX = Math.max(...nodes.map(n => n.x));
      const rightmostNodes = nodes.filter(n => Math.abs(n.x - maxX) < 100);
      const maxY = Math.max(...rightmostNodes.map(n => n.y));
      targetX = maxX + NODE_WIDTH + 260;
      targetY = maxY;
    }

    generateNode(query, targetX, targetY);
    setSearchQuery('');
  };

  const handleExpand = (prompt: string, parentId: string, mode: BranchPerspective = 'standard') => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;
    
    // Spawn to the right
    const newX = parent.x + parent.width + 420;
    
    // Offset calculation
    const initialOffset = (Math.random() - 0.5) * 200;
    let newY = parent.y + initialOffset;
    const estimatedHeight = 550;
    
    let isOccupied = true;
    let offsetMultiplier = 1;
    let direction = Math.random() > 0.5 ? 1 : -1;
    
    while (isOccupied) {
      isOccupied = nodes.some(n => 
        Math.abs(n.x - newX) < 180 &&
        Math.abs(n.y - newY) < estimatedHeight
      );
      
      if (isOccupied) {
        newY = parent.y + initialOffset + (estimatedHeight * offsetMultiplier * direction);
        direction *= -1;
        if (direction === 1) {
          offsetMultiplier++;
        }
      }
    }
    
    generateNode(prompt, newX, newY, parentId, undefined, mode);
  };

  const handleRegenerate = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      generateNode(node.prompt, node.x, node.y, node.parentId, nodeId, node.mode, node.imageStyle);
    }
  };

  const handleRegenerateImage = async (nodeId: string, style: VisualStyle) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const versions = [...node.versions];
        if (versions[node.versionIndex]) {
          versions[node.versionIndex] = { ...versions[node.versionIndex], imageLoading: true, imageStyle: style };
        }
        return { ...node, versions, imageStyle: style };
      }
      return node;
    }));

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: node.title || node.prompt, style }),
      });
      const imgData = await res.json();
      if (imgData.imageUrl) {
        setNodes(prev => prev.map(n => {
          if (n.id === nodeId) {
            const versions = [...n.versions];
            if (versions[n.versionIndex]) {
              versions[n.versionIndex] = { ...versions[n.versionIndex], imageUrl: imgData.imageUrl, imageLoading: false };
            }
            return { ...n, versions, imageUrl: imgData.imageUrl };
          }
          return n;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (nodeId: string) => {
    const getDescendants = (id: string, allNodes: GridNodeData[]): string[] => {
      const children = allNodes.filter(n => n.parentId === id).map(n => n.id);
      let desc = [...children];
      for (const childId of children) {
        desc = [...desc, ...getDescendants(childId, allNodes)];
      }
      return desc;
    };
    
    const toDelete = [nodeId, ...getDescendants(nodeId, nodes)];
    setNodes(prev => prev.filter(n => !toDelete.includes(n.id)));
  };

  const setVersion = (nodeId: string, versionIndex: number) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, versionIndex } : n));
  };

  const totalChars = nodes.reduce((acc, node) => acc + ((node.versions[node.versionIndex]?.text?.length) || 0), 0);

  // Filter matching nodes
  const filteredNodes = filterQuery.trim() 
    ? nodes.filter(n => 
        n.prompt.toLowerCase().includes(filterQuery.toLowerCase()) || 
        n.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
        n.title?.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : nodes;

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden dot-grid canvas-bg"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Draggable/Zoomable Canvas */}
      <div 
        className="absolute top-0 left-0 origin-top-left canvas-bg"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          width: '100%',
          height: '100%'
        }}
      >
        <ConnectingLines nodes={nodes} selectedNodeId={focusedNodeId} />
        {filteredNodes.map((node, index) => (
          <NodeCard 
            key={node.id} 
            index={index}
            node={node} 
            isFocused={focusedNodeId === node.id}
            onSelect={(id) => setFocusedNodeId(id)}
            onExpand={handleExpand}
            onRegenerate={handleRegenerate}
            onRegenerateImage={handleRegenerateImage}
            onClose={handleDelete}
            onOpenSynthesis={(id) => {
              setSynthesisInitialNodeId(id);
              setShowSynthesisModal(true);
            }}
            setVersion={setVersion}
            onPointerDown={(e) => handleNodePointerDown(e, node.id)}
          />
        ))}
      </div>

      {/* Initial Search Landing Screen (Zero-State) */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 z-20">
          <div className="flex flex-col items-center max-w-2xl w-full text-center">
            {/* Brand Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 pointer-events-auto shadow-sm">
              <Sparkles size={13} />
              <span>Multi-Dimensional Spatial Knowledge Graph</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl md:text-6xl text-slate-900 tracking-tight mb-3 pointer-events-auto">
              Qelora
            </h1>

            <p className="text-slate-600 text-sm md:text-base mb-8 max-w-lg leading-relaxed pointer-events-auto">
              Traverse complex intellectual domains through non-linear multi-perspective branching, contextual imagery, schematic flowcharts, and cross-disciplinary synthesis.
            </p>

            {/* Central Search Form */}
            <div className="pointer-events-auto w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-2.5 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex px-3 items-center">
                <Search className="text-slate-400 mr-3 shrink-0" size={20} />
                <input
                  autoFocus
                  className="flex-1 outline-none font-sans text-sm md:text-base py-2.5 w-full text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter any concept, question, or paradigm to explore..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="flex gap-2 justify-end shrink-0">
                <button 
                  onClick={handleSearchSubmit}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Explore</span>
                  <Play fill="currentColor" size={14} />
                </button>
              </div>
            </div>

            {/* Starter Suggestion Chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-2xl pointer-events-auto">
              <span className="text-xs font-mono font-medium text-slate-400 mr-1 uppercase tracking-wider">
                Explore:
              </span>
              {STARTER_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => generateNode(topic.title, 0, 0)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{topic.title}</span>
                  <ArrowRight size={11} className="opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Canvas Top Bar (When Active) */}
      {nodes.length > 0 && (
        <div className="absolute top-3 left-3 right-3 md:top-5 md:left-5 md:right-5 pointer-events-none flex flex-wrap md:flex-nowrap items-center justify-between gap-2.5 z-30">
          {/* Top Left: Brand & Reset */}
          <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-1.5 shrink-0">
            <button
              onClick={() => {
                setNodes([]);
                setTransform({ 
                  x: 0, 
                  y: 0, 
                  scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.65 : 0.85 
                });
              }}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold font-display flex items-center gap-2 transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                Q
              </div>
              <span>Qelora</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
              {nodes.length} {nodes.length === 1 ? 'NODE' : 'NODES'}
            </div>

            <button
              onClick={handleAutoLayout}
              className="px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Organize tree hierarchy"
            >
              <Grid size={13} />
              <span className="hidden sm:inline">Organize</span>
            </button>
          </div>

          {/* Top Center: Lineage Breadcrumb Trail */}
          <div className="pointer-events-auto flex justify-center flex-1 max-w-full overflow-hidden order-last md:order-none px-1">
            <BreadcrumbTrail
              nodes={nodes}
              selectedNodeId={focusedNodeId}
              onSelectNode={(nodeId) => setFocusedNodeId(nodeId)}
              onCenterNode={(x, y) => centerOnPosition(x, y)}
            />
          </div>

          {/* Top Right: Search Filter + Synthesis Tool + Export */}
          <div className="pointer-events-auto flex items-center gap-2 shrink-0">
            {/* Filter in Graph */}
            <div className="hidden lg:flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl px-3 py-1.5 text-xs text-slate-700">
              <Filter size={13} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Find in graph..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-28 outline-none text-xs bg-transparent"
              />
              {filterQuery && (
                <button onClick={() => setFilterQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">
                  ×
                </button>
              )}
            </div>

            {/* Cross-Disciplinary Synthesis Tool (Feature 1) */}
            <button
              onClick={() => {
                setSynthesisInitialNodeId(null);
                setShowSynthesisModal(true);
              }}
              disabled={nodes.length < 2}
              className="px-3.5 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-2 shadow-xl shadow-cyan-600/10 transition-all cursor-pointer"
              title="Fuse two nodes into a hybrid synthesis"
            >
              <GitMerge size={14} />
              <span className="hidden sm:inline">Synthesize Nodes</span>
            </button>

            {/* Export & Report Tool (Feature 2) */}
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200/90 text-slate-800 font-medium text-xs flex items-center gap-2 shadow-xl transition-all cursor-pointer"
              title="Export research notebook"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom HUD Controls & Minimap */}
      {nodes.length > 0 && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 pointer-events-auto flex flex-col items-end gap-3 z-30">
          <div className="hidden md:block">
            <Minimap
              nodes={nodes}
              transform={transform}
              onCenterViewport={handleCenterViewport}
              onFitView={handleFitView}
            />
          </div>

          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 p-1 rounded-2xl flex items-center shadow-xl text-slate-700">
            <div className="hidden sm:block px-3 font-mono text-[10px] text-slate-500 font-medium border-r border-slate-200">
              {totalChars} CHARS
            </div>

            <button 
              onClick={handleFitView}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
              title="Fit all nodes to screen"
            >
              <Maximize2 size={15} />
            </button>

            <button 
              onClick={() => handleZoom(-0.2)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
              title="Zoom out"
            >
              <ZoomOut size={15} />
            </button>
            
            <button 
              onClick={() => handleZoom(0.2)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
              title="Zoom in"
            >
              <ZoomIn size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Synthesis Modal */}
      {showSynthesisModal && (
        <SynthesisModal
          nodes={nodes}
          initialNodeId={synthesisInitialNodeId}
          onClose={() => setShowSynthesisModal(false)}
          onSynthesize={handleExecuteSynthesis}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          nodes={nodes}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

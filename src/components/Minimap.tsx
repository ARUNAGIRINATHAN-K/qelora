import React, { useRef } from 'react';
import { GridNodeData, CanvasTransform } from '../types';
import { Compass, Maximize2 } from 'lucide-react';

interface MinimapProps {
  nodes: GridNodeData[];
  transform: CanvasTransform;
  onCenterViewport: (x: number, y: number) => void;
  onFitView?: () => void;
}

export const Minimap: React.FC<MinimapProps> = ({ 
  nodes, 
  transform, 
  onCenterViewport,
  onFitView
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (nodes.length === 0) return null;

  // Find bounds of all nodes
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(node => {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + 450);
  });

  // Add padding
  const padding = 400;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const width = Math.max(maxX - minX, 100);
  const height = Math.max(maxY - minY, 100);

  // Minimap container dimensions
  const mapWidth = 210;
  const mapHeight = 140;

  // Scale map
  const scaleX = mapWidth / width;
  const scaleY = mapHeight / height;
  const mapScale = Math.min(scaleX, scaleY);

  const renderWidth = width * mapScale;
  const renderHeight = height * mapScale;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e);
  };

  const updateFromPointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - (mapWidth - renderWidth) / 2;
    const y = e.clientY - rect.top - (mapHeight - renderHeight) / 2;

    const targetX = (x / mapScale) + minX;
    const targetY = (y / mapScale) + minY;
    
    onCenterViewport(targetX, targetY);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      updateFromPointer(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Viewport frustum
  const viewportWidth = window.innerWidth / transform.scale;
  const viewportHeight = window.innerHeight / transform.scale;
  const viewportX = -transform.x / transform.scale;
  const viewportY = -transform.y / transform.scale;

  const viewRectX = (viewportX - minX) * mapScale;
  const viewRectY = (viewportY - minY) * mapScale;
  const viewRectW = viewportWidth * mapScale;
  const viewRectH = viewportHeight * mapScale;

  return (
    <div 
      className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col p-2.5"
      style={{ width: mapWidth + 20 }}
    >
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 text-slate-500">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
          <Compass size={12} className="text-indigo-600" />
          <span>Spatial Radar</span>
        </div>
        <span className="text-[9px] font-mono text-slate-400">
          {nodes.length} {nodes.length === 1 ? 'NODE' : 'NODES'}
        </span>
      </div>

      <div 
        ref={containerRef}
        className="bg-slate-900 rounded-xl overflow-hidden relative cursor-pointer flex items-center justify-center border border-slate-800"
        style={{ width: mapWidth, height: mapHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div 
          className="relative" 
          style={{ width: renderWidth, height: renderHeight }}
        >
          {/* Connecting branches */}
          {nodes.filter(n => n.parentId).map(node => {
            const parent = nodes.find(n => n.id === node.parentId);
            if (!parent) return null;
            
            const px = (parent.x + parent.width - minX) * mapScale;
            const py = (parent.y + 200 - minY) * mapScale;
            const cx = (node.x - minX) * mapScale;
            const cy = (node.y + 200 - minY) * mapScale;

            return (
              <svg key={`mini-line-${node.id}`} className="absolute top-0 left-0 overflow-visible pointer-events-none w-full h-full">
                <line x1={px} y1={py} x2={cx} y2={cy} stroke="rgba(99, 102, 241, 0.4)" strokeWidth={1.5} />
              </svg>
            );
          })}

          {/* Node dots */}
          {nodes.map((node, i) => {
            const nx = (node.x - minX) * mapScale;
            const ny = (node.y - minY) * mapScale;
            const nw = node.width * mapScale;
            const nh = 380 * mapScale;

            return (
              <div 
                key={node.id} 
                className="absolute bg-slate-300 rounded-[2px] pointer-events-none hover:bg-indigo-400 transition-colors shadow-sm"
                style={{
                  left: nx,
                  top: ny,
                  width: Math.max(nw, 4),
                  height: Math.max(nh, 4),
                }}
              />
            );
          })}

          {/* Active Viewport frustum */}
          <div 
            className="absolute border border-indigo-400 bg-indigo-500/20 rounded-[2px] pointer-events-none transition-all duration-75"
            style={{
              left: viewRectX,
              top: viewRectY,
              width: viewRectW,
              height: viewRectH
            }}
          />
        </div>
      </div>
    </div>
  );
};

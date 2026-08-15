export type BranchPerspective = 
  | 'standard' 
  | 'deep-dive' 
  | 'contrarian' 
  | 'applications' 
  | 'timeline' 
  | 'analogy'
  | 'synthesis';

export type VisualStyle = 
  | 'editorial' 
  | 'schematic' 
  | 'sketch' 
  | 'abstract';

export interface NodeVersion {
  prompt: string;
  title?: string;
  summary?: string;
  text: string;
  prompts: string[];
  keyTakeaways?: string[];
  diagramData?: string;
  asciiArt?: string;
  imageUrl?: string;
  imageLoading?: boolean;
  imageStyle?: VisualStyle;
  mode?: BranchPerspective;
}

export interface GridNodeData {
  id: string;
  x: number;
  y: number;
  width: number;
  prompt: string;
  title?: string;
  summary?: string;
  text: string;
  prompts: string[];
  keyTakeaways?: string[];
  diagramData?: string;
  asciiArt?: string;
  imageUrl?: string;
  imageLoading?: boolean;
  status: 'generating' | 'ready' | 'error';
  versionIndex: number;
  versions: NodeVersion[];
  parentId?: string;
  synthesizedFrom?: [string, string]; // [NodeIdA, NodeIdB]
  mode?: BranchPerspective;
  imageStyle?: VisualStyle;
}


export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

declare global {
  interface Window {
    aistudio?: {
      openSelectKey?: () => Promise<boolean | void>;
    };
  }
}


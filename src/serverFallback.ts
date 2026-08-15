// Intelligent fallback knowledge engine for when Gemini API quota or project permissions are limited

export interface GeneratedNodeResult {
  title: string;
  summary: string;
  text: string;
  prompts: string[];
  keyTakeaways: string[];
  diagramData: string;
  fallbackMode?: boolean;
}

export function generateSmartFallback(
  prompt: string,
  mode: string = "standard",
  parentContext?: string
): GeneratedNodeResult {
  const cleanPrompt = prompt.trim();
  const words = cleanPrompt.split(/\s+/);
  const mainSubject = words.slice(0, 4).join(" ");
  
  // Dynamic perspectives
  let modeHeadline = "Core Theoretical Foundation";
  let modeTone = "";
  if (mode === "deep-dive") {
    modeHeadline = "Rigorous Mechanics & Principles";
    modeTone = "From a formal mechanistic standpoint, ";
  } else if (mode === "contrarian") {
    modeHeadline = "Critical Inquiries & Counter-Paradigms";
    modeTone = "Contrary to mainstream assumptions, ";
  } else if (mode === "applications") {
    modeHeadline = "Applied Systems & Implementations";
    modeTone = "In operational real-world deployments, ";
  } else if (mode === "timeline") {
    modeHeadline = "Evolutionary Trajectory & Frontiers";
    modeTone = "Tracing its historical discovery to next-generation paradigms, ";
  } else if (mode === "analogy") {
    modeHeadline = "Cross-Domain Metaphors & Isomorphisms";
    modeTone = "Conceptually isomorphic to complex natural architectures, ";
  }

  // Derive sub-concepts for branching links
  const subConcepts = [
    `${mainSubject} Architecture`,
    `Emergent Dynamics`,
    `Boundary Conditions`,
    `Empirical Verification`,
    `Nonlinear Feedback`
  ];

  const title = cleanPrompt.length < 35 
    ? cleanPrompt.replace(/\b\w/g, l => l.toUpperCase())
    : words.slice(0, 5).join(" ").replace(/\b\w/g, l => l.toUpperCase());

  const factualDefinition = `**${title}** represents the foundational baseline context and principles of this operational system.`;
  const summary = `${factualDefinition} ${modeTone ? `${modeTone}it` : "It"} governs how interconnected agents and informational structures resolve complex states under entropy and observational constraints.`;

  const text = `### ${modeHeadline}

${summary}

#### Key Structural Pillars
- **Mechanistic Substrate**: Investigates how [${subConcepts[0]}](${subConcepts[0]}) establishes baseline invariants across diverse operational domains.
- **Dynamic Equilibrium**: How continuous states interact with [${subConcepts[1]}](${subConcepts[1]}) to prevent systemic instability while maximizing adaptive throughput.
- **Constraint Formulation**: Defining rigorous [${subConcepts[2]}](${subConcepts[2]}) that bound possible state spaces and prevent catastrophic divergence.

${parentContext ? `*Contextual Linkage:* Building directly upon *"${parentContext.slice(0, 100)}..."*, this node bridges theoretical bounds with [${subConcepts[3]}](${subConcepts[3]}) and multi-scale [${subConcepts[4]}](${subConcepts[4]}).` : `*Exploratory Significance:* Demonstrates the transition between abstract model formulations and measurable system responses.`}
`;

  const prompts = [
    `How does [${subConcepts[0]}](${subConcepts[0]}) behave under critical non-linear stress?`,
    `What are the strongest empirical counter-arguments against standard ${cleanPrompt} assumptions?`,
    `How can ${mainSubject} be deployed in industrial high-throughput systems?`,
    `How is ${cleanPrompt} topologically analogous to cellular signaling networks?`
  ];

  const keyTakeaways = [
    `Establishes mathematical and conceptual bounds for ${mainSubject}.`,
    `Reveals critical phase transitions governed by ${subConcepts[1]}.`,
    `Provides actionable heuristics for experimental design and applied scaling.`
  ];

  const diagramData = `graph LR;
  A[${title.slice(0, 18)}] -->|Drives| B[${subConcepts[0].slice(0, 18)}]
  A -->|Governed By| C[${subConcepts[1].slice(0, 18)}]
  B -->|Validates| D[${subConcepts[3].slice(0, 18)}]
  C -->|Binds| D`;

  return {
    title,
    summary,
    text,
    prompts,
    keyTakeaways,
    diagramData,
    fallbackMode: true
  };
}

export function generateSynthesisFallback(nodeA: any, nodeB: any): GeneratedNodeResult {
  const titleA = nodeA.title || nodeA.prompt || "Concept A";
  const titleB = nodeB.title || nodeB.prompt || "Concept B";
  const hybridTitle = `${titleA.split(' ')[0]} × ${titleB.split(' ')[0]}: Emergent Synergy`;

  const bridgeConcept1 = `${titleA} Mechanics`;
  const bridgeConcept2 = `${titleB} Substrate`;
  const bridgeConcept3 = `Hybrid Algorithmic Synthesis`;

  const summary = `The intersection of **${titleA}** and **${titleB}** creates a hybrid conceptual domain where cross-pollinated feedback loops solve foundational boundary limits of both disciplines.`;

  const text = `### Emergent Cross-Disciplinary Convergence

When we map the formal principles of **${titleA}** onto the structural dynamics of **${titleB}**, several non-obvious isomorphisms emerge.

#### 1. Core Interfacial Bridge
The foundational axioms of [${bridgeConcept1}](${bridgeConcept1}) provide the mathematical framing necessary to optimize the discrete states in [${bridgeConcept2}](${bridgeConcept2}).

#### 2. Cross-Pollinated Capabilities
- **Dual-State Regulation**: Combining deterministic constraints with adaptive heuristic exploration.
- **Multi-Scale Emergence**: Leveraging [${bridgeConcept3}](${bridgeConcept3}) to transcend single-domain bottlenecks.

#### 3. Frontier Research Vectors
This synthesis opens unexplored avenues in computational modeling, autonomous architecture, and cognitive systems.`;

  const prompts = [
    `What experimental paradigm could empirically test the union of ${titleA} and ${titleB}?`,
    `Where does the analogy between ${titleA} and ${titleB} mathematically break down?`,
    `How can [${bridgeConcept3}](${bridgeConcept3}) be implemented in production software?`
  ];

  const keyTakeaways = [
    `Eliminates isolated domain constraints by introducing cross-system feedback.`,
    `Uncovers shared topological principles between ${titleA} and ${titleB}.`,
    `Generates immediate fertile hypotheses for next-generation research.`
  ];

  const diagramData = `graph TD;
  A[${titleA.slice(0, 16)}] -->|Transfers Schema| C[Hybrid Emergence]
  B[${titleB.slice(0, 16)}] -->|Supplies Domain| C
  C -->|Yields| D[${bridgeConcept3.slice(0, 20)}]`;

  return {
    title: hybridTitle,
    summary,
    text,
    prompts,
    keyTakeaways,
    diagramData,
    fallbackMode: true
  };
}

export function generateStyledVisualSvg(title: string, style: string = 'editorial'): string {
  const cleanTitle = (title || 'Concept Space').replace(/[<>&"]/g, '');
  
  // Generate deterministic color palettes based on string hash
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 45) % 360;
  const h3 = (h1 + 180) % 360;

  let visualElements = '';

  if (style === 'schematic') {
    // Technical blueprint aesthetic
    visualElements = `
      <rect width="1280" height="720" fill="#0B1120" />
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1280" height="720" fill="url(#grid)" />
      <!-- Schematics Geometry -->
      <circle cx="640" cy="360" r="220" fill="none" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.6"/>
      <circle cx="640" cy="360" r="140" fill="none" stroke="#3B82F6" stroke-width="2" opacity="0.8"/>
      <circle cx="640" cy="360" r="60" fill="none" stroke="#6366F1" stroke-width="1.5"/>
      <line x1="240" y1="360" x2="1040" y2="360" stroke="#06B6D4" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <line x1="640" y1="120" x2="640" y2="600" stroke="#06B6D4" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <polygon points="640,240 740,420 540,420" fill="none" stroke="#38BDF8" stroke-width="2" opacity="0.7"/>
      <text x="640" y="365" fill="#E2E8F0" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle" letter-spacing="4">${cleanTitle.toUpperCase()}</text>
      <text x="640" y="480" fill="#38BDF8" font-family="monospace" font-size="12" text-anchor="middle" letter-spacing="2">SYSTEM SCHEMA // ARCHITECTURAL TOPOLOGY</text>
    `;
  } else if (style === 'sketch') {
    // Notebook charcoal sketch aesthetic
    visualElements = `
      <rect width="1280" height="720" fill="#18181B" />
      <circle cx="640" cy="360" r="200" fill="none" stroke="#71717A" stroke-width="1" stroke-dasharray="3 3"/>
      <ellipse cx="640" cy="360" rx="260" ry="120" fill="none" stroke="#A1A1AA" stroke-width="1.5" transform="rotate(30 640 360)" opacity="0.6"/>
      <ellipse cx="640" cy="360" rx="260" ry="120" fill="none" stroke="#D4D4D8" stroke-width="1.5" transform="rotate(-30 640 360)" opacity="0.6"/>
      <circle cx="640" cy="360" r="16" fill="#F4F4F5" opacity="0.9"/>
      <text x="640" y="520" fill="#E4E4E7" font-family="serif" font-style="italic" font-size="24" text-anchor="middle">${cleanTitle}</text>
    `;
  } else if (style === 'abstract') {
    // 3D Geometric render aesthetic
    visualElements = `
      <rect width="1280" height="720" fill="#030712" />
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="hsl(${h1}, 80%, 60%)" stop-opacity="0.8" />
          <stop offset="60%" stop-color="hsl(${h2}, 85%, 40%)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#030712" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${h1}, 90%, 70%)" />
          <stop offset="100%" stop-color="hsl(${h3}, 90%, 40%)" />
        </linearGradient>
      </defs>
      <circle cx="640" cy="360" r="340" fill="url(#glow)" />
      <polygon points="640,160 840,280 840,480 640,580 440,480 440,280" fill="url(#polyGrad)" opacity="0.85" />
      <polygon points="640,160 640,580 440,280" fill="#FFFFFF" opacity="0.15" />
      <polygon points="640,160 840,280 640,370" fill="#000000" opacity="0.25" />
      <text x="640" y="375" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="28" text-anchor="middle" letter-spacing="2" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.8))">${cleanTitle}</text>
    `;
  } else {
    // Editorial Cinematic aesthetic
    visualElements = `
      <rect width="1280" height="720" fill="#020617" />
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${h1}, 70%, 25%)" />
          <stop offset="50%" stop-color="hsl(${h2}, 60%, 15%)" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bgGrad)" />
      <circle cx="640" cy="340" r="180" fill="none" stroke="hsl(${h1}, 90%, 65%)" stroke-width="3" opacity="0.7"/>
      <circle cx="640" cy="340" r="90" fill="hsl(${h2}, 90%, 55%)" opacity="0.3" filter="blur(20px)"/>
      <line x1="300" y1="340" x2="980" y2="340" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <line x1="640" y1="120" x2="640" y2="560" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      <text x="640" y="348" fill="#F8FAFC" font-family="sans-serif" font-weight="800" font-size="30" text-anchor="middle" letter-spacing="1">${cleanTitle}</text>
      <text x="640" y="480" fill="hsl(${h1}, 80%, 75%)" font-family="monospace" font-size="13" text-anchor="middle" letter-spacing="3">QELORA KNOWLEDGE NODE // EXPLORATION</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${visualElements}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

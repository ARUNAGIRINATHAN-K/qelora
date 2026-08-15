# Contributing to Qelora

Thank you for your interest in contributing to **Qelora**! We welcome contributions from developers, researchers, designers, and AI enthusiasts of all skill levels.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started & Local Setup](#getting-started--local-setup)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [High-Priority Contribution Ideas](#-high-priority-contribution-ideas)
   - [Idea 1: Multi-Provider AI Engine (OpenAI, Anthropic, Ollama)](#1-multi-provider-ai-engine-openai-anthropic-ollama)
   - [Idea 2: Real-time Multi-User Collaboration](#2-real-time-multi-user-collaboration)
   - [Idea 3: Document Ingestion (PDF / EPUB / ArXiv parser)](#3-document-ingestion-pdf--epub--arxiv-parser)
   - [Idea 4: KaTeX / MathJax LaTeX Formula Rendering](#4-katex--mathjax-latex-formula-rendering)
6. [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct
Please be respectful, collaborative, and constructive in all issues, pull requests, and discussions.

---

## Getting Started & Local Setup

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/ARUNAGIRINATHAN-K/qelora.git
   cd qelora
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your API keys (optional — Qelora runs offline with its built-in semantic engine).
5. **Start development server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser.

---

## Development Workflow

- **Branch Naming**: Use descriptive branch names:
  - `feat/openai-provider-adapter`
  - `fix/minimap-bounding-box`
  - `docs/update-architecture-diagram`
- **Linting & Validation**: Run TypeScript checks before committing:
  ```bash
  npm run lint
  npm run build
  ```

---

## Coding Standards

- **TypeScript**: Strict typing across all components. Use types from `src/types.ts`. Avoid `any`.
- **Icons**: Always import icons from `lucide-react`.
- **Animations**: Use `motion` imported from `motion/react`.
- **Styling**: Tailwind CSS utility classes directly in `className`. Follow WCAG AA contrast rules and mathematical nested border-radius logic (`Inner Radius = Outer Radius - Padding`).
- **Server Security**: Keep all AI secret keys strictly server-side in `server.ts` or server modules. Never expose API keys with `VITE_` prefixes.

---

## High-Priority Contribution Ideas

Here are several impactful features and extensions looking for contributors:

---

### 1. Multi-Provider AI Engine (OpenAI, Anthropic, Ollama)

**Goal:** Create a modular provider adapter pattern in the backend so users can choose their preferred LLM provider via settings or `.env`.

#### Proposed Architecture:
Create `server/providers/` with a unified interface:

```typescript
// server/providers/types.ts
export interface LLMProvider {
  name: string;
  generateNode(prompt: string, mode: string, parentContext?: string): Promise<GeneratedNodeResult>;
  synthesizeNodes(nodeA: any, nodeB: any): Promise<GeneratedNodeResult>;
  generateImage?(prompt: string, style: string): Promise<string>;
}
```

#### Implementation Guide for Providers:

#### A. OpenAI Adapter (`server/providers/openai.ts`)
- **Package**: `npm install openai`
- **Env**: `OPENAI_API_KEY`, `OPENAI_MODEL` (e.g., `gpt-4o`, `gpt-4o-mini`)
- **Pattern**: Use OpenAI's Structured Outputs (`response_format: { type: "json_schema", ... }` or `response_format: { type: "json_object" }`).
- **Image**: Support DALL-E 3 via `openai.images.generate({ model: "dall-e-3", prompt, response_format: "b64_json" })`.

#### B. Anthropic Claude Adapter (`server/providers/anthropic.ts`)
- **Package**: `npm install @anthropic-ai/sdk`
- **Env**: `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` (e.g., `claude-3-5-sonnet-20241022`, `claude-3-7-sonnet-20250219`)
- **Pattern**: Use Tool Calling or JSON mode prompting with System Instructions to extract the structured node schema (`title`, `summary`, `text`, `prompts`, `keyTakeaways`, `diagramData`).

#### C. Local Ollama Adapter (`server/providers/ollama.ts`)
- **Target**: Zero-cost, 100% private local offline inference via [Ollama](https://ollama.com).
- **Endpoint**: `http://localhost:11434/api/generate` or using the OpenAI SDK with `baseURL: "http://localhost:11434/v1"`.
- **Recommended Models**: `llama3.2:3b`, `qwen2.5:7b`, `mistral:7b`, `deepseek-r1:8b`.
- **Pattern**: Pass the JSON schema in the `format: "json"` parameter of Ollama API.

#### D. Provider Selector:
Allow dynamic selection via `.env`:
```env
AI_PROVIDER=gemini # Options: gemini | openai | anthropic | ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

### 2. Real-time Multi-User Collaboration
- **Goal**: Enable multiple researchers to share an infinite canvas in real-time.
- **Tech Stack**: Socket.io / WebSockets or Yjs (CRDTs).
- **Scope**: Broadcast node creation, dragging coordinates, and live participant cursor positions.

---

### 3. Document Ingestion (PDF / EPUB / ArXiv parser)
- **Goal**: Allow dragging and dropping a scientific PDF paper or book chapter onto the canvas.
- **Scope**: Extract executive chapters and auto-generate an initial root knowledge graph representing the paper's thesis, methodology, counter-arguments, and conclusions.

---

### 4. KaTeX / MathJax LaTeX Formula Rendering
- **Goal**: Render inline math (`$E=mc^2$`) and display math (`$$\nabla \times \mathbf{B} = \mu_0 \mathbf{J}$$`) inside the node markdown content.
- **Tech Stack**: `remark-math` + `rehype-katex`.

---

## Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request from your fork to the main repository.
3. Fill out the PR template with:
   - **Summary of changes**
   - **Screenshots / GIFs** (if UI changes were made)
   - **Testing performed**
4. Maintainers will review and provide feedback promptly!

Thank you for helping make Qelora the ultimate spatial tool for thought! 🚀

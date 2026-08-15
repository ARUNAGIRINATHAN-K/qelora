import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateSmartFallback, generateSynthesisFallback, generateStyledVisualSvg } from "./src/serverFallback.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json({ limit: "50mb" }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Main Knowledge Node Generation with Perspective Modes
  app.post("/api/generate", async (req, res) => {
    const { prompt, parentContext, mode = "standard" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      let modeInstruction = "";
      if (mode === "deep-dive") {
        modeInstruction = "Focus on rigorous technical mechanics, foundational equations/axioms, subtle nuances, and underlying principles.";
      } else if (mode === "contrarian") {
        modeInstruction = "Focus on major counter-arguments, scientific critiques, alternative competing theories, potential pitfalls, and edge cases.";
      } else if (mode === "applications") {
        modeInstruction = "Focus on concrete real-world case studies, current commercial/scientific applications, and practical implementation stories.";
      } else if (mode === "timeline") {
        modeInstruction = "Focus on historical breakthroughs, pivotal discoveries, and 5-to-10 year future projections/frontiers.";
      } else if (mode === "analogy") {
        modeInstruction = "Focus on cross-disciplinary connections, explaining this concept via unexpected analogies to nature, architecture, sociology, or physics.";
      }

      const parentContextText = parentContext ? `\nParent Context: "${parentContext}"\nConnect and build upon this context.` : "";

      const systemInstruction = `You are Qelora, a world-class spatial knowledge engine and research intelligence assistant.
Respond to the query with clear, highly engaging, and intellectually rich content in strict JSON format.
${modeInstruction}${parentContextText}

Format requirements:
- 'title': A punchy, precise 2-5 word concept title.
- 'summary': A 1-2 sentence executive synopsis.
- 'text': Comprehensive explanatory text with rich formatting (bullet points, bold highlights, sub-sections). Keep it substantive yet concise (approx. 180-260 words).
  CRITICAL REQUIREMENT: You MUST embed 3 to 5 key terms or intriguing sub-topics as markdown links formatted EXACTLY as \`[Term Name](Term Name)\` (e.g. \`[Quantum Superposition](Quantum Superposition)\`). This enables interactive visual branching.
- 'prompts': An array of 4 distinct, thoughtful follow-up exploration ideas spanning:
  1. A deep technical question
  2. A contrarian or edge-case angle
  3. A real-world application
  4. An interdisciplinary analogy
- 'keyTakeaways': An array of 3 bullet points summarizing core insights.
- 'diagramData': A concise mermaid flowchart (e.g. \`graph TD; A[Concept]-->B[Sub-component]; A-->C[Effect]\`) or structured relationship breakdown explaining the core mechanics visually.`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              text: { type: Type.STRING },
              prompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              diagramData: { type: Type.STRING },
            },
            required: ["title", "summary", "text", "prompts", "keyTakeaways"],
          },
        },
      });

      let rawText = textResponse.text || "{}";
      rawText = rawText.replace(/```(json)?/gi, '').trim();
      const responseData = JSON.parse(rawText);
      return res.json(responseData);
    } catch {
      // Fallback seamlessly to the internal semantic knowledge engine
      const fallbackResult = generateSmartFallback(prompt, mode, parentContext);
      return res.json(fallbackResult);
    }
  });

  // Cross-Node Synthesis Endpoint
  app.post("/api/synthesize-nodes", async (req, res) => {
    const { nodeA, nodeB } = req.body;
    if (!nodeA || !nodeB) {
      return res.status(400).json({ error: "Both nodes are required for synthesis." });
    }

    try {
      const prompt = `Synthesize the profound relationship and emergent intersection between:\nConcept A: "${nodeA.prompt}" (${nodeA.title || ''})\nContext A: ${nodeA.text?.slice(0, 300) || ''}\n\nAND\nConcept B: "${nodeB.prompt}" (${nodeB.title || ''})\nContext B: ${nodeB.text?.slice(0, 300) || ''}`;

      const systemInstruction = `You are Qelora's Cross-Disciplinary Synthesis Engine.
Your task is to identify non-obvious intersections, emergent paradigms, and hybrid breakthroughs that occur when combining Concept A and Concept B.
Return a structured JSON object with:
- 'title': A creative hybrid title (e.g. "Quantum Neurobiology: Emergence at the Synapse").
- 'summary': A single captivating thesis statement of their intersection.
- 'text': A structured breakdown of: 1. The Core Intersection, 2. Emergent Synergies, 3. Unresolved Questions.
  Embed 3-4 markdown links formatted as \`[Term](Term)\` for further branching.
- 'prompts': 3 new thought-provoking questions spawned by this synthesis.
- 'keyTakeaways': 3 actionable takeaways.
- 'diagramData': A simple mermaid graph showing how Concept A and B converge into the synthesis.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              text: { type: Type.STRING },
              prompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              diagramData: { type: Type.STRING },
            },
            required: ["title", "summary", "text", "prompts", "keyTakeaways"],
          },
        },
      });

      let rawText = response.text || "{}";
      rawText = rawText.replace(/```(json)?/gi, '').trim();
      return res.json(JSON.parse(rawText));
    } catch {
      // Fallback seamlessly to cross-node synthesizer
      const fallbackSynthesis = generateSynthesisFallback(nodeA, nodeB);
      return res.json(fallbackSynthesis);
    }
  });

  // Multi-Style Image Generation Endpoint
  app.post("/api/generate-image", async (req, res) => {
    const { prompt, style = "editorial", imageBase64 } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      let stylePrefix = "High-contrast editorial photography, clean lighting, cinematic composition. Single cohesive subject. No text inside the image. ";
      if (style === "schematic") {
        stylePrefix = "Precise technical blueprint and architectural schematic illustration, clean wireframe lines, dark minimalist background, elegant diagrammatic aesthetic. No random text letters. ";
      } else if (style === "sketch") {
        stylePrefix = "Minimalist fine-line concept illustration, charcoal and ink botanical/scientific notebook style on clean paper texture. ";
      } else if (style === "abstract") {
        stylePrefix = "Vibrant dimensional geometric 3D render, subtle iridescent subsurface scattering, sophisticated typography-ready composition. ";
      }

      const parts: any[] = [{ text: stylePrefix + prompt }];
      if (imageBase64) {
        const match = imageBase64.match(/^data:(image\/[a-zA-Z]*);base64,([^"]*)$/);
        if (match && match.length === 3) {
          parts.unshift({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
        }
      }

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        } as any,
      });

      let base64EncodeString = "";
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64EncodeString = part.inlineData.data;
          break;
        }
      }

      if (base64EncodeString) {
        return res.json({ imageUrl: `data:image/jpeg;base64,${base64EncodeString}` });
      } else {
        throw new Error("No image data returned from model");
      }
    } catch {
      // Fallback seamlessly to the styled vector diagram generator
      const svgUrl = generateStyledVisualSvg(prompt, style);
      return res.json({ imageUrl: svgUrl });
    }
  });

  // Audio Speech Generation Endpoint for Node Briefing
  app.post("/api/generate-speech", async (req, res) => {
    const { text, voice = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*_`]/g, '').slice(0, 350);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Provide an articulate, engaging audio briefing for a knowledge node: ${cleaned}` }] }],
        config: {
          responseModalities: ["AUDIO" as any],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioBase64: base64Audio });
      } else {
        return res.json({ fallbackToClientTTS: true });
      }
    } catch {
      // Fallback to high-performance Web Speech API
      return res.json({ fallbackToClientTTS: true });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();


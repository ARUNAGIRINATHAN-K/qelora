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
    const { prompt, parentContext, mode = "standard", systemPrompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not set - using internal knowledge engine");
      }

      let modeInstruction = "";
      if (mode === "deep-dive") {
        modeInstruction = "Focus on rigorous, first-principles technical mechanics, internal state transitions, exact formulas/algorithms, and domain-specific terminology.";
      } else if (mode === "contrarian") {
        modeInstruction = "Focus on documented scientific/engineering critiques, real-world edge cases, fundamental bottlenecks, bias/leakage risks, and competing alternative paradigms.";
      } else if (mode === "applications") {
        modeInstruction = "Focus on industry production architectures, canonical case studies, real tools/libraries, and concrete deployment workflows.";
      } else if (mode === "timeline") {
        modeInstruction = "Focus on verified historical milestones (with real pioneer names and dates) and modern active research frontiers.";
      } else if (mode === "analogy") {
        modeInstruction = "Focus on an intuitive, physically grounded analogy that accurately maps 1-to-1 to the underlying mechanism without oversimplifying.";
      }

      const parentContextText = parentContext ? `\nParent Context: "${parentContext}"\nConnect logically with this context while addressing the specific topic.` : "";

      const defaultSystemInstruction = `You are Qelora, an authoritative knowledge graph and concept intelligence engine.
PRIMARY DIRECTIVES:
1. FACTUAL ACCURACY & CLEAR DEFINITIONS: Start the explanation with an objective, plain, and factually accurate definition of the topic in plain, precise terms (e.g. what it is, its core purpose, and how it is applied). Avoid vague, pretentious, or pseudo-intellectual buzzwords.
2. PROGRESSIVE PEDAGOGICAL STRUCTURE:
   - Section 1 (Objective Definition): Plain, textbook-accurate factual definition and fundamental purpose.
   - Section 2 (Core Mechanics & Pipeline): Core working mechanics, step-by-step pipeline, or foundational components.
   - Section 3 (Theoretical Complexity & Nuances): Progressive theoretical complexity, mathematical constraints, trade-offs, and research frontiers.
3. KEY TAKEAWAYS: Provide 3 concise, fact-checked takeaway bullets summarizing the core insights.
4. VERIFIED DOMAIN TERMINOLOGY: Use standard, authentic terminology from the topic's actual field.
5. INTERACTIVE BRANCHING: Embed 3 to 5 real, specific sub-concepts as markdown links formatted EXACTLY as \`[Concept Name](Concept Name)\`.`;

      const activeSystemInstruction = systemPrompt 
        ? `${systemPrompt}\n\n${modeInstruction}${parentContextText}`
        : `${defaultSystemInstruction}\n\n${modeInstruction}${parentContextText}`;

      const userContent = `Topic to analyze: "${prompt}"\nProvide a deeply factual, highly relevant, and pedagogically structured breakdown of this exact concept or question.`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userContent,
        config: {
          systemInstruction: activeSystemInstruction,
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
    } catch (err: any) {
      console.log(`[Qelora Knowledge Engine] Serving verified topic knowledge for: "${prompt}" (Reason: ${err.message || 'API fallback'})`);
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
Your task is to analyze the factual, structural, and conceptual intersection between Concept A and Concept B.
Avoid hyperbolic or vague prose. Focus on concrete architectural bridges, shared formal mathematical/computational models, real-world cross-disciplinary applications, and legitimate theoretical tensions.

Structure the 'text' progressively:
1. **Clear Interfacial Definition**: State plainly how these two fields/concepts interface, the exact bridge between them, and the concrete problem their combination addresses.
2. **Mechanisms of Convergence**: Detail the exact technical/scientific mechanisms that connect them.
3. **Emergent Frontiers & Open Questions**: Explain realistic new capabilities, theoretical trade-offs, and active research challenges.

Return a structured JSON object with:
- 'title': A precise hybrid title (e.g. "Neuromorphic Computing: Spiking Neural Networks in Silicon").
- 'summary': A 1-2 sentence crystal-clear factual summary of the core intersection.
- 'text': Comprehensive progressive explanation (approx 200-260 words). Embed 3-4 markdown links formatted as \`[Term](Term)\` representing real domain concepts.
- 'prompts': 3 grounded follow-up research questions spawned by this intersection.
- 'keyTakeaways': 3 actionable, factual takeaways.
- 'diagramData': A valid Mermaid graph (e.g. \`graph TD; A[Concept A] --> C[Interface]; B[Concept B] --> C; C --> D[Application/Outcome]\`) showing the concrete convergence.`;

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

      let parts: any[] = [{ text: stylePrefix + prompt }];
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


import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Multi-turn chat endpoint for Tribute & Gratitude Companion
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, modelChoice = 'gemini-3.8-flash' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const systemInstruction = `You are the Tribute & Dedication Companion for a special appreciation project honoring Eng. Mohamed Anwar, an esteemed, beloved educator and engineering mentor.
Your purpose is to help students, colleagues, and visitors express genuine, profound gratitude, respect, and admiration for Eng. Mohamed Anwar.
You can:
1. Compose heartfelt thank-you letters, tributes, and dedication notes in English.
2. Write moving, respectful poetry and classical expressions honoring the noble profession of teaching and Eng. Mohamed Anwar specifically.
3. Suggest warm, respectful sentiments for occasions such as Teacher's Day, graduation, or a student's personal milestone.
Always maintain a deeply respectful, warm, articulate, and inspiring tone. Honor the values of patience, mentorship, and lifelong guidance.`;

    // Map conversation to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Choose model based on speed or complexity
    const validModel =
      modelChoice === 'gemini-3.1-flash-lite'
        ? 'gemini-3.1-flash-lite'
        : 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: validModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const reply = response.text || 'Thank you for honoring Eng. Mohamed Anwar.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response. Please verify your GEMINI_API_KEY.',
    });
  }
});

// High-quality commemorative artwork generation endpoint
app.post('/api/generate-tribute-art', async (req: Request, res: Response) => {
  try {
    const { prompt, imageSize = '1K', style = 'celestial' } = req.body;

    const enrichedPrompt = `A majestic, ultra-elegant commemorative digital tribute artwork celebrating an inspiring educator, Eng. Mohamed Anwar.
Style: ${style === 'celestial' ? 'Deep cosmic navy background, glowing sapphire starlight, luminous blue particle constellations, sparkling celestial heart motif, clean typography elegance.' : style === 'gold' ? 'Royal navy blue and polished gold illumination, ornate luxury seal of educational honor, regal flourishes, majestic lighting.' : 'Luminescent blue neon ribbons, soft glowing orbs, futuristic elegance, celestial nebulae, respectful dedication theme.'}.
Additional details: ${prompt || 'Heartfelt tribute to an extraordinary mentor'}.
Cinematic studio lighting, pristine composition, 8k quality, masterpiece.`;

    // Use gemini-nano-banana-2.1 for high-quality resolution (1K, 2K, 4K)
    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: [{ text: enrichedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: imageSize as '1K' | '2K' | '4K',
        },
      },
    });

    let imageUrl: string | null = null;
    let textResponse = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image was returned by the model.' });
    }

    return res.json({ imageUrl, text: textResponse });
  } catch (error: any) {
    console.error('Image gen error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate tribute artwork. Please check your paid model API key.',
    });
  }
});

// Text-to-speech endpoint for heartfelt voice narration
app.post('/api/generate-speech', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Charon' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Warm, sincere, deeply respectful and grateful student voice expressing heartfelt appreciation',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned' });
    }

    return res.json({ audio: `data:audio/wav;base64,${base64Audio}` });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({
      error: error?.message || 'TTS generation unavailable.',
    });
  }
});

// Static files and Vite integration
async function startServer() {
  // Serve public folder directly
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

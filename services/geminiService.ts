import { GoogleGenAI, Type } from "@google/genai";
import { PuzzleData } from '../types';

export const generatePuzzle = async (): Promise<PuzzleData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Generate a 'Blossom' style word puzzle.
    Rules:
    1. Select 7 distinct letters.
    2. Choose 1 'center' letter and 6 'outer' letters.
    3. Ensure there is at least one 'pangram' (a word that uses all 7 letters).
    4. Provide a list of at least 50 common English words that can be formed using these letters. 
       - Words must contain the center letter.
       - Words must be at least 4 letters long.
       - Words can strictly ONLY use the 7 provided letters (letters can be repeated).
    
    Output JSON with keys: centerLetter, outerLetters (array), validWords (array), pangrams (array).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            centerLetter: { type: Type.STRING },
            outerLetters: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            validWords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            pangrams: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["centerLetter", "outerLetters", "validWords", "pangrams"]
        },
        temperature: 0.7, // Some variety
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No data returned from Gemini");
    }
    
    const data = JSON.parse(text);
    
    // Sanitize data to be uppercase
    return {
      centerLetter: data.centerLetter.toUpperCase(),
      outerLetters: data.outerLetters.map((l: string) => l.toUpperCase()),
      validWords: data.validWords.map((w: string) => w.toUpperCase()),
      pangrams: data.pangrams.map((w: string) => w.toUpperCase()),
    };
  } catch (error) {
    console.error("Failed to generate puzzle:", error);
    // Fallback static puzzle if API fails critically
    return {
      centerLetter: 'L',
      outerLetters: ['B', 'O', 'S', 'M', 'E', 'A'], // BLOSSOM
      validWords: ['FLOWERS', 'LOWER', 'FLOWER', 'ROWER', 'SOWER', 'SLOW', 'FLOW', 'WOLF', 'ROLE', 'ROSE', 'SORE', 'LOSE', 'LESS', 'SEER', 'FEEL', 'FLEE', 'FREE', 'REEL'],
      pangrams: ['FLOWERS']
    };
  }
};

// Optional: Validate a specific obscure word if not in the initial list
export const validateWordWithGemini = async (word: string, letters: string[]): Promise<boolean> => {
    if (!process.env.API_KEY) return false;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Is "${word}" a valid English word? Answer with strictly valid JSON boolean.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                 responseMimeType: "application/json",
                 responseSchema: { type: Type.BOOLEAN }
            }
        });
        const text = response.text;
        return text ? JSON.parse(text) : false;
    } catch (e) {
        return false;
    }
};
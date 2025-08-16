
import { GoogleGenAI } from "@google/genai";
import type { OutfitGenerationParams, OutfitResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-3.0-generate-002';

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!text) return "";
  const langMap: { [key: string]: string } = {
      'zh': 'Chinese (Simplified)',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ru': 'Russian',
  };
  const targetLangName = langMap[targetLanguage] || 'English';

  const prompt = `Translate the following fashion outfit description to ${targetLangName}. Keep the tone stylish and descriptive. Do not add any extra text or pleasantries, just the translation.\n\nDescription:\n"${text}"`;

  try {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
      console.error("Translation failed, returning original text.", error);
      return text; // Fallback to original text on error
  }
};


export const generateOutfit = async (params: OutfitGenerationParams, locale: string): Promise<OutfitResult> => {
  // Step 1: Generate a detailed text description of the outfit in English.
  // The model works best with English prompts for this kind of creative generation.
  const descriptionPrompt = `
    You are a world-class fashion stylist. Based on the following criteria, create a detailed and appealing description for a complete outfit.
    Describe the main clothing items (top, bottom, outerwear), footwear, and at least two accessories.
    Explain briefly why the combination is stylish and cohesive.

    Criteria:
    - Fashion Style: ${params.style}
    - Occasion: ${params.occasion}
    - Gender: ${params.gender}
    - Key Garment to build around: ${params.keyGarment || 'None specified'}
    - Preferred Color Palette: ${params.colorPalette || 'Any suitable colors'}

    The description should be a single, well-written paragraph, perfect for feeding into an image generation model.
  `;

  const textResponse = await ai.models.generateContent({
      model: textModel,
      contents: descriptionPrompt,
  });
  let description = textResponse.text.trim();

  // Step 2: Generate an image based on the English description.
  const imagePrompt = `
    Create a high-quality, photorealistic fashion photograph of a full outfit on a model, displayed from head to toe.
    The background should be a neutral, minimalist studio setting (e.g., light gray, off-white).
    The lighting should be soft and professional.
    The model's face should be neutral or not prominently featured to focus on the clothes.

    Outfit description:
    ${description}

    Style the image like a modern fashion editorial. Do not add any text or logos to the image.
  `;
  
  const imageResponse = await ai.models.generateImages({
    model: imageModel,
    prompt: imagePrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '3:4',
    },
  });

  if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
    throw new Error("Image generation failed to produce an image.");
  }

  // Step 3: Translate the description if the locale is not English.
  if (locale !== 'en') {
      description = await translateText(description, locale);
  }

  const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
  const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

  return {
    description,
    imageUrl,
  };
};
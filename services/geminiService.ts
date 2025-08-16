
import { GoogleGenAI } from "@google/genai";
import type { OutfitGenerationParams, OutfitResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateOutfit = async (params: OutfitGenerationParams): Promise<OutfitResult> => {
  // Step 1: Generate a detailed text description of the outfit.
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

  const textModel = 'gemini-2.5-flash';
  const textResponse = await ai.models.generateContent({
      model: textModel,
      contents: descriptionPrompt,
  });
  const description = textResponse.text.trim();

  // Step 2: Generate an image based on the created description.
  const imagePrompt = `
    Create a high-quality, photorealistic fashion photograph of a full outfit on a model, displayed from head to toe.
    The background should be a neutral, minimalist studio setting (e.g., light gray, off-white).
    The lighting should be soft and professional.
    The model's face should be neutral or not prominently featured to focus on the clothes.

    Outfit description:
    ${description}

    Style the image like a modern fashion editorial. Do not add any text or logos to the image.
  `;
  
  const imageModel = 'imagen-3.0-generate-002';
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

  const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
  const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

  return {
    description,
    imageUrl,
  };
};

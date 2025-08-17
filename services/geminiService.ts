
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

const getModelEthnicity = (locale: string): string => {
    const ethnicityMap: { [key: string]: string } = {
      zh: 'a Chinese model',
      ja: 'a Japanese model',
      ko: 'a Korean model',
      ru: 'an Eastern European model',
      de: 'a Central European model',
      fr: 'a Western European model',
      en: 'a model of diverse ethnicity',
    };
    return ethnicityMap[locale] || 'a model';
};


export const generateOutfit = async (params: OutfitGenerationParams, locale: string): Promise<OutfitResult> => {
  // Step 1: Generate a detailed text description of the outfit in English.
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

  // Step 2: Generate two images based on the English description.
  const modelEthnicity = getModelEthnicity(locale);

  const modelImagePrompt = `
    Create a high-quality, photorealistic fashion photograph of a full outfit on ${modelEthnicity}, displayed from head to toe.
    The background should be a neutral, minimalist studio setting (e.g., light gray, off-white).
    The lighting should be soft and professional.
    The model's face should be neutral or not prominently featured to focus on the clothes.

    Outfit description:
    ${description}

    Style the image like a modern fashion editorial. Do not add any text or logos to the image.
  `;

  const itemsImagePrompt = `
    Create a high-quality, photorealistic image of a 'flat lay' of clothing items on a clean, neutral background (e.g., off-white, light gray, or subtle marble).
    The image should only contain the clothing and accessories from the description below, neatly arranged as if preparing an outfit.
    Do not include any people, models, or body parts.

    Outfit items description:
    ${description}
  `;
  
  const [modelImageResponse, itemsImageResponse] = await Promise.all([
    ai.models.generateImages({
      model: imageModel,
      prompt: modelImagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4',
      },
    }),
    ai.models.generateImages({
        model: imageModel,
        prompt: itemsImagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      })
  ]);


  if (!modelImageResponse.generatedImages || modelImageResponse.generatedImages.length === 0 || !itemsImageResponse.generatedImages || itemsImageResponse.generatedImages.length === 0) {
    throw new Error("Image generation failed to produce one or more images.");
  }

  // Step 3: Translate the description if the locale is not English.
  if (locale !== 'en') {
      description = await translateText(description, locale);
  }

  const modelImageBase64: string = modelImageResponse.generatedImages[0].image.imageBytes;
  const itemsImageBase64: string = itemsImageResponse.generatedImages[0].image.imageBytes;
  
  const modelImageUrl = `data:image/jpeg;base64,${modelImageBase64}`;
  const itemsImageUrl = `data:image/jpeg;base64,${itemsImageBase64}`;

  return {
    description,
    modelImageUrl,
    itemsImageUrl,
  };
};
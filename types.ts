
export interface OutfitGenerationParams {
  style: string;
  occasion: string;
  gender: string;
  keyGarment: string;
  colorPalette: string;
}

export interface OutfitResult {
  description: string;
  imageUrl: string;
}

export interface SelectorOption {
  label: string;
  value: string;
}

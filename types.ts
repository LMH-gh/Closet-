
export interface OutfitGenerationParams {
  style: string;
  occasion: string;
  gender: string;
  keyGarment: string;
  keyAccessory: string;
  colorPalette: string;
}

export interface OutfitResult {
  description: string;
  modelImageUrl: string;
  itemsImageUrl: string;
}

export interface SelectorOption {
  label: string;
  value: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  isUserIngredient?: boolean;
  isOptional?: boolean;
  baseQuantity?: number;
  unit?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
  completed?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  totalTimeMinutes: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  difficulty: 'Muy fácil' | 'Fácil' | 'Media';
  servings: number;
  tags: string[];
  category: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  chefTips?: string[];
  matchPercentage?: number;
  matchedIngredientsCount?: number;
  totalKeyIngredientsCount?: number;
  isCustomAi?: boolean;
  isFavorite?: boolean;
}

export interface IngredientCategory {
  name: string;
  icon: string;
  items: string[];
}

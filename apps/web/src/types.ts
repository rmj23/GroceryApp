export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
}

export interface RecipeFormData {
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface ScheduledMeal {
  id: number;
  recipeId: number;
  date: Date;
  mealType: MealType;
} 
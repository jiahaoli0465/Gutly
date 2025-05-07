export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  type: string;
  time: string;
  items: FoodItem[];
  totalCalories: number;
  gutHealthScore: number;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealTagProps {
  type: string;
}

export interface NutrientBarProps {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealCardProps {
  meal: Meal;
}

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

export interface EmptyStateProps {
  icon: string;
  message: string;
  action?: EmptyStateAction;
}

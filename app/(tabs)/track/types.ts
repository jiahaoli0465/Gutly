export type MealItem = {
  id: string;
  type: 'meal';
  timestamp: Date;
  photo: string;
  foodLabels: string[];
  calories: number;
};

export type SymptomItem = {
  id: string;
  type: 'symptom';
  timestamp: Date;
  symptom: string;
  severity: number;
  bristolScore?: number;
};

export type TimelineItem = MealItem | SymptomItem;

import { BristolDescription, SymptomType } from './types';

export const SYMPTOMS: SymptomType[] = [
  {
    id: 'bloating',
    name: 'Bloating',
    icon: 'stomach',
    requiresBristol: false,
    category: 'digestive',
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: 'air-filter',
    requiresBristol: false,
    category: 'digestive',
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    icon: 'water-alert',
    requiresBristol: true,
    category: 'digestive',
  },
  {
    id: 'constipation',
    name: 'Constipation',
    icon: 'transit-connection-variant',
    requiresBristol: true,
    category: 'digestive',
  },
  {
    id: 'pain',
    name: 'Abdominal Pain',
    icon: 'alert-circle',
    requiresBristol: false,
    category: 'discomfort',
  },
  {
    id: 'heartburn',
    name: 'Heartburn',
    icon: 'fire',
    requiresBristol: false,
    category: 'discomfort',
  },
  {
    id: 'nausea',
    name: 'Nausea',
    icon: 'emoticon-sick-outline',
    requiresBristol: false,
    category: 'discomfort',
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    icon: 'sleep',
    requiresBristol: false,
    category: 'other',
  },
  {
    id: 'headache',
    name: 'Headache',
    icon: 'head-flash',
    requiresBristol: false,
    category: 'other',
  },
  {
    id: 'cramping',
    name: 'Cramping',
    icon: 'stomach',
    requiresBristol: false,
    category: 'discomfort',
  },
];

export const BRISTOL_DESCRIPTIONS: BristolDescription[] = [
  { score: 1, description: 'Hard lumps', color: '#8B4513' }, // Brown
  { score: 2, description: 'Lumpy sausage', color: '#A0522D' }, // Sienna
  { score: 3, description: 'Cracked sausage', color: '#CD853F' }, // Peru
  { score: 4, description: 'Smooth, soft sausage', color: '#D2B48C' }, // Tan
  { score: 5, description: 'Soft blobs', color: '#DEB887' }, // Burlywood
  { score: 6, description: 'Fluffy pieces', color: '#F5DEB3' }, // Wheat
  { score: 7, description: 'Watery', color: '#F5F5DC' }, // Beige
];

// Input accessory ID for iOS keyboard
export const INPUT_ACCESSORY_ID = 'symptomInputAccessory';

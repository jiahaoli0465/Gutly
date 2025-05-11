import { MaterialCommunityIcons } from '@expo/vector-icons';

export type SymptomType = {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  requiresBristol: boolean;
  category: 'digestive' | 'discomfort' | 'other';
};

export type LogSymptomModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (symptom: Omit<SymptomItem, 'id'>) => void;
};

export type SymptomItem = {
  id: string;
  type: 'symptom';
  timestamp: Date;
  symptom: string;
  severity: number;
  bristolScore?: number;
  notes?: string;
};

export type BristolDescription = {
  score: number;
  description: string;
  color: string;
};

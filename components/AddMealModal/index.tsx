import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

// Component for the step indicator at the top of modal
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.stepIndicator,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            { backgroundColor: theme.colors.background.default },
            currentStep === index && [
              styles.stepDotActive,
              { backgroundColor: theme.colors.primary.main },
            ],
          ]}
        />
      ))}
    </View>
  );
};

// Modal header with title and close/back buttons
interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  onBack,
  showBack,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.modalHeader,
        {
          paddingTop: insets.top + 16,
          backgroundColor: theme.colors.background.paper,
          borderBottomColor: theme.colors.divider,
        },
      ]}
    >
      <View style={styles.headerLeft}>
        {showBack && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <TouchableOpacity onPress={onClose} style={styles.headerButton}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color={theme.colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

// Camera Option component for method selection screen
interface MethodOptionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

const MethodOption: React.FC<MethodOptionProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.methodOption,
        { backgroundColor: theme.colors.background.paper },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={[
          styles.methodIconContainer,
          { backgroundColor: `${theme.colors.primary.main}15` }, // 15 is hex for 10% opacity
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={theme.colors.primary.main}
        />
      </View>
      <View style={styles.methodTextContainer}>
        <Text
          style={[styles.methodTitle, { color: theme.colors.text.primary }]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.methodDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {description}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.text.disabled}
      />
    </TouchableOpacity>
  );
};

// First step - Choose method
interface RecentMeal {
  id: string;
  name: string;
  time: string;
  image: string | null;
}

interface ChooseMethodStepProps {
  onSelectMethod: (method: 'camera' | 'gallery' | 'manual') => void;
}

const ChooseMethodStep: React.FC<ChooseMethodStepProps> = ({
  onSelectMethod,
}) => {
  const { theme } = useTheme();
  const recentMeals: RecentMeal[] = [
    { id: '1', name: 'Greek Yogurt Bowl', time: 'Breakfast', image: null },
    { id: '2', name: 'Quinoa Salad', time: 'Lunch', image: null },
    { id: '3', name: 'Salmon & Rice', time: 'Dinner', image: null },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text
        style={[styles.stepDescription, { color: theme.colors.text.secondary }]}
      >
        Choose how you'd like to add your meal
      </Text>

      <View style={styles.methodOptionsContainer}>
        <MethodOption
          icon="camera"
          title="Take a Photo"
          description="Snap a picture of your meal"
          onPress={() => onSelectMethod('camera')}
        />
        <MethodOption
          icon="image-multiple"
          title="Choose from Gallery"
          description="Select an existing photo"
          onPress={() => onSelectMethod('gallery')}
        />
        <MethodOption
          icon="pencil"
          title="Manual Entry"
          description="Enter meal details manually"
          onPress={() => onSelectMethod('manual')}
        />
      </View>

      <View style={styles.recentMealsContainer}>
        <Text
          style={[
            styles.recentMealsTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Recent Meals
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recentMeals}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.recentMealCard,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <View
                style={[
                  styles.recentMealImagePlaceholder,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              >
                <MaterialCommunityIcons
                  name="food"
                  size={24}
                  color={theme.colors.primary.contrast}
                />
              </View>
              <Text
                style={[
                  styles.recentMealName,
                  { color: theme.colors.text.primary },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.recentMealTime,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.recentMealsList}
        />
      </View>
    </View>
  );
};

// Ingredient Item component for the ingredient list
interface IngredientItemType {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IngredientItemProps {
  item: IngredientItemType;
  onEdit: () => void;
  onRemove: () => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  item,
  onEdit,
  onRemove,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.ingredientItem,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <View
        style={[
          styles.ingredientIconContainer,
          { backgroundColor: `${theme.colors.primary.main}15` },
        ]}
      >
        <MaterialCommunityIcons
          name="food-apple"
          size={20}
          color={theme.colors.primary.main}
        />
      </View>
      <View style={styles.ingredientContent}>
        <Text
          style={[styles.ingredientName, { color: theme.colors.text.primary }]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.ingredientDetail,
            { color: theme.colors.text.secondary },
          ]}
        >
          {item.calories} cal · {item.protein}g P · {item.carbs}g C · {item.fat}
          g F
        </Text>
      </View>
      <View style={styles.ingredientActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemove} style={styles.actionButton}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// AI Analysis loading state with animation (simplified)
const AIAnalysisLoading: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.aiLoadingContainer}>
      <View style={styles.aiLoadingContent}>
        <View
          style={[
            styles.aiIconContainer,
            { backgroundColor: `${theme.colors.primary.main}15` },
          ]}
        >
          <MaterialCommunityIcons
            name="robot"
            size={42}
            color={theme.colors.primary.main}
          />
        </View>
        <Text
          style={[styles.aiLoadingTitle, { color: theme.colors.text.primary }]}
        >
          Analyzing your meal
        </Text>
        <Text
          style={[
            styles.aiLoadingSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Identifying ingredients and nutrition info...
        </Text>

        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: theme.colors.primary.main,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

// Second step - Ingredients list after AI analysis or for manual entry
interface IngredientsStepProps {
  ingredients: IngredientItemType[];
  onAddIngredient: () => void;
  onEditIngredient: (index: number) => void;
  onRemoveIngredient: (index: number) => void;
  onNext: () => void;
  isLoading: boolean;
}

const IngredientsStep: React.FC<IngredientsStepProps> = ({
  ingredients,
  onAddIngredient,
  onEditIngredient,
  onRemoveIngredient,
  onNext,
  isLoading,
}) => {
  const { theme } = useTheme();

  if (isLoading) {
    return <AIAnalysisLoading />;
  }

  return (
    <View style={styles.stepContainer}>
      <Text
        style={[styles.stepDescription, { color: theme.colors.text.secondary }]}
      >
        Review and edit ingredients in your meal
      </Text>

      <ScrollView style={styles.ingredientList}>
        {ingredients.map((item, index) => (
          <IngredientItem
            key={index}
            item={item}
            onEdit={() => onEditIngredient(index)}
            onRemove={() => onRemoveIngredient(index)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.addIngredientButton,
          {
            borderColor: theme.colors.primary.main,
            backgroundColor: `${theme.colors.primary.main}08`, // 08 is hex for 3% opacity
          },
        ]}
        onPress={onAddIngredient}
      >
        <MaterialCommunityIcons
          name="plus"
          size={20}
          color={theme.colors.primary.main}
        />
        <Text
          style={[
            styles.addIngredientText,
            { color: theme.colors.primary.main },
          ]}
        >
          Add Ingredient
        </Text>
      </TouchableOpacity>

      {ingredients.length > 0 && (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
          onPress={onNext}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.primary.contrast },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Input field with label
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'number-pad';
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  placeholder,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.formGroup}>
      <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: theme.colors.background.default,
            color: theme.colors.text.primary,
            borderColor: theme.colors.divider,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.disabled}
      />
    </View>
  );
};

// Ingredient editor modal
interface IngredientEditorModalProps {
  visible: boolean;
  ingredient: (IngredientItemType & { index?: number }) | null;
  onSave: (ingredient: IngredientItemType) => void;
  onCancel: () => void;
}

const IngredientEditorModal: React.FC<IngredientEditorModalProps> = ({
  visible,
  ingredient,
  onSave,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Initialize form with ingredient data when modal opens
  useEffect(() => {
    if (visible && ingredient) {
      setName(ingredient.name || '');
      setCalories(ingredient.calories ? String(ingredient.calories) : '');
      setProtein(ingredient.protein ? String(ingredient.protein) : '');
      setCarbs(ingredient.carbs ? String(ingredient.carbs) : '');
      setFat(ingredient.fat ? String(ingredient.fat) : '');
    } else if (visible) {
      // Reset form when opening for a new ingredient
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    }
  }, [visible, ingredient]);

  const handleSave = () => {
    onSave({
      name,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
    });
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.editorModalContainer,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <View
            style={[
              styles.editorModalHeader,
              { borderBottomColor: theme.colors.divider },
            ]}
          >
            <Text
              style={[
                styles.editorModalTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editorModalContent}>
            <FormInput
              label="Ingredient Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Greek Yogurt"
            />

            <FormInput
              label="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholder="e.g. 150"
            />

            <View style={styles.macroInputsRow}>
              <View style={styles.macroInput}>
                <FormInput
                  label="Protein (g)"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.macroInput}>
                <FormInput
                  label="Carbs (g)"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.macroInput}>
                <FormInput
                  label="Fat (g)"
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.editorModalFooter}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: theme.colors.background.default },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={handleSave}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: theme.colors.primary.contrast },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Meal type selector (Breakfast, Lunch, Dinner, Snack)
interface MealTypeSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
}

const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { theme } = useTheme();

  const mealTypes: {
    id: string;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: 'coffee' },
    { id: 'lunch', label: 'Lunch', icon: 'food' },
    { id: 'dinner', label: 'Dinner', icon: 'food-turkey' },
    { id: 'snack', label: 'Snack', icon: 'fruit-cherries' },
  ];

  return (
    <View style={styles.mealTypeContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Meal Type
      </Text>
      <View style={styles.mealTypeOptions}>
        {mealTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.mealTypeOption,
              { backgroundColor: theme.colors.background.paper },
              selected === type.id && [
                styles.mealTypeOptionSelected,
                { backgroundColor: theme.colors.primary.main },
              ],
            ]}
            onPress={() => onSelect(type.id)}
          >
            <MaterialCommunityIcons
              name={type.icon}
              size={24}
              color={
                selected === type.id
                  ? theme.colors.primary.contrast
                  : theme.colors.primary.main
              }
            />
            <Text
              style={[
                styles.mealTypeLabel,
                { color: theme.colors.text.primary },
                selected === type.id && [
                  styles.mealTypeLabelSelected,
                  { color: theme.colors.primary.contrast },
                ],
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Time picker component (simplified - would use a real time picker in production)
interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ time, onTimeChange }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.timePickerContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Time
      </Text>
      <TouchableOpacity
        style={[
          styles.timePickerButton,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <MaterialCommunityIcons
          name="clock-outline"
          size={20}
          color={theme.colors.primary.main}
        />
        <Text
          style={[styles.timePickerText, { color: theme.colors.text.primary }]}
        >
          {time || 'Select time'}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};

// Nutrition summary component
interface NutritionSummaryProps {
  ingredients: IngredientItemType[];
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ ingredients }) => {
  const { theme } = useTheme();

  // Calculate totals
  const totals = ingredients.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fat += item.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <View
      style={[
        styles.nutritionSummary,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Nutrition Summary
      </Text>
      <View style={styles.nutritionTotals}>
        <View style={styles.nutritionItem}>
          <Text
            style={[
              styles.nutritionValue,
              { color: theme.colors.text.primary },
            ]}
          >
            {totals.calories}
          </Text>
          <Text
            style={[
              styles.nutritionLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Calories
          </Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text
            style={[
              styles.nutritionValue,
              { color: theme.colors.text.primary },
            ]}
          >
            {totals.protein}g
          </Text>
          <Text
            style={[
              styles.nutritionLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Protein
          </Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text
            style={[
              styles.nutritionValue,
              { color: theme.colors.text.primary },
            ]}
          >
            {totals.carbs}g
          </Text>
          <Text
            style={[
              styles.nutritionLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Carbs
          </Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text
            style={[
              styles.nutritionValue,
              { color: theme.colors.text.primary },
            ]}
          >
            {totals.fat}g
          </Text>
          <Text
            style={[
              styles.nutritionLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Fat
          </Text>
        </View>
      </View>
    </View>
  );
};

// Third step - Meal details (type, time)
interface MealDetailsStepProps {
  ingredients: IngredientItemType[];
  mealType: string;
  setMealType: (type: string) => void;
  mealTime: string;
  setMealTime: (time: string) => void;
  onNext: () => void;
}

const MealDetailsStep: React.FC<MealDetailsStepProps> = ({
  ingredients,
  mealType,
  setMealType,
  mealTime,
  setMealTime,
  onNext,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.stepContainer}>
      <Text
        style={[styles.stepDescription, { color: theme.colors.text.secondary }]}
      >
        Add details about your meal
      </Text>

      <ScrollView>
        <MealTypeSelector selected={mealType} onSelect={setMealType} />
        <TimePicker time={mealTime} onTimeChange={setMealTime} />

        {ingredients.length > 0 && (
          <NutritionSummary ingredients={ingredients} />
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary.main },
        ]}
        onPress={onNext}
      >
        <Text
          style={[
            styles.primaryButtonText,
            { color: theme.colors.primary.contrast },
          ]}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Gut health score component with emoji visual
interface GutHealthScoreProps {
  score: number;
}

const GutHealthScore: React.FC<GutHealthScoreProps> = ({ score }) => {
  const { theme } = useTheme();

  // Determine emoji and color based on score
  const getScoreInfo = (score: number) => {
    if (score >= 90)
      return {
        emoji: '😊',
        color: theme.colors.success.main,
        label: 'Excellent',
      };
    if (score >= 75)
      return { emoji: '🙂', color: theme.colors.primary.main, label: 'Good' };
    if (score >= 60)
      return { emoji: '😐', color: theme.colors.warning.main, label: 'Fair' };
    return { emoji: '🙁', color: theme.colors.error.main, label: 'Poor' };
  };

  const { emoji, color, label } = getScoreInfo(score);

  return (
    <View
      style={[
        styles.gutHealthContainer,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Gut Health Impact
      </Text>
      <View style={styles.gutHealthScoreContainer}>
        <Text style={styles.gutHealthEmoji}>{emoji}</Text>
        <View style={styles.gutHealthScoreDetails}>
          <View style={styles.gutHealthScoreRow}>
            <Text
              style={[
                styles.gutHealthScoreValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {score}
            </Text>
            <Text
              style={[
                styles.gutHealthScoreMax,
                { color: theme.colors.text.secondary },
              ]}
            >
              /100
            </Text>
          </View>
          <Text style={[styles.gutHealthScoreLabel, { color }]}>{label}</Text>
        </View>
      </View>

      <View
        style={[
          styles.gutHealthBar,
          { backgroundColor: theme.colors.background.default },
        ]}
      >
        <View
          style={[
            styles.gutHealthProgress,
            { width: `${score}%`, backgroundColor: color },
          ]}
        />
      </View>

      <View
        style={[
          styles.gutHealthTips,
          { backgroundColor: `${theme.colors.primary.main}15` },
        ]}
      >
        <MaterialCommunityIcons
          name="lightbulb-outline"
          size={20}
          color={theme.colors.primary.main}
        />
        <Text
          style={[
            styles.gutHealthTipText,
            { color: theme.colors.text.primary },
          ]}
        >
          This meal is rich in fiber and contains probiotic foods, which support
          gut health.
        </Text>
      </View>
    </View>
  );
};

// Fourth step - Review meal
interface ReviewStepProps {
  ingredients: IngredientItemType[];
  mealType: string;
  mealTime: string;
  onSave: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  ingredients,
  mealType,
  mealTime,
  onSave,
}) => {
  const { theme } = useTheme();

  // Calculate mock gut health score
  const gutHealthScore = 87;

  // Capitalize meal type
  const formattedMealType =
    mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <View style={styles.stepContainer}>
      <Text
        style={[styles.stepDescription, { color: theme.colors.text.secondary }]}
      >
        Review your meal before saving
      </Text>

      <ScrollView style={styles.reviewContainer}>
        <View
          style={[
            styles.mealSummaryCard,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <Text
            style={[
              styles.mealSummaryTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {formattedMealType}
          </Text>
          <Text
            style={[
              styles.mealSummaryTime,
              { color: theme.colors.text.secondary },
            ]}
          >
            {mealTime}
          </Text>

          <View
            style={[
              styles.mealSummaryDivider,
              { backgroundColor: theme.colors.divider },
            ]}
          />

          <View style={styles.ingredientsList}>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.reviewIngredientItem}>
                <Text
                  style={[
                    styles.reviewIngredientName,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.reviewIngredientMacros,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {item.calories} cal · {item.protein}g P · {item.carbs}g C ·{' '}
                  {item.fat}g F
                </Text>
              </View>
            ))}
          </View>
        </View>

        <GutHealthScore score={gutHealthScore} />
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: theme.colors.success.main },
        ]}
        onPress={onSave}
      >
        <Text
          style={[
            styles.saveButtonText,
            { color: theme.colors.success.contrast },
          ]}
        >
          Save Meal
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Success step with animation
interface SuccessStepProps {
  onFinish: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onFinish }) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.successContainer}>
      <Animated.View
        style={[
          styles.successIconContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="check-circle"
          size={80}
          color={theme.colors.success.main}
        />
      </Animated.View>
      <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
        Meal Added!
      </Text>
      <Text
        style={[styles.successMessage, { color: theme.colors.text.secondary }]}
      >
        Your meal has been successfully saved to your journal.
      </Text>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary.main },
        ]}
        onPress={onFinish}
      >
        <Text
          style={[
            styles.primaryButtonText,
            { color: theme.colors.primary.contrast },
          ]}
        >
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Main modal component
interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
  initialMode?: 'camera' | 'gallery' | 'manual' | null;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  visible,
  onClose,
  initialMode = null,
}) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(initialMode ? 1 : 0);
  const [method, setMethod] = useState<'camera' | 'gallery' | 'manual' | null>(
    initialMode || null
  );
  const [ingredients, setIngredients] = useState<IngredientItemType[]>([]);
  const [mealType, setMealType] = useState('breakfast');
  const [mealTime, setMealTime] = useState('8:30 AM');
  const [isLoading, setIsLoading] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<
    (IngredientItemType & { index?: number }) | null
  >(null);
  const [showIngredientEditor, setShowIngredientEditor] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setStep(initialMode ? 1 : 0);
      setMethod(initialMode || null);
    } else {
      // Reset state when modal closes
      setStep(0);
      setMethod(null);
      setIngredients([]);
      setMealType('breakfast');
      setMealTime('8:30 AM');
    }
  }, [visible, initialMode]);

  // Simulate AI analysis loading
  useEffect(() => {
    if (step === 1 && (method === 'camera' || method === 'gallery')) {
      setIsLoading(true);
      // Mock AI analysis delay
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Mock AI detection result
        setIngredients([
          {
            name: 'Greek Yogurt',
            calories: 150,
            protein: 15,
            carbs: 10,
            fat: 5,
          },
          { name: 'Granola', calories: 120, protein: 3, carbs: 20, fat: 4 },
          { name: 'Blueberries', calories: 40, protein: 0, carbs: 10, fat: 0 },
        ]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step, method]);

  // Handle method selection
  const handleSelectMethod = (
    selectedMethod: 'camera' | 'gallery' | 'manual'
  ) => {
    setMethod(selectedMethod);
    setStep(1);
  };

  // Handle back button
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Add ingredient handler
  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setShowIngredientEditor(true);
  };

  // Edit ingredient handler
  const handleEditIngredient = (index: number) => {
    setEditingIngredient({ index, ...ingredients[index] });
    setShowIngredientEditor(true);
  };

  // Remove ingredient handler
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Save ingredient handler
  const handleSaveIngredient = (ingredient: IngredientItemType) => {
    if (editingIngredient !== null && editingIngredient.index !== undefined) {
      // Update existing ingredient
      const updatedIngredients = [...ingredients];
      updatedIngredients[editingIngredient.index] = ingredient;
      setIngredients(updatedIngredients);
    } else {
      // Add new ingredient
      setIngredients([...ingredients, ingredient]);
    }
    setShowIngredientEditor(false);
  };

  // Save meal handler
  const handleSaveMeal = () => {
    // Here you would save the meal data to your database
    console.log('Saving meal:', {
      type: mealType,
      time: mealTime,
      ingredients,
    });
    setStep(4); // Go to success step
  };

  // Get step title based on current step
  const getStepTitle = (): string => {
    switch (step) {
      case 0:
        return 'Add Meal';
      case 1:
        return 'Ingredients';
      case 2:
        return 'Meal Details';
      case 3:
        return 'Review Meal';
      case 4:
        return 'Success';
      default:
        return 'Add Meal';
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <ChooseMethodStep onSelectMethod={handleSelectMethod} />;
      case 1:
        return (
          <IngredientsStep
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onEditIngredient={handleEditIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onNext={() => setStep(2)}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <MealDetailsStep
            ingredients={ingredients}
            mealType={mealType}
            setMealType={setMealType}
            mealTime={mealTime}
            setMealTime={setMealTime}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <ReviewStep
            ingredients={ingredients}
            mealType={mealType}
            mealTime={mealTime}
            onSave={handleSaveMeal}
          />
        );
      case 4:
        return <SuccessStep onFinish={onClose} />;
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background.default },
        ]}
      >
        <ModalHeader
          title={getStepTitle()}
          onClose={onClose}
          onBack={handleBack}
          showBack={step > 0 && step < 4}
        />

        {step < 4 && <StepIndicator currentStep={step} totalSteps={4} />}

        {renderStepContent()}

        <IngredientEditorModal
          visible={showIngredientEditor}
          ingredient={editingIngredient}
          onSave={handleSaveIngredient}
          onCancel={() => setShowIngredientEditor(false)}
        />
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  stepDotActive: {
    width: 24,
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  stepDescription: {
    fontSize: 16,
    marginBottom: 24,
  },

  // Method selection screen styles
  methodOptionsContainer: {
    marginBottom: 32,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
  },
  recentMealsContainer: {
    marginTop: 16,
  },
  recentMealsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentMealsList: {
    paddingBottom: 16,
  },
  recentMealCard: {
    width: 120,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  recentMealImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentMealName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  recentMealTime: {
    fontSize: 12,
    textAlign: 'center',
  },

  // AI Analysis loading styles
  aiLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  aiLoadingContent: {
    alignItems: 'center',
    width: '100%',
  },
  aiIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  aiLoadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  aiLoadingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },

  // Ingredients list styles
  ingredientList: {
    flex: 1,
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  ingredientIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  ingredientDetail: {
    fontSize: 13,
  },
  ingredientActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  addIngredientText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Ingredient editor modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(33, 33, 33, 0.7)',
    justifyContent: 'flex-end',
  },
  editorModalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: height * 0.9,
  },
  editorModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  editorModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editorModalContent: {
    padding: 16,
    maxHeight: height * 0.6,
  },
  editorModalFooter: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  macroInputsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  macroInput: {
    flex: 1,
    paddingHorizontal: 4,
  },

  // Meal details step styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  mealTypeContainer: {
    marginBottom: 24,
  },
  mealTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTypeOption: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  mealTypeOptionSelected: {},
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  mealTypeLabelSelected: {},
  timePickerContainer: {
    marginBottom: 24,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  timePickerText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  nutritionSummary: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  nutritionTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  nutritionLabel: {
    fontSize: 12,
    marginTop: 4,
  },

  // Review step styles
  reviewContainer: {
    flex: 1,
    marginBottom: 16,
  },
  mealSummaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  mealSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  mealSummaryTime: {
    fontSize: 14,
    marginTop: 4,
  },
  mealSummaryDivider: {
    height: 1,
    marginVertical: 16,
  },
  ingredientsList: {
    marginBottom: 8,
  },
  reviewIngredientItem: {
    marginBottom: 12,
  },
  reviewIngredientName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  reviewIngredientMacros: {
    fontSize: 14,
  },
  gutHealthContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  gutHealthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gutHealthEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  gutHealthScoreDetails: {
    flex: 1,
  },
  gutHealthScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gutHealthScoreValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  gutHealthScoreMax: {
    fontSize: 16,
    marginLeft: 2,
  },
  gutHealthScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  gutHealthBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gutHealthProgress: {
    height: '100%',
    borderRadius: 4,
  },
  gutHealthTips: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
  },
  gutHealthTipText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },

  // Success step styles
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default AddMealModal;

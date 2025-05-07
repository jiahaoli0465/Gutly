import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddMealModal from '../../../components/AddMealModal';
import { EmptyState } from '../../../components/meals/EmptyState';
import { MealCard } from '../../../components/meals/MealCard';
import { NutritionSummary } from '../../../components/meals/NutritionSummary';
import { Meal } from '../../../components/meals/types';
import QuickActionFAB, {
  QuickAction,
} from '../../../components/QuickActionFAB';
import { useTheme } from '../../../context/ThemeContext';

const TABS = ['Day', 'Week', 'Month'];

// Mock data for meals
const MEALS_DATA: Record<string, Meal[]> = {
  Day: [
    {
      id: '1',
      type: 'Breakfast',
      time: '8:30 AM',
      items: [
        { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 10, fat: 5 },
        { name: 'Granola', calories: 120, protein: 3, carbs: 20, fat: 4 },
        { name: 'Blueberries', calories: 40, protein: 0, carbs: 10, fat: 0 },
      ],
      totalCalories: 310,
      gutHealthScore: 85,
    },
    {
      id: '2',
      type: 'Lunch',
      time: '12:45 PM',
      items: [
        { name: 'Quinoa Salad', calories: 220, protein: 8, carbs: 35, fat: 6 },
        {
          name: 'Grilled Chicken',
          calories: 180,
          protein: 30,
          carbs: 0,
          fat: 6,
        },
        { name: 'Avocado', calories: 160, protein: 2, carbs: 8, fat: 15 },
      ],
      totalCalories: 560,
      gutHealthScore: 92,
    },
    {
      id: '3',
      type: 'Dinner',
      time: '7:15 PM',
      items: [
        { name: 'Salmon', calories: 250, protein: 25, carbs: 0, fat: 15 },
        { name: 'Brown Rice', calories: 180, protein: 4, carbs: 37, fat: 1 },
        {
          name: 'Steamed Broccoli',
          calories: 55,
          protein: 4,
          carbs: 11,
          fat: 0,
        },
      ],
      totalCalories: 485,
      gutHealthScore: 88,
    },
  ],
  Week: [],
  Month: [],
};

// Calculate nutrition totals from meals data
const calculateDailyTotals = () => {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  MEALS_DATA.Day.forEach((meal) => {
    meal.items.forEach((item) => {
      calories += item.calories;
      protein += item.protein;
      carbs += item.carbs;
      fat += item.fat;
    });
  });

  return { calories, protein, carbs, fat };
};

export default function MealsScreen() {
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams<{ add?: string }>();
  const router = useRouter();
  const [tab, setTab] = useState('Day');
  const [showAddMealSheet, setShowAddMealSheet] = useState(false);
  const [addMealMode, setAddMealMode] = useState<
    'camera' | 'gallery' | 'manual' | null
  >(null);

  // Calculate the nutrition data
  const nutritionData = calculateDailyTotals();

  // Actions for the FAB
  const fabActions: QuickAction[] = [
    {
      icon: 'camera',
      label: 'Take Photo',
      onPress: () => handleAddMeal('camera'),
    },
    {
      icon: 'images',
      label: 'Gallery',
      onPress: () => handleAddMeal('gallery'),
    },
    {
      icon: 'create',
      label: 'Manual Entry',
      onPress: () => handleAddMeal('manual'),
    },
  ];

  useEffect(() => {
    if (params.add) {
      router.setParams({ add: undefined });
    }
  }, [params.add]);

  const handleAddMeal = (mode: 'camera' | 'gallery' | 'manual') => {
    setAddMealMode(mode);
    setShowAddMealSheet(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* App Bar */}
      <View style={styles.header}>
        <Text
          style={[styles.screenTitle, { color: theme.colors.text.primary }]}
        >
          Meals
        </Text>
        <TouchableOpacity
          style={[
            styles.headerButton,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View
        style={[
          styles.tabContainer,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            activeOpacity={0.7}
            style={[
              styles.tab,
              tab === t && [
                styles.activeTab,
                { backgroundColor: theme.colors.background.default },
              ],
            ]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.colors.text.secondary },
                tab === t && { color: theme.colors.primary.main },
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'Day' && (
          <>
            {/* Pass the calculated nutrition data to the component */}
            <NutritionSummary nutritionData={nutritionData} />

            {MEALS_DATA.Day.length > 0 ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Today's Meals
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={[
                        styles.sectionAction,
                        { color: theme.colors.primary.main },
                      ]}
                    >
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>

                {MEALS_DATA.Day.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </>
            ) : (
              <EmptyState
                icon="food-fork-drink"
                message="No meals logged today"
                action={{
                  label: 'Add Your First Meal',
                  onPress: () => handleAddMeal('manual'),
                }}
              />
            )}
          </>
        )}

        {tab === 'Week' && (
          <EmptyState
            icon="calendar-week"
            message="Weekly summary will appear here"
          />
        )}

        {tab === 'Month' && (
          <EmptyState
            icon="calendar-month"
            message="Monthly trends will appear here"
          />
        )}
      </ScrollView>

      {/* FAB for adding meals */}
      <QuickActionFAB actions={fabActions} />

      {/* Add Meal Modal */}
      <AddMealModal
        visible={showAddMealSheet}
        onClose={() => {
          setShowAddMealSheet(false);
          setAddMealMode(null);
        }}
        initialMode={addMealMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra padding for FAB
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '500',
  },
});

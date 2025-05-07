import { useTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DonutChart } from './DonutChart';
import { NutritionTotals } from './types';

interface NutritionSummaryProps {
  nutritionData?: NutritionTotals;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  nutritionData,
}) => {
  const { theme } = useTheme();

  // Calculate daily totals from meals or use provided data
  const calculateDailyTotals = (): NutritionTotals => {
    if (nutritionData) return nutritionData;

    // Example implementation using mock data if no data provided
    return { calories: 1355, protein: 88, carbs: 132, fat: 45 };
  };

  const totals = calculateDailyTotals();
  const totalMacroGrams = totals.protein + totals.carbs + totals.fat;

  // Prepare data for the donut chart
  const chartData = [
    {
      name: 'Protein',
      value: totals.protein,
      color: theme.colors.primary.main,
    },
    {
      name: 'Carbs',
      value: totals.carbs,
      color: theme.colors.warning.main,
    },
    {
      name: 'Fat',
      value: totals.fat,
      color: theme.colors.error.main,
    },
  ];

  // Calculate percentages for display
  const proteinPercentage =
    totalMacroGrams > 0
      ? Math.round((totals.protein / totalMacroGrams) * 100)
      : 0;

  const carbsPercentage =
    totalMacroGrams > 0
      ? Math.round((totals.carbs / totalMacroGrams) * 100)
      : 0;

  const fatPercentage =
    totalMacroGrams > 0 ? Math.round((totals.fat / totalMacroGrams) * 100) : 0;

  return (
    <View
      style={[
        styles.nutritionSummaryCard,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <Text
        style={[
          styles.nutritionSummaryTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Daily Nutrition
      </Text>

      <View style={styles.nutritionContent}>
        {/* Left side - Donut chart visualization */}
        <View style={styles.donutChartContainer}>
          <DonutChart
            data={chartData}
            radius={60}
            strokeWidth={20}
            centerText={totals.calories.toString()}
            centerSubText="calories"
            textColor={theme.colors.text.primary}
            subTextColor={theme.colors.text.secondary}
          />

          <View style={styles.macroLegend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Protein {proteinPercentage}%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: theme.colors.warning.main },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Carbs {carbsPercentage}%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: theme.colors.error.main },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Fat {fatPercentage}%
              </Text>
            </View>
          </View>
        </View>

        {/* Right side - Numeric values */}
        <View style={styles.macroValues}>
          <View style={styles.macroValueItem}>
            <View
              style={[
                styles.macroIcon,
                { backgroundColor: theme.colors.primary.main },
              ]}
            >
              <MaterialCommunityIcons
                name="arm-flex"
                size={18}
                color={theme.colors.primary.contrast}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.macroValueLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Protein
              </Text>
              <Text
                style={[
                  styles.macroValueNumber,
                  { color: theme.colors.text.primary },
                ]}
              >
                {totals.protein}g
              </Text>
            </View>
          </View>

          <View style={styles.macroValueItem}>
            <View
              style={[
                styles.macroIcon,
                { backgroundColor: theme.colors.warning.main },
              ]}
            >
              <MaterialCommunityIcons
                name="grain"
                size={18}
                color={theme.colors.warning.contrast}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.macroValueLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Carbs
              </Text>
              <Text
                style={[
                  styles.macroValueNumber,
                  { color: theme.colors.text.primary },
                ]}
              >
                {totals.carbs}g
              </Text>
            </View>
          </View>

          <View style={styles.macroValueItem}>
            <View
              style={[
                styles.macroIcon,
                { backgroundColor: theme.colors.error.main },
              ]}
            >
              <MaterialCommunityIcons
                name="oil"
                size={18}
                color={theme.colors.error.contrast}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.macroValueLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Fat
              </Text>
              <Text
                style={[
                  styles.macroValueNumber,
                  { color: theme.colors.text.primary },
                ]}
              >
                {totals.fat}g
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nutritionSummaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  nutritionSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  nutritionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  donutChartContainer: {
    flex: 1,
    alignItems: 'center',
  },
  macroLegend: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  macroValues: {
    flex: 1,
    justifyContent: 'center',
  },
  macroValueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  macroValueLabel: {
    fontSize: 12,
  },
  macroValueNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
});

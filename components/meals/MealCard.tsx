import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { MealTag } from './MealTag';
import { NutrientBar } from './NutrientBar';
import { MealCardProps } from './types';

const getGutHealthColor = (score: number): string => {
  if (score >= 90) return '#48CFAD'; // Excellent - Green
  if (score >= 75) return '#5D9CEC'; // Good - Blue
  if (score >= 60) return '#FFCE54'; // Fair - Yellow
  return '#ED5565'; // Poor - Red
};

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  // Calculate total nutrients
  const totalNutrients = meal.items.reduce(
    (acc, item) => {
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <View
      style={[
        styles.mealCard,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.mealCardHeader,
          { borderBottomColor: theme.colors.divider },
        ]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.mealHeaderLeft}>
          <MealTag type={meal.type} />
          <View>
            <Text
              style={[
                styles.mealTimeText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {meal.time}
            </Text>
          </View>
        </View>

        <View style={styles.mealHeaderRight}>
          <View style={styles.caloriesBadge}>
            <Text
              style={[
                styles.caloriesValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {meal.totalCalories}
            </Text>
            <Text
              style={[
                styles.caloriesUnit,
                { color: theme.colors.text.secondary },
              ]}
            >
              cal
            </Text>
          </View>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={theme.colors.text.secondary}
            style={styles.expandIcon}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.mealPreview}>
        <NutrientBar
          protein={totalNutrients.protein}
          carbs={totalNutrients.carbs}
          fat={totalNutrients.fat}
        />
        <Text
          style={[
            styles.mealPreviewText,
            { color: theme.colors.text.secondary },
          ]}
        >
          {meal.items.map((item) => item.name).join(', ')}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.mealDetailsContainer,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500],
            }),
            opacity: animatedHeight,
          },
        ]}
      >
        <View style={styles.mealDetails}>
          {meal.items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.foodItemRow,
                { borderBottomColor: theme.colors.divider },
              ]}
            >
              <View style={styles.foodItemInfo}>
                <Text
                  style={[
                    styles.foodItemName,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.foodItemCalories,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {item.calories} cal
                </Text>
              </View>
              <View style={styles.macroCircles}>
                <View style={styles.macroCircleContainer}>
                  <View style={[styles.macroCircle, styles.proteinCircle]}>
                    <Text style={styles.macroValue}>{item.protein}</Text>
                  </View>
                  <Text
                    style={[
                      styles.macroLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    P
                  </Text>
                </View>
                <View style={styles.macroCircleContainer}>
                  <View style={[styles.macroCircle, styles.carbsCircle]}>
                    <Text style={styles.macroValue}>{item.carbs}</Text>
                  </View>
                  <Text
                    style={[
                      styles.macroLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    C
                  </Text>
                </View>
                <View style={styles.macroCircleContainer}>
                  <View style={[styles.macroCircle, styles.fatCircle]}>
                    <Text style={styles.macroValue}>{item.fat}</Text>
                  </View>
                  <Text
                    style={[
                      styles.macroLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    F
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.gutHealthContainer}>
            <View style={styles.gutHealthHeader}>
              <Text
                style={[
                  styles.gutHealthLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Gut Health Score
              </Text>
              <Text
                style={[
                  styles.gutHealthValue,
                  { color: getGutHealthColor(meal.gutHealthScore) },
                ]}
              >
                {meal.gutHealthScore}/100
              </Text>
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
                  {
                    width: `${meal.gutHealthScore}%`,
                    backgroundColor: getGutHealthColor(meal.gutHealthScore),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTimeText: {
    fontSize: 14,
  },
  mealHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 8,
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  caloriesUnit: {
    fontSize: 12,
    marginLeft: 2,
  },
  expandIcon: {
    marginLeft: 4,
  },
  mealPreview: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  mealPreviewText: {
    fontSize: 14,
  },
  mealDetailsContainer: {
    overflow: 'hidden',
  },
  mealDetails: {
    padding: 16,
    paddingTop: 0,
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  foodItemInfo: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 15,
    fontWeight: '500',
  },
  foodItemCalories: {
    fontSize: 13,
    marginTop: 2,
  },
  macroCircles: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  macroCircleContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  macroCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proteinCircle: {
    backgroundColor: '#48CFAD',
  },
  carbsCircle: {
    backgroundColor: '#FFCE54',
  },
  fatCircle: {
    backgroundColor: '#ED5565',
  },
  macroValue: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  macroLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  gutHealthContainer: {
    marginTop: 16,
  },
  gutHealthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gutHealthLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  gutHealthValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  gutHealthBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  gutHealthProgress: {
    height: '100%',
    borderRadius: 4,
  },
});

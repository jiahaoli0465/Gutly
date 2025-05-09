import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

type MealItem = {
  id: string;
  type: 'meal';
  timestamp: Date;
  photo: string;
  foodLabels: string[];
  calories: number;
};

export const MealCard = ({ item }: { item: MealItem }) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.mealCardWrapper}>
      {/* Top section with icon, title, and time */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleSection}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${theme.colors.primary.light}12` },
            ]}
          >
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={15}
              color={theme.colors.primary.main}
            />
          </View>

          <View>
            <Text
              style={[styles.cardTitle, { color: theme.colors.text.primary }]}
            >
              Meal
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.calorieIndicator,
            {
              backgroundColor: isDark
                ? `${theme.colors.primary.light}25`
                : `${theme.colors.primary.main}08`,
            },
          ]}
        >
          <Text
            style={[styles.calorieValue, { color: theme.colors.primary.main }]}
          >
            {item.calories}
          </Text>
          <Text
            style={[styles.calorieUnit, { color: theme.colors.primary.main }]}
          >
            calories
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[styles.cardDivider, { backgroundColor: theme.colors.divider }]}
      />

      {/* Food labels section */}
      <View style={styles.foodLabelsSection}>
        {item.foodLabels.map((label, index) =>
          index < 3 ? (
            <View
              key={index}
              style={[
                styles.foodLabelChip,
                {
                  backgroundColor: isDark
                    ? `${theme.colors.background.elevated}`
                    : `${theme.colors.background.elevated}90`,
                },
              ]}
            >
              <Text
                style={[
                  styles.foodLabelText,
                  { color: theme.colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          ) : null
        )}

        {item.foodLabels.length > 3 && (
          <TouchableOpacity>
            <Text
              style={[
                styles.moreLabelsText,
                { color: theme.colors.primary.main },
              ]}
            >
              +{item.foodLabels.length - 3} more
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealCardWrapper: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDivider: {
    height: 1,
    width: '100%',
  },
  calorieIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  calorieUnit: {
    fontSize: 11,
    fontWeight: '500',
  },
  foodLabelsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 12,
  },
  foodLabelChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  foodLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreLabelsText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
});

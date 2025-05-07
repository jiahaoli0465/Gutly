import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MealTagProps } from './types';

export const MealTag: React.FC<MealTagProps> = ({ type }) => {
  const getTagColor = (): string => {
    switch (type) {
      case 'Breakfast':
        return '#5D9CEC'; // Light blue
      case 'Lunch':
        return '#48CFAD'; // Mint
      case 'Dinner':
        return '#AC92EC'; // Purple
      case 'Snack':
        return '#FFCE54'; // Yellow
      default:
        return '#ED5565'; // Red
    }
  };

  return (
    <View style={[styles.mealTag, { backgroundColor: getTagColor() }]}>
      <Text style={styles.mealTagText}>{type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mealTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  mealTagText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

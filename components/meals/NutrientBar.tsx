import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NutrientBarProps } from './types';

export const NutrientBar: React.FC<NutrientBarProps> = ({
  protein,
  carbs,
  fat,
}) => {
  const total = protein + carbs + fat;
  const proteinPercentage = total > 0 ? (protein / total) * 100 : 0;
  const carbsPercentage = total > 0 ? (carbs / total) * 100 : 0;
  const fatPercentage = total > 0 ? (fat / total) * 100 : 0;

  return (
    <View style={styles.nutrientBarContainer}>
      <View
        style={[
          styles.nutrientBarSegment,
          { width: `${proteinPercentage}%`, backgroundColor: '#48CFAD' },
        ]}
      />
      <View
        style={[
          styles.nutrientBarSegment,
          { width: `${carbsPercentage}%`, backgroundColor: '#FFCE54' },
        ]}
      />
      <View
        style={[
          styles.nutrientBarSegment,
          { width: `${fatPercentage}%`, backgroundColor: '#ED5565' },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nutrientBarContainer: {
    height: 6,
    borderRadius: 3,
    flexDirection: 'row',
    marginBottom: 8,
    overflow: 'hidden',
  },
  nutrientBarSegment: {
    height: '100%',
  },
});

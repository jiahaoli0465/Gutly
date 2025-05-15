import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DailyProgressData {
  // Core Hydration & Fiber
  waterIntake: number;
  waterGoal: number;
  fiberIntake: number;
  fiberGoal: number;

  // Essential Gut Health Foods
  probioticFoods: number;
  probioticGoal: number;

  // Meal Tracking
  mealsLogged: number;
  mealsGoal: number;
}

interface DailyProgressProps {
  progress: DailyProgressData;
}

const DailyProgress = ({ progress }: DailyProgressProps) => {
  const { theme } = useTheme();

  const progressItems = [
    {
      label: 'Water Intake',
      current: progress.waterIntake,
      goal: progress.waterGoal,
      icon: 'water' as const,
      color: theme.colors.primary.main,
      unit: 'glasses',
      tip: 'Stay hydrated to support digestion and gut motility',
    },
    {
      label: 'Fiber Intake',
      current: progress.fiberIntake,
      goal: progress.fiberGoal,
      icon: 'nutrition' as const,
      color: theme.colors.success.main,
      unit: 'g',
      tip: 'Aim for a mix of soluble and insoluble fiber',
    },
    {
      label: 'Probiotic Foods',
      current: progress.probioticFoods,
      goal: progress.probioticGoal,
      icon: 'leaf' as const,
      color: '#FF9500',
      unit: 'servings',
      tip: 'Include probiotic sources like yogurt, kefir, or kimchi',
    },
    {
      label: 'Meals Logged',
      current: progress.mealsLogged,
      goal: progress.mealsGoal,
      icon: 'restaurant' as const,
      color: '#FF2D55',
      unit: 'meals',
      tip: 'Track your meals to identify food triggers and patterns',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Daily Progress
      </Text>
      <View style={styles.progressGrid}>
        {progressItems.map((item) => (
          <View
            key={item.label}
            style={[
              styles.progressCard,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
          >
            <View style={styles.progressHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.color}10` },
                ]}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text
                style={[styles.label, { color: theme.colors.text.primary }]}
              >
                {item.label}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(item.current / item.goal) * 100}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <View style={styles.progressFooter}>
              <Text
                style={[
                  styles.progressText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {item.current}/{item.goal} {item.unit}
              </Text>
              <TouchableOpacity
                style={styles.tipButton}
                onPress={() => {
                  /* TODO: Show tip tooltip */
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  progressCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipButton: {
    padding: 4,
  },
});

export default DailyProgress;

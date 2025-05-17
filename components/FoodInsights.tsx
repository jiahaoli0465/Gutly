import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

export interface FoodInsight {
  id: number;
  food: string;
  impact: 'Positive' | 'Negative';
  confidence: 'High' | 'Medium' | 'Low';
  icon: IconName;
  details: string;
  correlation: string;
}

interface FoodInsightsProps {
  insights: FoodInsight[];
  onInsightPress?: (insight: FoodInsight) => void;
}

const FoodInsights: React.FC<FoodInsightsProps> = ({
  insights,
  onInsightPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Food Insights
      </Text>
      <View style={styles.insightsContainer}>
        {insights.map((insight) => (
          <TouchableOpacity
            key={insight.id}
            style={[
              styles.insightCard,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
            onPress={() => onInsightPress?.(insight)}
            activeOpacity={0.9}
          >
            <Ionicons
              name={insight.icon}
              size={24}
              color={
                insight.impact === 'Positive'
                  ? theme.colors.success.main
                  : theme.colors.error.main
              }
            />
            <View style={styles.insightInfo}>
              <Text
                style={[
                  styles.insightFood,
                  { color: theme.colors.text.primary },
                ]}
              >
                {insight.food}
              </Text>
              <Text
                style={[
                  styles.insightImpact,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {insight.impact} Impact • {insight.confidence} Confidence
              </Text>
              <Text
                style={[
                  styles.insightDetails,
                  { color: theme.colors.text.secondary },
                ]}
                numberOfLines={2}
              >
                {insight.details}
              </Text>
              <Text
                style={[
                  styles.insightCorrelation,
                  { color: theme.colors.primary.main },
                ]}
              >
                {insight.correlation}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightFood: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightImpact: {
    fontSize: 14,
    marginBottom: 8,
  },
  insightDetails: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  insightCorrelation: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default FoodInsights;

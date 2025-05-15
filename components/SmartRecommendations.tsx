import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Types
type IconName = keyof typeof Ionicons.glyphMap;

interface Recommendation {
  id: number;
  title: string;
  description: string;
  icon: IconName;
  priority: 'high' | 'medium' | 'low';
  action: string;
  reasoning: string;
}

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
  onViewDetails?: (recommendation: Recommendation) => void;
  onDismiss?: (id: number) => void;
}

const { width } = Dimensions.get('window');

const SmartRecommendations = ({
  recommendations,
  onViewDetails,
  onDismiss,
}: SmartRecommendationsProps) => {
  const { theme } = useTheme();

  const getPriorityData = (
    priority: 'high' | 'medium' | 'low'
  ): {
    color: string;
    icon: IconName;
    label: string;
  } => {
    switch (priority) {
      case 'high':
        return {
          color: '#FF3B30',
          icon: 'flash',
          label: 'Priority',
        };
      case 'medium':
        return {
          color: '#FF9500',
          icon: 'time',
          label: 'Important',
        };
      case 'low':
        return {
          color: '#34C759',
          icon: 'checkmark-circle',
          label: 'Suggested',
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Smart Recommendations
        </Text>
      </View>

      {recommendations.map((item) => {
        const priorityData = getPriorityData(item.priority);

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
            activeOpacity={0.9}
            onPress={() => onViewDetails && onViewDetails(item)}
            accessibilityLabel={`${priorityData.label}: ${item.title}`}
            accessibilityRole="button"
          >
            <View style={styles.cardContent}>
              <View style={styles.leftSection}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${priorityData.color}10` },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={priorityData.color}
                  />
                </View>
              </View>

              <View style={styles.contentSection}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: theme.colors.text.primary },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>

                  <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={() => onDismiss && onDismiss(item.id)}
                    hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                    accessibilityLabel={`Dismiss ${item.title}`}
                  >
                    <Ionicons
                      name="close"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.description,
                    { color: theme.colors.text.secondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>

                <View style={styles.footer}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: `${priorityData.color}10` },
                    ]}
                  >
                    <Ionicons
                      name={priorityData.icon}
                      size={12}
                      color={priorityData.color}
                    />
                    <Text
                      style={[styles.badgeText, { color: priorityData.color }]}
                    >
                      {priorityData.label}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.actionText,
                      { color: theme.colors.primary.main },
                    ]}
                  >
                    Details
                    <Ionicons
                      name="chevron-forward"
                      size={12}
                      color={theme.colors.primary.main}
                      style={{ marginLeft: 4 }}
                    />
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Clean, minimalist styles inspired by Apple's design language
const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  card: {
    marginBottom: 12,
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.4,
  },
  dismissButton: {
    padding: 4,
  },
  description: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SmartRecommendations;

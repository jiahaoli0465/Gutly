import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: { value: number; isPositive: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[
          theme.colors.background.paper,
          theme.colors.background.elevated,
        ]}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statHeader}>
          <Ionicons
            name={icon as any}
            size={24}
            color={theme.colors.primary.main}
          />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={
                trend.isPositive
                  ? theme.colors.success.main
                  : theme.colors.error.main
              }
            />
            <Text
              style={[
                styles.trendText,
                {
                  color: trend.isPositive
                    ? theme.colors.success.main
                    : theme.colors.error.main,
                },
              ]}
            >
              {trend.value}%
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statGradient: {
    flex: 1,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default StatCard;

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.paper },
        Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }),
      ]}
    >
      <View style={styles.header}>
        <Ionicons
          name={icon as any}
          size={20}
          color={theme.colors.primary.main}
        />
        <Text style={[styles.title, { color: theme.colors.text.secondary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.text.primary }]}>
        {value}
      </Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons
            name={trend.isPositive ? 'trending-up' : 'trending-down'}
            size={16}
            color={
              trend.isPositive
                ? theme.colors.success.dark
                : theme.colors.error.dark
            }
          />
          <Text
            style={[
              styles.trendText,
              {
                color: trend.isPositive
                  ? theme.colors.success.dark
                  : theme.colors.error.dark,
              },
            ]}
          >
            {trend.value}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

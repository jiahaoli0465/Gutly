import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

export const Header = () => {
  const { theme } = useTheme();
  const today = new Date();

  const formattedDate = useMemo(() => {
    return today.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [today]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View>
          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Track
          </Text>
          <Text
            style={[styles.headerDate, { color: theme.colors.text.secondary }]}
          >
            {formattedDate}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: theme.colors.background.paper },
            ]}
          >
            <MaterialCommunityIcons
              name="calendar-month"
              size={20}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: theme.colors.background.paper,
                marginLeft: 8,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="filter-variant"
              size={20}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryBar}>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.background.paper,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                },
                android: {
                  elevation: 2,
                },
              }),
            },
          ]}
        >
          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryIcon,
                { backgroundColor: `${theme.colors.primary.light}15` },
              ]}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={14}
                color={theme.colors.primary.main}
              />
            </View>
            <Text
              style={[styles.summaryText, { color: theme.colors.text.primary }]}
            >
              2 Meals
            </Text>
          </View>

          <View
            style={[
              styles.summaryDivider,
              { backgroundColor: theme.colors.divider },
            ]}
          />

          <View style={styles.summaryItem}>
            <View
              style={[
                styles.summaryIcon,
                { backgroundColor: `${theme.colors.error.light}15` },
              ]}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={14}
                color={theme.colors.error.main}
              />
            </View>
            <Text
              style={[styles.summaryText, { color: theme.colors.text.primary }]}
            >
              2 Symptoms
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  summaryIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 12,
  },
});

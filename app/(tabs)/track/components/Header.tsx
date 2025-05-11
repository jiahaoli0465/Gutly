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

        <View style={styles.rightSection}>
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

          <TouchableOpacity
            style={[
              styles.summaryPill,
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
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={14}
                  color={theme.colors.primary.main}
                  style={styles.summaryIcon}
                />
                <Text
                  style={[
                    styles.summaryText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  2
                </Text>
              </View>

              <View
                style={[
                  styles.summaryDivider,
                  { backgroundColor: theme.colors.divider },
                ]}
              />

              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={14}
                  color={theme.colors.error.main}
                  style={styles.summaryIcon}
                />
                <Text
                  style={[
                    styles.summaryText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  2
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  rightSection: {
    alignItems: 'flex-end',
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
    marginBottom: 8,
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
  summaryPill: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  summaryIcon: {
    marginRight: 4,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 12,
    marginHorizontal: 8,
  },
});

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

export const EmptyState = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: `${theme.colors.primary.light}10` },
        ]}
      >
        <MaterialCommunityIcons
          name="notebook-plus-outline"
          size={38}
          color={theme.colors.primary.main}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
        Your day looks empty
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}
      >
        Start tracking your meals and symptoms to gain insights about your
        digestive health
      </Text>

      <TouchableOpacity
        style={[
          styles.emptyActionButton,
          { backgroundColor: theme.colors.primary.main },
        ]}
      >
        <MaterialCommunityIcons
          name="plus"
          size={18}
          color={theme.colors.primary.contrast}
          style={styles.emptyActionButtonIcon}
        />
        <Text
          style={[
            styles.emptyActionButtonText,
            { color: theme.colors.primary.contrast },
          ]}
        >
          Add First Entry
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  emptyIconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionButtonIcon: {
    marginRight: 8,
  },
  emptyActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

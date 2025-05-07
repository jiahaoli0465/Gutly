import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyStateProps } from './types';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  action,
}) => {
  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <MaterialCommunityIcons name={icon as any} size={64} color="#9EA3B2" />
        <Text style={styles.emptyStateMessage}>{message}</Text>
        {action && (
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={action.onPress}
          >
            <Text style={styles.emptyStateButtonText}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#525B7A',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#5D9CEC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

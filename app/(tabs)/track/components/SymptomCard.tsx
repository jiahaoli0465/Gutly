import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

type SymptomItem = {
  id: string;
  type: 'symptom';
  timestamp: Date;
  symptom: string;
  severity: number;
  bristolScore?: number;
};

export const SymptomCard = ({ item }: { item: SymptomItem }) => {
  const { theme, isDark } = useTheme();

  // Get appropriate icon for symptom
  const getSymptomIcon = (
    symptomName: string
  ): keyof typeof MaterialCommunityIconsType.glyphMap => {
    switch (symptomName.toLowerCase()) {
      case 'bloating':
        return 'stomach';
      case 'abdominal pain':
        return 'alert-circle';
      default:
        return 'alert-circle-outline';
    }
  };

  // Enhanced severity color and descriptions
  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1:
        return theme.colors.success.main;
      case 2:
        return theme.colors.warning.main;
      case 3:
        return theme.colors.warning.dark;
      case 4:
        return theme.colors.error.main;
      case 5:
        return theme.colors.error.dark;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getSeverityText = (severity: number) => {
    switch (severity) {
      case 1:
        return 'Mild';
      case 2:
        return 'Moderate';
      case 3:
        return 'Significant';
      case 4:
        return 'Severe';
      case 5:
        return 'Extreme';
      default:
        return 'None';
    }
  };

  const bristolDescription = (score: number) => {
    switch (score) {
      case 1:
        return 'Hard lumps';
      case 2:
        return 'Lumpy sausage';
      case 3:
        return 'Cracked sausage';
      case 4:
        return 'Smooth, soft sausage';
      case 5:
        return 'Soft blobs';
      case 6:
        return 'Fluffy pieces';
      case 7:
        return 'Watery';
      default:
        return '';
    }
  };

  return (
    <View style={styles.symptomCardWrapper}>
      {/* Top section with icon, title, and time */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleSection}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${getSeverityColor(item.severity)}15` },
            ]}
          >
            <MaterialCommunityIcons
              name={getSymptomIcon(item.symptom)}
              size={15}
              color={getSeverityColor(item.severity)}
            />
          </View>

          <View>
            <Text
              style={[styles.cardTitle, { color: theme.colors.text.primary }]}
            >
              {item.symptom}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.severityContainer,
            { backgroundColor: `${getSeverityColor(item.severity)}15` },
          ]}
        >
          <Text
            style={[
              styles.severityText,
              { color: getSeverityColor(item.severity) },
            ]}
          >
            {getSeverityText(item.severity)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[styles.cardDivider, { backgroundColor: theme.colors.divider }]}
      />

      {/* Symptom details section */}
      <View style={styles.symptomDetailsSection}>
        <View style={styles.severitySection}>
          <Text
            style={[
              styles.severityLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Intensity
          </Text>

          <View style={styles.severityBarContainer}>
            {[1, 2, 3, 4, 5].map((level) => (
              <View
                key={level}
                style={[
                  styles.severityBar,
                  {
                    backgroundColor:
                      level <= item.severity
                        ? getSeverityColor(item.severity)
                        : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    opacity: level <= item.severity ? 0.6 + level * 0.08 : 0.3,
                    height: 4 + (level <= item.severity ? level * 2 : 0),
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {item.bristolScore && (
          <View style={styles.bristolSection}>
            <Text
              style={[
                styles.bristolLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Bristol Scale
            </Text>
            <View style={styles.bristolScoreContainer}>
              <View
                style={[
                  styles.bristolScoreBadge,
                  {
                    backgroundColor: isDark
                      ? `${theme.colors.background.elevated}`
                      : `${theme.colors.background.elevated}90`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bristolScoreText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {item.bristolScore}
                </Text>
              </View>
              <Text
                style={[
                  styles.bristolDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {bristolDescription(item.bristolScore)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  symptomCardWrapper: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDivider: {
    height: 1,
    width: '100%',
  },
  severityContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  symptomDetailsSection: {
    padding: 16,
    paddingTop: 12,
  },
  severitySection: {
    marginBottom: 12,
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  severityBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 14,
  },
  severityBar: {
    flex: 1,
    marginRight: 4,
    borderRadius: 2,
  },
  bristolSection: {},
  bristolLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  bristolScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bristolScoreBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bristolScoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bristolDescription: {
    fontSize: 13,
  },
});

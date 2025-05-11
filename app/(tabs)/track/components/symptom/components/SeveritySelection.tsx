import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../../../context/ThemeContext';

type SeveritySelectionProps = {
  severity: number;
  onSeverityChange: (severity: number) => void;
};

export const SeveritySelection = ({
  severity,
  onSeverityChange,
}: SeveritySelectionProps) => {
  const { theme, isDark } = useTheme();

  const getSeverityColor = (value: number) => {
    switch (value) {
      case 1:
        return theme.colors.success.main;
      case 2:
        return theme.colors.success.dark;
      case 3:
        return theme.colors.warning.main;
      case 4:
        return theme.colors.error.light;
      case 5:
        return theme.colors.error.main;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getSeverityText = (value: number) => {
    switch (value) {
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

  return (
    <View style={styles.formStep}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
          How severe is it?
        </Text>
      </View>

      <View
        style={[
          styles.severityContainer,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <View style={styles.severityHeader}>
          <View style={styles.severityScaleLabels}>
            <Text
              style={[
                styles.severityScaleLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Mild
            </Text>
            <Text
              style={[
                styles.severityScaleLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Extreme
            </Text>
          </View>

          <View
            style={[
              styles.severityBadge,
              { backgroundColor: `${getSeverityColor(severity)}15` },
            ]}
          >
            <Text
              style={[
                styles.severityBadgeText,
                { color: getSeverityColor(severity) },
              ]}
            >
              {getSeverityText(severity)}
            </Text>
          </View>
        </View>

        <View style={styles.severitySliderRow}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={severity}
            onValueChange={(value) => {
              onSeverityChange(value);
              if (value === 5 || value === 1) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            minimumTrackTintColor={getSeverityColor(severity)}
            maximumTrackTintColor={
              isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
            }
            thumbTintColor={getSeverityColor(severity)}
          />
        </View>

        <View style={styles.severityIndicators}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View key={level} style={styles.severityIndicatorItem}>
              <View
                style={[
                  styles.severityDot,
                  {
                    backgroundColor:
                      level <= severity
                        ? getSeverityColor(severity)
                        : isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.05)',
                    transform: [{ scale: level === severity ? 1.3 : 1 }],
                  },
                ]}
              />
              <Text
                style={[
                  styles.severityLevel,
                  {
                    color:
                      level === severity
                        ? getSeverityColor(severity)
                        : theme.colors.text.secondary,
                    fontWeight: level === severity ? '600' : '400',
                    opacity: level === severity ? 1 : 0.7,
                  },
                ]}
              >
                {level}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formStep: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D7EB0',
    marginRight: 10,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityContainer: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  severityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
  },
  severityScaleLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  severitySliderRow: {
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  severityIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  severityIndicatorItem: {
    alignItems: 'center',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  severityLevel: {
    fontSize: 12,
  },
});

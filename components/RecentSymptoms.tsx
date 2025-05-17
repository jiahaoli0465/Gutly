import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

export interface Symptom {
  id: number;
  symptom: string;
  severity: string;
  time: string;
  icon: IconName;
  notes: string;
}

interface RecentSymptomsProps {
  symptoms: Symptom[];
  onSymptomPress?: (symptom: Symptom) => void;
}

const RecentSymptoms: React.FC<RecentSymptomsProps> = ({
  symptoms,
  onSymptomPress,
}) => {
  const { theme } = useTheme();

  // Ensure we have symptoms to display
  if (!symptoms || symptoms.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Recent Symptoms
        </Text>
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <Text
            style={[styles.emptyText, { color: theme.colors.text.secondary }]}
          >
            No symptoms recorded yet
          </Text>
        </View>
      </View>
    );
  }

  // More refined Apple-like severity indicators with safer icon names
  const getSeverityData = (
    severity: string
  ): {
    color: string;
    icon: IconName;
    background: string;
  } => {
    switch (severity.toLowerCase()) {
      case 'severe':
        return {
          color: '#FF3B30', // Apple red
          icon: 'warning-outline' as IconName,
          background: '#FFEFED',
        };
      case 'moderate':
        return {
          color: '#FF9500', // Apple orange
          icon: 'alert-outline' as IconName,
          background: '#FFF5E6',
        };
      case 'mild':
        return {
          color: '#34C759', // Apple green
          icon: 'checkmark-circle-outline' as IconName,
          background: '#EDFAF1',
        };
      default:
        return {
          color: '#8E8E93', // Apple gray
          icon: 'information-circle-outline' as IconName,
          background: '#F2F2F7',
        };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Recent Symptoms
      </Text>
      <View style={styles.symptomsContainer}>
        {symptoms.map((symptom) => {
          const severityData = getSeverityData(symptom.severity);

          return (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomCard,
                { backgroundColor: theme.colors.background.paper },
                Platform.OS === 'ios' ? styles.iosShadow : styles.androidShadow,
              ]}
              onPress={() => onSymptomPress && onSymptomPress(symptom)}
              activeOpacity={0.95}
              accessibilityLabel={`${symptom.symptom}, ${symptom.severity} severity, ${symptom.time}`}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: severityData.background },
                ]}
              >
                <Ionicons
                  name={symptom.icon}
                  size={22}
                  color={severityData.color}
                />
              </View>

              <View style={styles.symptomInfo}>
                <Text
                  style={[
                    styles.symptomName,
                    { color: theme.colors.text.primary },
                  ]}
                  numberOfLines={1}
                >
                  {symptom.symptom}
                </Text>

                <View style={styles.symptomDetails}>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: `${severityData.color}12` },
                    ]}
                  >
                    <Ionicons
                      name={severityData.icon}
                      size={12}
                      color={severityData.color}
                      style={styles.severityIcon}
                    />
                    <Text
                      style={[
                        styles.symptomSeverity,
                        { color: severityData.color },
                      ]}
                    >
                      {symptom.severity}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.symptomTime,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {symptom.time}
                  </Text>
                </View>

                {symptom.notes ? (
                  <Text
                    style={[
                      styles.symptomNotes,
                      { color: theme.colors.text.secondary },
                    ]}
                    numberOfLines={2}
                  >
                    {symptom.notes}
                  </Text>
                ) : null}
              </View>

              <View style={styles.chevronContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.text.secondary}
                  style={styles.chevron}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  symptomsContainer: {
    gap: 12,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  androidShadow: {
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  symptomInfo: {
    flex: 1,
    paddingRight: 8,
  },
  symptomName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  symptomDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  severityIcon: {
    marginRight: 4,
  },
  symptomSeverity: {
    fontSize: 13,
    fontWeight: '500',
  },
  symptomTime: {
    fontSize: 13,
  },
  symptomNotes: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.8,
  },
  chevronContainer: {
    justifyContent: 'center',
    paddingLeft: 4,
  },
  chevron: {
    marginTop: 2,
  },
});

export default RecentSymptoms;

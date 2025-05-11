import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../../../context/ThemeContext';
import { BRISTOL_DESCRIPTIONS } from '../constants';

type BristolScaleProps = {
  bristolScore: number | undefined;
  onBristolScoreChange: (score: number | undefined) => void;
  hasError?: boolean;
};

export const BristolScale = ({
  bristolScore,
  onBristolScoreChange,
  hasError,
}: BristolScaleProps) => {
  const { theme, isDark } = useTheme();

  const getBristolDescription = (score?: number) => {
    if (!score) return '';
    const description = BRISTOL_DESCRIPTIONS.find(
      (item) => item.score === score
    );
    return description?.description || '';
  };

  const getBristolColor = (score?: number) => {
    if (!score) return theme.colors.text.secondary;
    const bristolInfo = BRISTOL_DESCRIPTIONS.find(
      (item) => item.score === score
    );
    return bristolInfo?.color || theme.colors.text.secondary;
  };

  return (
    <View style={styles.formStep}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
          Bristol Stool Scale
        </Text>
        <TouchableOpacity style={styles.infoButton}>
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color={theme.colors.primary.main}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.bristolScaleContainer,
          {
            backgroundColor: theme.colors.background.paper,
            borderColor:
              hasError && !bristolScore
                ? theme.colors.error.main
                : 'transparent',
          },
        ]}
      >
        {bristolScore ? (
          <View style={styles.selectedBristolContainer}>
            <View
              style={[
                styles.selectedBristolHeader,
                { borderBottomColor: theme.colors.divider },
              ]}
            >
              <View
                style={[
                  styles.selectedBristolBadge,
                  {
                    backgroundColor: getBristolColor(bristolScore),
                  },
                ]}
              >
                <Text style={styles.selectedBristolNumber}>{bristolScore}</Text>
              </View>
              <Text
                style={[
                  styles.selectedBristolDesc,
                  { color: theme.colors.text.primary },
                ]}
              >
                {getBristolDescription(bristolScore)}
              </Text>
              <TouchableOpacity
                style={styles.changeBristolButton}
                onPress={() => onBristolScoreChange(undefined)}
              >
                <Text
                  style={[
                    styles.changeBristolText,
                    { color: theme.colors.primary.main },
                  ]}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.bristolInfoText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Type {bristolScore} stools can indicate{' '}
              {bristolScore < 3
                ? 'constipation'
                : bristolScore > 5
                ? 'diarrhea'
                : 'normal digestion'}
              .
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bristolOptionsContainer}
          >
            {BRISTOL_DESCRIPTIONS.map((item) => (
              <TouchableOpacity
                key={item.score}
                style={[
                  styles.bristolOption,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                  },
                ]}
                onPress={() => {
                  onBristolScoreChange(item.score);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View
                  style={[
                    styles.bristolOptionNumber,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Text style={styles.bristolOptionNumberText}>
                    {item.score}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bristolOptionDesc,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
  infoButton: {
    padding: 4,
    marginLeft: 6,
  },
  bristolScaleContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  bristolOptionsContainer: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  bristolOption: {
    width: 90,
    marginHorizontal: 6,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  bristolOptionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bristolOptionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  bristolOptionDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedBristolContainer: {
    padding: 16,
  },
  selectedBristolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  selectedBristolBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedBristolNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  selectedBristolDesc: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  changeBristolButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeBristolText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bristolInfoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

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
import { SYMPTOMS } from '../constants';
import { SymptomType } from '../types';

type SymptomSelectionProps = {
  selectedSymptom: SymptomType | null;
  onSelectSymptom: (symptom: SymptomType) => void;
  activeCategory: 'digestive' | 'discomfort' | 'other';
  onCategoryChange: (category: 'digestive' | 'discomfort' | 'other') => void;
  hasError?: boolean;
};

export const SymptomSelection = ({
  selectedSymptom,
  onSelectSymptom,
  activeCategory,
  onCategoryChange,
  hasError,
}: SymptomSelectionProps) => {
  const { theme, isDark } = useTheme();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'digestive':
        return 'stomach';
      case 'discomfort':
        return 'alert-circle-outline';
      case 'other':
        return 'dots-horizontal';
      default:
        return 'dots-horizontal';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'digestive':
        return 'Digestive';
      case 'discomfort':
        return 'Discomfort';
      case 'other':
        return 'Other';
      default:
        return 'Other';
    }
  };

  const filteredSymptoms = SYMPTOMS.filter(
    (symptom) => symptom.category === activeCategory
  );

  return (
    <View style={styles.formStep}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>1</Text>
        </View>
        <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
          What are you experiencing?
        </Text>
      </View>

      {/* Category tabs */}
      <View style={styles.categoryTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabs}
        >
          {['digestive', 'discomfort', 'other'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                activeCategory === category && [
                  styles.activeCategoryTab,
                  { borderColor: theme.colors.primary.main },
                ],
              ]}
              onPress={() => {
                onCategoryChange(category as any);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <MaterialCommunityIcons
                name={getCategoryIcon(category)}
                size={16}
                color={
                  activeCategory === category
                    ? theme.colors.primary.main
                    : theme.colors.text.secondary
                }
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      activeCategory === category
                        ? theme.colors.primary.main
                        : theme.colors.text.secondary,
                  },
                ]}
              >
                {getCategoryTitle(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Symptom list */}
      <View
        style={[
          styles.symptomListContainer,
          {
            borderColor:
              hasError && !selectedSymptom
                ? theme.colors.error.main
                : theme.colors.divider,
            backgroundColor: theme.colors.background.paper,
          },
        ]}
      >
        {filteredSymptoms.map((symptom) => {
          const isSelected = selectedSymptom?.id === symptom.id;
          return (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomItem,
                {
                  borderBottomColor: theme.colors.divider,
                  backgroundColor: isSelected
                    ? `${theme.colors.primary.main}10`
                    : 'transparent',
                },
              ]}
              onPress={() => {
                onSelectSymptom(symptom);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={styles.symptomItemContent}>
                <View
                  style={[
                    styles.symptomIcon,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary.main
                        : isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.04)',
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={symptom.icon}
                    size={16}
                    color={
                      isSelected
                        ? theme.colors.primary.contrast
                        : theme.colors.text.primary
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.symptomName,
                    {
                      color: theme.colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {symptom.name}
                </Text>

                {symptom.requiresBristol && (
                  <View
                    style={[
                      styles.bristolIndicator,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.04)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.bristolIndicatorText,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      Bristol
                    </Text>
                  </View>
                )}
              </View>

              {isSelected && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.primary.main}
                />
              )}
            </TouchableOpacity>
          );
        })}
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
  categoryTabsContainer: {
    marginBottom: 14,
  },
  categoryTabs: {
    paddingVertical: 4,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  activeCategoryTab: {
    backgroundColor: 'rgba(29, 126, 176, 0.08)',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  symptomListContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  symptomItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symptomIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symptomName: {
    fontSize: 15,
    flex: 1,
  },
  bristolIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  bristolIndicatorText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

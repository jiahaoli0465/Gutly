import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  InputAccessoryView,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { SymptomItem } from '../types';

type LogSymptomModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (symptom: Omit<SymptomItem, 'id'>) => void;
};

type SymptomType = {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  requiresBristol: boolean;
  category: 'digestive' | 'discomfort' | 'other';
};

const SYMPTOMS: SymptomType[] = [
  {
    id: 'bloating',
    name: 'Bloating',
    icon: 'stomach',
    requiresBristol: false,
    category: 'digestive',
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: 'air-filter',
    requiresBristol: false,
    category: 'digestive',
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    icon: 'water-alert',
    requiresBristol: true,
    category: 'digestive',
  },
  {
    id: 'constipation',
    name: 'Constipation',
    icon: 'transit-connection-variant',
    requiresBristol: true,
    category: 'digestive',
  },
  {
    id: 'pain',
    name: 'Abdominal Pain',
    icon: 'alert-circle',
    requiresBristol: false,
    category: 'discomfort',
  },
  {
    id: 'heartburn',
    name: 'Heartburn',
    icon: 'fire',
    requiresBristol: false,
    category: 'discomfort',
  },
  {
    id: 'nausea',
    name: 'Nausea',
    icon: 'emoticon-sick-outline',
    requiresBristol: false,
    category: 'discomfort',
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    icon: 'sleep',
    requiresBristol: false,
    category: 'other',
  },
  {
    id: 'headache',
    name: 'Headache',
    icon: 'head-flash',
    requiresBristol: false,
    category: 'other',
  },
  {
    id: 'cramping',
    name: 'Cramping',
    icon: 'stomach',
    requiresBristol: false,
    category: 'discomfort',
  },
];

// Bristol scale descriptions for better UX
const BRISTOL_DESCRIPTIONS = [
  { score: 1, description: 'Hard lumps', color: '#8B4513' }, // Brown
  { score: 2, description: 'Lumpy sausage', color: '#A0522D' }, // Sienna
  { score: 3, description: 'Cracked sausage', color: '#CD853F' }, // Peru
  { score: 4, description: 'Smooth, soft sausage', color: '#D2B48C' }, // Tan
  { score: 5, description: 'Soft blobs', color: '#DEB887' }, // Burlywood
  { score: 6, description: 'Fluffy pieces', color: '#F5DEB3' }, // Wheat
  { score: 7, description: 'Watery', color: '#F5F5DC' }, // Beige
];

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Input accessory ID for iOS keyboard
const INPUT_ACCESSORY_ID = 'symptomInputAccessory';

export const LogSymptomModal = ({
  visible,
  onClose,
  onSave,
}: LogSymptomModalProps) => {
  const { theme, isDark } = useTheme();
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType | null>(
    null
  );
  const [severity, setSeverity] = useState(3);
  const [bristolScore, setBristolScore] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<
    'digestive' | 'discomfort' | 'other'
  >('digestive');
  const [activeInputSection, setActiveInputSection] = useState<'notes' | null>(
    null
  );
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Track drag state
  const [isDragging, setIsDragging] = useState(false);

  // Add PanResponder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (_, gestureState) => {
        // Only respond if touch starts in the handle area (top 50px of modal)
        return gestureState.y0 < 50;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical movements and when swiping down
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          gestureState.dy > 0
        );
      },
      onPanResponderGrant: () => {
        // Dismiss keyboard when starting to swipe
        Keyboard.dismiss();
        setIsDragging(true);

        // Scale down slightly on drag start for visual feedback
        Animated.spring(modalScaleAnim, {
          toValue: 0.98,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);

          // Gradually fade backdrop as modal is dragged down
          const newOpacity = Math.max(
            0,
            1 - gestureState.dy / (SCREEN_HEIGHT * 0.4)
          );
          backdropOpacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);

        // Return to normal scale
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }).start();

        // Check both distance and velocity to determine whether to dismiss
        if (
          gestureState.dy > 100 ||
          (gestureState.dy > 50 && gestureState.vy > 1)
        ) {
          // If swiped down enough or with enough velocity, dismiss the modal
          handleCloseModal();
        } else {
          // Otherwise, snap back to original position with spring animation
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 65,
              friction: 7,
              useNativeDriver: true,
            }),
            Animated.spring(backdropOpacity, {
              toValue: 1,
              tension: 65,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);

        // Return to normal scale and position if gesture is interrupted
        Animated.parallel([
          Animated.spring(modalScaleAnim, {
            toValue: 1,
            tension: 65,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 65,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(backdropOpacity, {
            toValue: 1,
            tension: 65,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  // Add modalScaleAnim for drag feedback
  const modalScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Reset states when modal opens
      setHasError(false);
      setErrorMessage('');

      // Animate modal in
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate modal out
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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

  const validateAndSave = () => {
    // Validate symptom selection
    if (!selectedSymptom) {
      setHasError(true);
      setErrorMessage('Please select a symptom');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Validate Bristol score if required
    if (selectedSymptom.requiresBristol && !bristolScore) {
      setHasError(true);
      setErrorMessage('Please select a Bristol scale score');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateAndSave()) return;

    const newSymptom: Omit<SymptomItem, 'id'> = {
      type: 'symptom',
      timestamp: new Date(),
      symptom: selectedSymptom!.name,
      severity,
      bristolScore: selectedSymptom!.requiresBristol ? bristolScore : undefined,
    };

    onSave(newSymptom);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedSymptom(null);
    setSeverity(3);
    setBristolScore(undefined);
    setNotes('');
    setHasError(false);
    setErrorMessage('');
    setActiveCategory('digestive');
    setActiveInputSection(null);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

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

  // Render quick keyboard accessory for iOS
  const renderInputAccessory = useCallback(() => {
    if (Platform.OS !== 'ios') return null;

    return (
      <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
        <View
          style={[
            styles.keyboardAccessory,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <TouchableOpacity
            style={styles.keyboardAccessoryButton}
            onPress={() => Keyboard.dismiss()}
          >
            <Text
              style={{ color: theme.colors.primary.main, fontWeight: '600' }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    );
  }, [theme]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={handleCloseModal}
    >
      <Animated.View
        style={[styles.modalOverlay, { opacity: backdropOpacity }]}
      >
        <BlurView
          intensity={isDark ? 40 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurView}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }, { scale: modalScaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.default },
          ]}
        >
          {/* Handle for dragging to dismiss modal */}
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDragging
                    ? theme.colors.primary.main
                    : theme.colors.divider,
                  width: isDragging ? 50 : 36,
                },
              ]}
            />
          </View>

          {/* Modal header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>

            <Text
              style={[styles.modalTitle, { color: theme.colors.text.primary }]}
            >
              Log Symptom
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Main content scrollable area */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Error message (if any) */}
            {hasError && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color={theme.colors.error.main}
                  style={styles.errorIcon}
                />
                <Text
                  style={[styles.errorText, { color: theme.colors.error.main }]}
                >
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Main form content */}
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* Step 1: Symptom Selection */}
              <View style={styles.formStep}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>1</Text>
                  </View>
                  <Text
                    style={[
                      styles.stepTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
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
                          setActiveCategory(category as any);
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
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

                {/* Compact symptom selection */}
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
                          setSelectedSymptom(symptom);
                          setHasError(false);
                          setErrorMessage('');
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          // Reset Bristol score if not required
                          if (!symptom.requiresBristol) {
                            setBristolScore(undefined);
                          }
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

              {/* Step 2: Severity */}
              <View style={styles.formStep}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text
                    style={[
                      styles.stepTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
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
                        setSeverity(value);
                        if (value === 5 || value === 1) {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Medium
                          );
                        } else {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
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
                              transform: [
                                { scale: level === severity ? 1.3 : 1 },
                              ],
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

              {/* Step 3: Bristol Scale (if applicable) */}
              {selectedSymptom?.requiresBristol && (
                <View style={styles.formStep}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumberContainer}>
                      <Text style={styles.stepNumber}>3</Text>
                    </View>
                    <Text
                      style={[
                        styles.stepTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
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
                          hasError &&
                          selectedSymptom.requiresBristol &&
                          !bristolScore
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
                            <Text style={styles.selectedBristolNumber}>
                              {bristolScore}
                            </Text>
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
                            onPress={() => setBristolScore(undefined)}
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
                              setBristolScore(item.score);
                              setHasError(false);
                              Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                              );
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
              )}

              {/* Step 4: Notes (optional) */}
              <View style={styles.formStep}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>
                      {selectedSymptom?.requiresBristol ? '4' : '3'}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Additional Notes (optional)
                  </Text>
                </View>

                <View
                  style={[
                    styles.notesContainer,
                    { backgroundColor: theme.colors.background.paper },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.notesInput,
                      { color: theme.colors.text.primary },
                    ]}
                    placeholder="Add any details about this symptom..."
                    placeholderTextColor={theme.colors.text.secondary}
                    multiline
                    maxLength={250}
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                    onFocus={() => setActiveInputSection('notes')}
                    inputAccessoryViewID={
                      Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined
                    }
                  />

                  <Text
                    style={[
                      styles.characterCount,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {notes.length}/250
                  </Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Action buttons */}
          <View
            style={[
              styles.modalFooter,
              {
                backgroundColor: theme.colors.background.default,
                borderTopColor: theme.colors.divider,
                paddingBottom: keyboardVisible
                  ? 10
                  : Platform.OS === 'ios'
                  ? 32
                  : 16,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: theme.colors.background.paper,
                  borderColor: theme.colors.divider,
                },
              ]}
              onPress={handleCloseModal}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={handleSave}
            >
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={theme.colors.primary.contrast}
                style={styles.saveButtonIcon}
              />
              <Text
                style={[
                  styles.saveButtonText,
                  { color: theme.colors.primary.contrast },
                ]}
              >
                Log Symptom
              </Text>
            </TouchableOpacity>
          </View>

          {/* iOS Input Accessory */}
          {renderInputAccessory()}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.9,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.18,
        shadowRadius: 7,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 10,
  },
  handle: {
    height: 5,
    borderRadius: 2.5,
    // Width is dynamic based on dragging state
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 28,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 0, 0, 0.08)',
    borderRadius: 8,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Step styles
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

  // Category tabs
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

  // Symptom list
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

  // Severity section
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

  // Bristol scale
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

  // Notes
  notesContainer: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 80,
    maxHeight: 120,
    fontSize: 15,
    textAlignVertical: 'top',
    padding: 0,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },

  // Footer
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardAccessory: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  keyboardAccessoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

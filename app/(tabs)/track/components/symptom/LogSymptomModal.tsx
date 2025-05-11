import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../../context/ThemeContext';
import { BristolScale } from './components/BristolScale';
import { NotesInput } from './components/NotesInput';
import { SeveritySelection } from './components/SeveritySelection';
import { SymptomSelection } from './components/SymptomSelection';
import { INPUT_ACCESSORY_ID } from './constants';
import { LogSymptomModalProps, SymptomType } from './types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const modalScaleAnim = useRef(new Animated.Value(1)).current;

  // Track drag state
  const [isDragging, setIsDragging] = useState(false);

  // Add PanResponder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (_, gestureState) => {
        return gestureState.y0 < 50;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          gestureState.dy > 0
        );
      },
      onPanResponderGrant: () => {
        Keyboard.dismiss();
        setIsDragging(true);
        Animated.spring(modalScaleAnim, {
          toValue: 0.98,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
          const newOpacity = Math.max(
            0,
            1 - gestureState.dy / (SCREEN_HEIGHT * 0.4)
          );
          backdropOpacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }).start();

        if (
          gestureState.dy > 100 ||
          (gestureState.dy > 50 && gestureState.vy > 1)
        ) {
          handleCloseModal();
        } else {
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

  useEffect(() => {
    if (visible) {
      setHasError(false);
      setErrorMessage('');

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

  const validateAndSave = () => {
    if (!selectedSymptom) {
      setHasError(true);
      setErrorMessage('Please select a symptom');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

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

    const newSymptom = {
      type: 'symptom' as const,
      timestamp: new Date(),
      symptom: selectedSymptom!.name,
      severity,
      bristolScore: selectedSymptom!.requiresBristol ? bristolScore : undefined,
      notes: notes.trim() || undefined,
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
              <SymptomSelection
                selectedSymptom={selectedSymptom}
                onSelectSymptom={(symptom) => {
                  setSelectedSymptom(symptom);
                  setHasError(false);
                  setErrorMessage('');
                  if (!symptom.requiresBristol) {
                    setBristolScore(undefined);
                  }
                }}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                hasError={hasError}
              />

              <SeveritySelection
                severity={severity}
                onSeverityChange={setSeverity}
              />

              {selectedSymptom?.requiresBristol && (
                <BristolScale
                  bristolScore={bristolScore}
                  onBristolScoreChange={(score) => {
                    setBristolScore(score);
                    setHasError(false);
                  }}
                  hasError={hasError}
                />
              )}

              <NotesInput
                notes={notes}
                onNotesChange={setNotes}
                stepNumber={selectedSymptom?.requiresBristol ? 4 : 3}
              />
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

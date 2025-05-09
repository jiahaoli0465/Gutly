import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  InputAccessoryView,
  Keyboard,
  LayoutAnimation,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../context/ThemeContext';
import { MealItem } from '../types';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AddMealModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (meal: Omit<MealItem, 'id'>) => void;
};

type PortionSize = 'small' | 'medium' | 'large';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Common food items for quick selection
const COMMON_FOODS = [
  'Eggs',
  'Bread',
  'Chicken',
  'Rice',
  'Pasta',
  'Salmon',
  'Avocado',
  'Yogurt',
  'Oatmeal',
  'Spinach',
  'Banana',
  'Apple',
  'Berries',
  'Sweet Potato',
  'Quinoa',
];

// Input accessory ID for iOS keyboard
const INPUT_ACCESSORY_ID = 'mealInputAccessory';

export const AddMealModal = ({
  visible,
  onClose,
  onSave,
}: AddMealModalProps) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [foodLabels, setFoodLabels] = useState<string[]>([]);
  const [currentLabel, setCurrentLabel] = useState('');
  const [portionSize, setPortionSize] = useState<PortionSize>('medium');
  const [calories, setCalories] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCommonFoodsVisible, setIsCommonFoodsVisible] = useState(false);

  // Track keyboard state
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [activeInputSection, setActiveInputSection] = useState<
    'foods' | 'calories' | null
  >(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track drag state
  const [isDragging, setIsDragging] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(1)).current;

  // References
  const inputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Custom animation config
  const springConfig = {
    tension: 65,
    friction: 7,
    useNativeDriver: true,
  };

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
          ...springConfig,
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
          ...springConfig,
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
              ...springConfig,
            }),
            Animated.spring(backdropOpacity, {
              toValue: 1,
              ...springConfig,
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
            ...springConfig,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            ...springConfig,
          }),
          Animated.spring(backdropOpacity, {
            toValue: 1,
            ...springConfig,
          }),
        ]).start();
      },
    })
  ).current;

  // Track keyboard state
  useEffect(() => {
    // Different event names based on platform
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
      setActiveInputSection(null);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Scroll to input position when keyboard appears
  useEffect(() => {
    if (keyboardVisible && scrollViewRef.current && activeInputSection) {
      // Use layout animation for smoother transitions
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // Slightly different scroll positions based on device size
      const isSmallDevice = SCREEN_HEIGHT < 700;

      // Add a slight delay to ensure layout measurements are accurate
      setTimeout(() => {
        if (activeInputSection === 'foods') {
          scrollViewRef.current?.scrollTo({
            y: isSmallDevice ? 120 : 160,
            animated: true,
          });
        } else if (activeInputSection === 'calories') {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      }, 150);
    }
  }, [keyboardVisible, activeInputSection]);

  // Modal entry/exit animations
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
          ...springConfig,
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
      ]).start();
    }
  }, [visible]);

  const handleAddLabel = useCallback(() => {
    if (currentLabel.trim()) {
      // Check for duplicates
      if (foodLabels.includes(currentLabel.trim())) {
        setHasError(true);
        setErrorMessage('This food item is already added');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      // Add new food with animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFoodLabels([...foodLabels, currentLabel.trim()]);
      setCurrentLabel('');
      setHasError(false);
      setErrorMessage('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentLabel, foodLabels]);

  const handleRemoveLabel = useCallback(
    (index: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFoodLabels(foodLabels.filter((_, i) => i !== index));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [foodLabels]
  );

  const handleCommonFoodSelect = useCallback(
    (food: string) => {
      if (!foodLabels.includes(food)) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFoodLabels([...foodLabels, food]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [foodLabels]
  );

  const toggleCommonFoods = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCommonFoodsVisible(!isCommonFoodsVisible);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isCommonFoodsVisible]);

  const validateAndSave = useCallback(() => {
    // Validate
    if (foodLabels.length === 0) {
      setHasError(true);
      setErrorMessage('Please add at least one food item');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Calories validation (if entered)
    if (calories && (isNaN(Number(calories)) || Number(calories) <= 0)) {
      setHasError(true);
      setErrorMessage('Please enter a valid calorie amount');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  }, [foodLabels, calories]);

  const handleSave = useCallback(() => {
    Keyboard.dismiss();
    if (!validateAndSave()) return;

    const newMeal: Omit<MealItem, 'id'> = {
      type: 'meal',
      timestamp: new Date(),
      photo: 'https://picsum.photos/300/200', // Placeholder for now
      foodLabels,
      calories: calories ? parseInt(calories, 10) : 0,
    };

    onSave(newMeal);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetForm();
    onClose();
  }, [foodLabels, calories, onSave, onClose]);

  const resetForm = useCallback(() => {
    setFoodLabels([]);
    setCurrentLabel('');
    setPortionSize('medium');
    setCalories('');
    setHasError(false);
    setErrorMessage('');
    setIsCommonFoodsVisible(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    Keyboard.dismiss();

    // Animate out
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
    ]).start(() => {
      resetForm();
      onClose();
    });
  }, [onClose, resetForm]);

  // Create transform array that combines scale and translate
  const modalTransform = useMemo(
    () => [{ translateY: slideAnim }, { scale: modalScaleAnim }],
    [slideAnim, modalScaleAnim]
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View
          style={[styles.modalOverlay, { opacity: backdropOpacity }]}
        >
          <BlurView
            intensity={isDark ? 40 : 60}
            tint={isDark ? 'dark' : 'light'}
            style={styles.blurView}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: modalTransform,
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.background.default,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
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

          {/* Modal Header */}
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
              Add Meal
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Scrollable Content Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: keyboardVisible ? 170 + keyboardHeight : 100,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
          >
            {/* Photo Selection */}
            <TouchableOpacity
              style={[
                styles.photoSelector,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <MaterialCommunityIcons
                name="image-plus"
                size={32}
                color={theme.colors.primary.main}
              />
              <Text
                style={[
                  styles.photoSelectorText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Add Food Photo
              </Text>
            </TouchableOpacity>

            {/* Food Items Section */}
            <View style={styles.sectionContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Food Items
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.background.paper,
                      color: theme.colors.text.primary,
                      borderColor: hasError
                        ? theme.colors.error.main
                        : theme.colors.divider,
                    },
                  ]}
                  placeholder="Add food items..."
                  placeholderTextColor={theme.colors.text.secondary}
                  value={currentLabel}
                  onChangeText={(text) => {
                    setCurrentLabel(text);
                    setHasError(false);
                    setErrorMessage('');
                  }}
                  onSubmitEditing={handleAddLabel}
                  returnKeyType="done"
                  autoCapitalize="words"
                  onFocus={() => setActiveInputSection('foods')}
                  inputAccessoryViewID={
                    Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.primary.main },
                  ]}
                  onPress={handleAddLabel}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color={theme.colors.primary.contrast}
                  />
                </TouchableOpacity>
              </View>

              {/* Error message */}
              {hasError && (
                <Text
                  style={[styles.errorText, { color: theme.colors.error.main }]}
                >
                  {errorMessage}
                </Text>
              )}

              {/* Quick Add Common Foods */}
              <TouchableOpacity
                style={[
                  styles.commonFoodsButton,
                  { borderColor: theme.colors.divider },
                ]}
                onPress={toggleCommonFoods}
              >
                <Text
                  style={[
                    styles.commonFoodsText,
                    { color: theme.colors.primary.main },
                  ]}
                >
                  {isCommonFoodsVisible
                    ? 'Hide Common Foods'
                    : 'Show Common Foods'}
                </Text>
                <MaterialCommunityIcons
                  name={isCommonFoodsVisible ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={theme.colors.primary.main}
                />
              </TouchableOpacity>

              {/* Common Foods List */}
              {isCommonFoodsVisible && (
                <View style={styles.commonFoodsContainer}>
                  <FlatList
                    data={COMMON_FOODS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.commonFoodItem,
                          {
                            backgroundColor: foodLabels.includes(item)
                              ? `${theme.colors.primary.main}20`
                              : theme.colors.background.paper,
                            borderColor: foodLabels.includes(item)
                              ? theme.colors.primary.main
                              : theme.colors.divider,
                          },
                        ]}
                        onPress={() => handleCommonFoodSelect(item)}
                      >
                        <Text
                          style={[
                            styles.commonFoodText,
                            {
                              color: foodLabels.includes(item)
                                ? theme.colors.primary.main
                                : theme.colors.text.primary,
                            },
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {/* Selected Foods */}
              {foodLabels.length > 0 && (
                <View style={styles.selectedFoodsContainer}>
                  {foodLabels.map((label, index) => (
                    <View
                      key={index}
                      style={[
                        styles.foodLabel,
                        {
                          backgroundColor: theme.colors.primary.light + '20',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.foodLabelText,
                          { color: theme.colors.primary.main },
                        ]}
                      >
                        {label}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeFoodButton}
                        onPress={() => handleRemoveLabel(index)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={16}
                          color={theme.colors.primary.main}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Portion Size Section */}
            <View style={styles.sectionContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Portion Size
              </Text>

              <View style={styles.portionSizeContainer}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.portionSizeButton,
                      {
                        backgroundColor:
                          portionSize === size
                            ? theme.colors.primary.main
                            : theme.colors.background.paper,
                        borderColor: theme.colors.divider,
                      },
                    ]}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut
                      );
                      setPortionSize(size);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        size === 'small'
                          ? 'circle-outline'
                          : size === 'medium'
                          ? 'circle'
                          : 'circle-double'
                      }
                      size={20}
                      color={
                        portionSize === size
                          ? theme.colors.primary.contrast
                          : theme.colors.text.secondary
                      }
                      style={styles.portionIcon}
                    />
                    <Text
                      style={[
                        styles.portionSizeText,
                        {
                          color:
                            portionSize === size
                              ? theme.colors.primary.contrast
                              : theme.colors.text.primary,
                        },
                      ]}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Calories Section */}
            <View style={styles.sectionContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Calories
              </Text>

              <View style={styles.caloriesRow}>
                <TextInput
                  ref={caloriesInputRef}
                  style={[
                    styles.caloriesInput,
                    {
                      backgroundColor: theme.colors.background.paper,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="Enter calories (optional)"
                  placeholderTextColor={theme.colors.text.secondary}
                  keyboardType="numeric"
                  value={calories}
                  onChangeText={(text) => {
                    // Only allow numbers
                    if (text === '' || /^\d+$/.test(text)) {
                      setCalories(text);
                      setHasError(false);
                    }
                  }}
                  onFocus={() => setActiveInputSection('calories')}
                  inputAccessoryViewID={
                    Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined
                  }
                />

                {/* Quick calorie presets */}
                <View style={styles.caloriePresets}>
                  {[100, 250, 500].map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        styles.caloriePresetButton,
                        {
                          backgroundColor: theme.colors.background.paper,
                          borderColor: theme.colors.divider,
                        },
                      ]}
                      onPress={() => {
                        setCalories(preset.toString());
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Text
                        style={[
                          styles.caloriePresetText,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        {preset}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <Animated.View
            style={[
              styles.modalFooter,
              {
                backgroundColor: theme.colors.background.default,
                borderTopColor: theme.colors.divider,
                paddingBottom: keyboardVisible ? 10 : insets.bottom || 16,
              },
            ]}
          >
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
                Save Meal
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      {/* iOS Input Accessory */}
      {renderInputAccessory()}
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
    height: SCREEN_HEIGHT * 0.9,
    overflow: 'hidden',
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
    paddingTop: 8,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  photoSelector: {
    height: 120,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  photoSelectorText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginRight: 8,
    fontSize: 15,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  commonFoodsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  commonFoodsText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  commonFoodsContainer: {
    marginTop: 12,
    marginBottom: 4,
    height: 44, // Increased height for better touch targets
  },
  commonFoodItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  commonFoodText: {
    fontSize: 13,
    fontWeight: '500',
  },
  selectedFoodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  foodLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  foodLabelText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
  removeFoodButton: {
    padding: 2,
  },
  portionSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portionSizeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  portionIcon: {
    marginRight: 6,
  },
  portionSizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  caloriesRow: {
    marginBottom: 8,
  },
  caloriesInput: {
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  caloriePresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caloriePresetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    flex: 1,
  },
  caloriePresetText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 100,
  },
  saveButton: {
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

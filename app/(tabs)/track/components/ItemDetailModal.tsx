import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { MealItem, SymptomItem, TimelineItem } from '../types';

type ItemDetailModalProps = {
  visible: boolean;
  item: TimelineItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Bristol scale descriptions
const BRISTOL_DESCRIPTIONS = [
  {
    score: 1,
    description: 'Hard lumps',
    color: '#8B4513',
    details: 'Separate hard lumps, like nuts (hard to pass)',
  },
  {
    score: 2,
    description: 'Lumpy sausage',
    color: '#A0522D',
    details: 'Sausage-shaped, but lumpy',
  },
  {
    score: 3,
    description: 'Cracked sausage',
    color: '#CD853F',
    details: 'Like a sausage but with cracks on its surface',
  },
  {
    score: 4,
    description: 'Smooth, soft sausage',
    color: '#D2B48C',
    details: 'Like a sausage or snake, smooth and soft',
  },
  {
    score: 5,
    description: 'Soft blobs',
    color: '#DEB887',
    details: 'Soft blobs with clear cut edges (passed easily)',
  },
  {
    score: 6,
    description: 'Fluffy pieces',
    color: '#F5DEB3',
    details: 'Fluffy pieces with ragged edges, a mushy stool',
  },
  {
    score: 7,
    description: 'Watery',
    color: '#F5F5DC',
    details: 'Watery, no solid pieces, entirely liquid',
  },
];

export const ItemDetailModal = ({
  visible,
  item,
  onClose,
  onDelete,
}: ItemDetailModalProps) => {
  const { theme, isDark } = useTheme();

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
          tension: 65,
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
      ]).start();
    }
  }, [visible]);

  if (!item) return null;

  const formattedDate = item.timestamp.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = item.timestamp.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const getSeverityColor = (severity: number) => {
    switch (severity) {
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

  const getBristolInfo = (score?: number) => {
    if (!score) return null;
    return BRISTOL_DESCRIPTIONS.find((item) => item.score === score);
  };

  const renderMealDetail = (meal: MealItem) => (
    <>
      <View style={styles.detailHeader}>
        <View
          style={[
            styles.detailIconContainer,
            { backgroundColor: `${theme.colors.primary.main}15` },
          ]}
        >
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={24}
            color={theme.colors.primary.main}
          />
        </View>
        <View style={styles.detailTitleContainer}>
          <Text
            style={[styles.detailTitle, { color: theme.colors.text.primary }]}
          >
            Meal
          </Text>
          <Text
            style={[
              styles.detailSubtitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            {formattedDate} at {formattedTime}
          </Text>
        </View>
      </View>

      {meal.photo && (
        <View style={styles.mealPhotoContainer}>
          <Image
            source={{ uri: meal.photo }}
            style={styles.mealPhoto}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.detailSection}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Food Items
        </Text>
        <View style={styles.foodLabelsContainer}>
          {meal.foodLabels.map((label, index) => (
            <View
              key={index}
              style={[
                styles.foodLabelChip,
                { backgroundColor: `${theme.colors.primary.light}15` },
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
            </View>
          ))}
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Nutritional Information
        </Text>
        <View
          style={[
            styles.nutritionCard,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <View style={styles.nutritionItem}>
            <Text
              style={[
                styles.nutritionLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Calories
            </Text>
            <Text
              style={[
                styles.nutritionValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {meal.calories}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.divider }]}
          />

          <View style={styles.calorieBreakdownContainer}>
            <View style={styles.calorieBreakdownItem}>
              <Text
                style={[
                  styles.calorieLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Estimated from
              </Text>
              <Text
                style={[
                  styles.calorieValue,
                  { color: theme.colors.text.primary },
                ]}
              >
                {meal.foodLabels.length} items
              </Text>
            </View>

            <View style={styles.calorieBreakdownItem}>
              <Text
                style={[
                  styles.calorieLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Per 100g
              </Text>
              <Text
                style={[
                  styles.calorieValue,
                  { color: theme.colors.text.primary },
                ]}
              >
                {Math.round(
                  (meal.calories / (meal.foodLabels.length || 1)) * 0.8
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  const renderSymptomDetail = (symptom: SymptomItem) => {
    const bristolInfo = getBristolInfo(symptom.bristolScore);

    return (
      <>
        <View style={styles.detailHeader}>
          <View
            style={[
              styles.detailIconContainer,
              { backgroundColor: `${getSeverityColor(symptom.severity)}15` },
            ]}
          >
            <MaterialCommunityIcons
              name={
                symptom.symptom === 'Bloating'
                  ? 'stomach'
                  : 'alert-circle-outline'
              }
              size={24}
              color={getSeverityColor(symptom.severity)}
            />
          </View>
          <View style={styles.detailTitleContainer}>
            <Text
              style={[styles.detailTitle, { color: theme.colors.text.primary }]}
            >
              {symptom.symptom}
            </Text>
            <Text
              style={[
                styles.detailSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {formattedDate} at {formattedTime}
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Severity Details
          </Text>
          <View
            style={[
              styles.severityCard,
              { backgroundColor: theme.colors.background.paper },
            ]}
          >
            <View style={styles.severityHeader}>
              <Text
                style={[
                  styles.severityHeaderText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {getSeverityText(symptom.severity)} ({symptom.severity}/5)
              </Text>
              <View
                style={[
                  styles.severityBadge,
                  {
                    backgroundColor: `${getSeverityColor(symptom.severity)}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.severityBadgeText,
                    { color: getSeverityColor(symptom.severity) },
                  ]}
                >
                  {symptom.severity}/5
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.divider },
              ]}
            />

            <View style={styles.severityBarContainer}>
              {[1, 2, 3, 4, 5].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.severityBarSegment,
                    {
                      backgroundColor:
                        level <= symptom.severity
                          ? getSeverityColor(symptom.severity)
                          : isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.05)',
                      opacity:
                        level <= symptom.severity ? 0.6 + level * 0.08 : 0.3,
                      height: 5 + (level <= symptom.severity ? level * 3 : 0),
                    },
                  ]}
                />
              ))}
            </View>

            <Text
              style={[
                styles.severityDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              {symptom.severity <= 2
                ? "Mild to moderate symptoms that are manageable and don't significantly impact daily activities."
                : symptom.severity <= 4
                ? 'Significant discomfort that may interfere with daily activities and sleep.'
                : 'Extreme discomfort that significantly impacts quality of life and daily functioning.'}
            </Text>
          </View>
        </View>

        {symptom.bristolScore && bristolInfo && (
          <View style={styles.detailSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Bristol Stool Scale
            </Text>
            <View
              style={[
                styles.bristolCard,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <View style={styles.bristolHeader}>
                <View
                  style={[
                    styles.bristolBadge,
                    { backgroundColor: bristolInfo.color },
                  ]}
                >
                  <Text style={styles.bristolBadgeText}>
                    {symptom.bristolScore}
                  </Text>
                </View>

                <View style={styles.bristolTitleContainer}>
                  <Text
                    style={[
                      styles.bristolTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Type {symptom.bristolScore}: {bristolInfo.description}
                  </Text>
                  <Text
                    style={[
                      styles.bristolSubtitle,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {bristolInfo.details}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.divider },
                ]}
              />

              <Text
                style={[
                  styles.bristolDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {symptom.bristolScore <= 2
                  ? 'Types 1-2 indicate constipation.'
                  : symptom.bristolScore <= 5
                  ? 'Types 3-5 are considered normal stools.'
                  : 'Types 6-7 indicate diarrhea.'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.detailSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Potential Triggers
          </Text>
          <View
            style={[
              styles.triggersCard,
              { backgroundColor: theme.colors.background.paper },
            ]}
          >
            <Text
              style={[
                styles.triggerText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Based on your entries, potential triggers for{' '}
              {symptom.symptom.toLowerCase()} may include:
            </Text>

            <View style={styles.triggerList}>
              <View style={styles.triggerItem}>
                <MaterialCommunityIcons
                  name="food-apple"
                  size={16}
                  color={theme.colors.warning.main}
                  style={styles.triggerIcon}
                />
                <Text
                  style={[
                    styles.triggerItemText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Dairy products
                </Text>
              </View>

              <View style={styles.triggerItem}>
                <MaterialCommunityIcons
                  name="coffee"
                  size={16}
                  color={theme.colors.warning.main}
                  style={styles.triggerIcon}
                />
                <Text
                  style={[
                    styles.triggerItemText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Caffeine
                </Text>
              </View>

              <View style={styles.triggerItem}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={16}
                  color={theme.colors.warning.main}
                  style={styles.triggerIcon}
                />
                <Text
                  style={[
                    styles.triggerItemText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Stress
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}
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
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.default },
          ]}
        >
          {/* Drag handle */}
          <View style={styles.handleContainer}>
            <View
              style={[styles.handle, { backgroundColor: theme.colors.divider }]}
            />
          </View>

          {/* Close button */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)',
              },
            ]}
            onPress={() => {
              onClose();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          {/* Scrollable content */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {item.type === 'meal'
              ? renderMealDetail(item as MealItem)
              : renderSymptomDetail(item as SymptomItem)}

            <View style={styles.actionButtonsContainer}>
              {item.type === 'meal' ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onClose();
                    }}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={theme.colors.text.primary}
                      style={styles.actionButtonIcon}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      Edit Meal
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: `${theme.colors.error.main}15` },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      if (item.id) {
                        onDelete(item.id);
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={18}
                      color={theme.colors.error.main}
                      style={styles.actionButtonIcon}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: theme.colors.error.main },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onClose();
                    }}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={theme.colors.text.primary}
                      style={styles.actionButtonIcon}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      Edit Symptom
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: `${theme.colors.error.main}15` },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      if (item.id) {
                        onDelete(item.id);
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={18}
                      color={theme.colors.error.main}
                      style={styles.actionButtonIcon}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: theme.colors.error.main },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
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
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },

  // Detail Header
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailTitleContainer: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: 14,
  },

  // Meal Photo
  mealPhotoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    height: 180,
  },
  mealPhoto: {
    width: '100%',
    height: '100%',
  },

  // Sections
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  // Food Labels
  foodLabelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  foodLabelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  foodLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Nutrition Card
  nutritionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  nutritionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  calorieBreakdownContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  calorieBreakdownItem: {
    flex: 1,
  },
  calorieLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Severity Card
  severityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  severityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  severityHeaderText: {
    fontSize: 16,
    fontWeight: '600',
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
  severityBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  severityBarSegment: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  severityDescription: {
    padding: 16,
    paddingTop: 0,
    fontSize: 14,
    lineHeight: 20,
  },

  // Bristol Card
  bristolCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bristolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bristolBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bristolBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  bristolTitleContainer: {
    flex: 1,
  },
  bristolTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  bristolSubtitle: {
    fontSize: 13,
  },
  bristolDescription: {
    padding: 16,
    paddingTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },

  // Triggers Card
  triggersCard: {
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  triggerText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  triggerList: {
    marginTop: 8,
  },
  triggerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  triggerIcon: {
    marginRight: 10,
  },
  triggerItemText: {
    fontSize: 15,
    fontWeight: '500',
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 50,
  },
});

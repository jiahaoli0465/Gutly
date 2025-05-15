import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DailyProgress from '../../components/DailyProgress';
import QuickActionFAB from '../../components/QuickActionFAB';
import SmartRecommendations from '../../components/SmartRecommendations';
import StatCard from '../../components/StatCard';
import { useTheme } from '../../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

interface User {
  name: string;
  email: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    reminders: boolean;
  };
}

interface Symptom {
  id: number;
  symptom: string;
  severity: string;
  time: string;
  icon: IconName;
  notes: string;
}

interface FoodInsight {
  id: number;
  food: string;
  impact: 'Positive' | 'Negative';
  confidence: 'High' | 'Medium' | 'Low';
  icon: IconName;
  details: string;
  correlation: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  icon: IconName;
  priority: 'high' | 'medium' | 'low';
  action: string;
  reasoning: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  rating: number;
  price: string;
  image: string;
  benefits: string[];
  aiMatch: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const HomePage = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [modal, setModal] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User>({
    name: 'Jiahao',
    email: 'jiahao@example.com',
    preferences: {
      notifications: true,
      darkMode: isDark,
      reminders: true,
    },
  });

  const quickActions = [
    {
      label: 'Log Meal',
      icon: 'restaurant-outline' as IconName,
      onPress: () => {
        router.navigate('/track?add=1');
      },
    },
    {
      label: 'Track Symptoms',
      icon: 'medkit-outline' as IconName,
      onPress: () => setModal('Track Symptoms'),
    },
    {
      label: 'View Insights',
      icon: 'bar-chart-outline' as IconName,
      onPress: () => setModal('View Insights'),
    },
    {
      label: 'Expert Chat',
      icon: 'chatbubbles-outline' as IconName,
      onPress: () => setModal('Expert Chat'),
    },
  ];

  const mockData = {
    recentSymptoms: [
      {
        id: 1,
        symptom: 'Post-Lunch Bloating',
        severity: 'Moderate',
        time: 'Yesterday, 2 PM',
        icon: 'restaurant-outline' as IconName,
        notes: 'Occurred after consuming dairy-based lunch',
      },
      {
        id: 2,
        symptom: 'Morning Stomach Cramps',
        severity: 'Mild',
        time: 'Today, 8 AM',
        icon: 'cafe-outline' as IconName,
        notes: 'Started after breakfast smoothie with apple',
      },
      {
        id: 3,
        symptom: 'Evening Gas & Discomfort',
        severity: 'Moderate',
        time: 'Yesterday, 9 PM',
        icon: 'bed-outline' as IconName,
        notes: 'Followed late dinner with processed foods',
      },
      {
        id: 4,
        symptom: 'Low Energy Dip',
        severity: 'Mild',
        time: 'Today, 3 PM',
        icon: 'battery-half-outline' as IconName,
        notes: 'Coincided with missed lunch and high-sugar snack',
      },
    ] as Symptom[],

    foodInsights: [
      {
        id: 1,
        food: 'Lactose Sensitivity Detected',
        impact: 'Negative',
        confidence: 'High',
        icon: 'alert-circle' as IconName,
        details:
          'Bloating and gas reported on 4 of last 5 days with dairy consumption. Consider trial elimination or lactase supplements.',
        correlation: 'Strong correlation with post-meal bloating',
      },
      {
        id: 2,
        food: 'High FODMAP Fruits Pattern',
        impact: 'Negative',
        confidence: 'Medium',
        icon: 'nutrition' as IconName,
        details:
          'Apples and pears consumption linked to increased bloating. These are high in FODMAPs which can trigger IBS symptoms.',
        correlation: 'Moderate correlation with morning symptoms',
      },
      {
        id: 3,
        food: 'Fermented Foods Impact',
        impact: 'Positive',
        confidence: 'High',
        icon: 'leaf' as IconName,
        details:
          'Days with kimchi or kefir show 60% reduction in bloating reports. These foods support gut microbiome diversity.',
        correlation: 'Strong positive correlation with overall gut comfort',
      },
      {
        id: 4,
        food: 'Soluble Fiber Benefits',
        impact: 'Positive',
        confidence: 'Medium',
        icon: 'analytics' as IconName,
        details:
          'Oatmeal breakfasts associated with better digestion scores. Soluble fiber helps regulate gut motility.',
        correlation: 'Moderate correlation with reduced bloating',
      },
    ] as FoodInsight[],

    dailyProgress: {
      waterIntake: 6,
      waterGoal: 10,
      fiberIntake: 20,
      fiberGoal: 30,
      probioticFoods: 2,
      probioticGoal: 3,
      mealsLogged: 2,
      mealsGoal: 3,
    },

    smartRecommendations: [
      {
        id: 1,
        title: 'Gut-Friendly Breakfast Swap',
        description:
          "Based on your recent bloating after dairy smoothies, try this overnight oats recipe with berries and chia seeds. It's lower in FODMAPs and provides soluble fiber for better digestion.",
        icon: 'swap-horizontal' as IconName,
        priority: 'high',
        action: 'View Recipe',
        reasoning:
          'AI detected pattern of morning symptoms after high-FODMAP breakfasts',
      },
      {
        id: 2,
        title: 'Hydration Boost for Fiber',
        description:
          "You're increasing your fiber intake, which is great! Remember to drink 2 more glasses of water today to help with digestion and prevent constipation. Your current fiber-to-water ratio suggests you need more hydration.",
        icon: 'water' as IconName,
        priority: 'medium',
        action: 'Set Reminder',
        reasoning:
          'AI calculated optimal water intake based on fiber consumption',
      },
      {
        id: 3,
        title: 'Explore Prebiotic Foods',
        description:
          'To support your microbiome diversity, try adding prebiotic-rich foods like garlic, onions, or asparagus (in moderation) to your meals this week. These feed your beneficial gut bacteria and may help reduce bloating.',
        icon: 'nutrition' as IconName,
        priority: 'medium',
        action: 'View Food List',
        reasoning:
          'AI identified opportunity to improve gut microbiome diversity',
      },
      {
        id: 4,
        title: 'Mindful Meal Pacing',
        description:
          'We noticed your gas reports often occur after quickly consumed meals. Try setting aside 20 minutes for your next meal, focusing on thorough chewing. This can significantly reduce digestive discomfort.',
        icon: 'timer' as IconName,
        priority: 'low',
        action: 'Start Timer',
        reasoning: 'AI detected correlation between eating speed and symptoms',
      },
    ] as Recommendation[],

    productSuggestions: [
      {
        id: 1,
        name: 'Lactase Enzyme Supplement',
        brand: 'DigestWell',
        rating: 4.7,
        price: '$15.99',
        image: 'https://placeholder.com/lactase',
        benefits: [
          'Helps digest lactose from dairy products',
          'Reduces bloating and gas from dairy consumption',
          'Take 15 minutes before dairy meals',
          'Clinically proven to reduce lactose intolerance symptoms',
        ],
        aiMatch: 'Recommended based on your dairy sensitivity pattern',
      },
      {
        id: 2,
        name: 'High-Potency Multi-Strain Probiotic',
        brand: 'GutRenew',
        rating: 4.9,
        price: '$39.99',
        image: 'https://placeholder.com/probiotic',
        benefits: [
          'Contains 15 clinically studied probiotic strains',
          'Specifically formulated for IBS and bloating relief',
          'Supports gut microbiome diversity',
          'Delayed-release capsules for optimal delivery',
        ],
        aiMatch: 'Suggested to support your gut microbiome diversity goals',
      },
    ] as Product[],
  };

  const handleViewRecommendation = (recommendation: Recommendation) => {
    // TODO: Implement recommendation details view
    console.log('View recommendation:', recommendation);
  };

  const handleDismissRecommendation = (id: number) => {
    // TODO: Implement recommendation dismissal
    console.log('Dismiss recommendation:', id);
  };

  const handleTogglePreference = (key: keyof User['preferences']) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key],
      },
    }));

    if (key === 'darkMode') {
      toggleTheme();
    }
  };

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log('Signing out...');
    setModal(null);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text
              style={[styles.greeting, { color: theme.colors.text.primary }]}
            >
              Good {getGreeting()}
            </Text>
            <Text
              style={[styles.name, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {user?.name || 'User'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.profileButton,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Gut Score"
            value="85"
            icon="analytics"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Diet Score"
            value="92"
            icon="nutrition"
            trend={{ value: 2, isPositive: true }}
          />
        </View>

        <SmartRecommendations
          recommendations={mockData.smartRecommendations}
          onViewDetails={handleViewRecommendation}
          onDismiss={handleDismissRecommendation}
        />

        <DailyProgress progress={mockData.dailyProgress} />

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Recent Symptoms
          </Text>
          <View style={styles.symptomsContainer}>
            {mockData.recentSymptoms.map((symptom) => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomCard,
                  { backgroundColor: theme.colors.background.paper },
                  theme.shadows.sm,
                ]}
              >
                <Ionicons
                  name={symptom.icon}
                  size={24}
                  color={theme.colors.primary.main}
                />
                <View style={styles.symptomInfo}>
                  <Text
                    style={[
                      styles.symptomName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {symptom.symptom}
                  </Text>
                  <Text
                    style={[
                      styles.symptomDetail,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {symptom.severity} • {symptom.time}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Food Insights
          </Text>
          <View style={styles.insightsContainer}>
            {mockData.foodInsights.map((insight) => (
              <View
                key={insight.id}
                style={[
                  styles.insightCard,
                  { backgroundColor: theme.colors.background.paper },
                  theme.shadows.sm,
                ]}
              >
                <Ionicons
                  name={insight.icon}
                  size={24}
                  color={
                    insight.impact === 'Positive'
                      ? theme.colors.success.main
                      : theme.colors.error.main
                  }
                />
                <View style={styles.insightInfo}>
                  <Text
                    style={[
                      styles.insightFood,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {insight.food}
                  </Text>
                  <Text
                    style={[
                      styles.insightImpact,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {insight.impact} Impact • {insight.confidence} Confidence
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Recommended Products
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productsScroll}
          >
            {mockData.productSuggestions.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  { backgroundColor: theme.colors.background.paper },
                  theme.shadows.sm,
                ]}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <Text
                    style={[
                      styles.productBrand,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {product.brand}
                  </Text>
                  <Text
                    style={[
                      styles.productName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {product.name}
                  </Text>
                  <View style={styles.productRating}>
                    <Ionicons
                      name="star"
                      size={16}
                      color={theme.colors.warning.main}
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      {product.rating}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.productPrice,
                      { color: theme.colors.primary.main },
                    ]}
                  >
                    {product.price}
                  </Text>
                  <View style={styles.benefitsContainer}>
                    {product.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={theme.colors.success.main}
                        />
                        <Text
                          style={[
                            styles.benefitText,
                            { color: theme.colors.text.secondary },
                          ]}
                        >
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <QuickActionFAB actions={quickActions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  recommendationsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  recommendationCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendationContent: {
    padding: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
  },
  preferencesSection: {
    marginBottom: 32,
  },
  preferencesList: {
    gap: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  symptomsContainer: {
    gap: 12,
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  symptomDetail: {
    fontSize: 14,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightFood: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightImpact: {
    fontSize: 14,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  productsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  productCard: {
    width: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 16,
  },
  productBrand: {
    fontSize: 14,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
});

export default HomePage;

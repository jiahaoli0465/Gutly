import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DailyProgress from '../../components/DailyProgress';
import FoodInsights from '../../components/FoodInsights';
import QuickActionFAB from '../../components/QuickActionFAB';
import RecentSymptoms from '../../components/RecentSymptoms';
import RecommendedProducts from '../../components/RecommendedProducts';
import SmartRecommendations from '../../components/SmartRecommendations';
import StatCard from '../../components/StatCard';
import { useTheme } from '../../context/ThemeContext';

// Import product images
const biomeBalanceImage = require('../../assets/images/biomebalance.png');
const biomeDigestImage = require('../../assets/images/biomedigest.png');
const biomeCalmImage = require('../../assets/images/biomecalm.png');
const biomeBoostImage = require('../../assets/images/biomeboost.png');

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
  image: any; // Changed from string to any to support require()
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
        name: 'BiomeBalance™ Personalized Probiotic',
        brand: 'Biome',
        rating: 4.9,
        price: '$49.99',
        image: biomeBalanceImage,
        benefits: [
          'AI-matched strains based on your gut analysis',
          'Personalized 50B CFU count for optimal results',
          'Smart-release technology for better absorption',
          'Real-time effectiveness tracking in app',
        ],
        aiMatch:
          'Recommended based on your gut microbiome diversity score (65/100) and recent bloating patterns. Our AI detected optimal strain combinations for your specific gut environment.',
      },
      {
        id: 2,
        name: 'BiomeDigest™ Enzyme Complex',
        brand: 'Biome',
        rating: 4.8,
        price: '$39.99',
        image: biomeDigestImage,
        benefits: [
          'Custom enzyme blend for your food sensitivities',
          'Smart-dosing adapts to your meal size',
          'Enhanced for your specific dietary patterns',
          'Track effectiveness in real-time via app',
        ],
        aiMatch:
          'AI analysis of your food logs and symptom patterns shows 87% correlation between dairy consumption and digestive discomfort. This formulation is specifically calibrated to your sensitivity levels.',
      },
      {
        id: 3,
        name: 'BiomeCalm™ Gut Support',
        brand: 'Biome',
        rating: 4.9,
        price: '$44.99',
        image: biomeCalmImage,
        benefits: [
          'Personalized for your stress-symptom patterns',
          'Smart-dosing aligned with your daily routine',
          'Gut-brain axis support formula',
          'Track stress-symptom correlation in app',
        ],
        aiMatch:
          'Our AI detected a 72% correlation between your stress levels and digestive symptoms. This formulation is optimized for your specific stress-symptom patterns and daily schedule.',
      },
      {
        id: 4,
        name: 'BiomeBoost™ Prebiotic Fiber',
        brand: 'Biome',
        rating: 4.7,
        price: '$34.99',
        image: biomeBoostImage,
        benefits: [
          'Personalized fiber blend for your microbiome',
          'Adaptive dosing based on daily intake',
          'Targeted prebiotics for your gut bacteria',
          'Track gut health impact in real-time',
        ],
        aiMatch:
          'Based on your current fiber intake (20g/day) and gut microbiome analysis, this formulation is designed to bridge your fiber gap while supporting your specific beneficial bacteria.',
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

  const handleProductPress = (product: Product) => {
    // TODO: Implement product details view
    console.log('View product:', product);
  };

  const handleInsightPress = (insight: FoodInsight) => {
    // TODO: Implement insight details view
    console.log('View insight:', insight);
  };

  const handleSymptomPress = (symptom: Symptom) => {
    // TODO: Implement symptom details view
    console.log('View symptom:', symptom);
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

        <RecentSymptoms
          symptoms={mockData.recentSymptoms}
          onSymptomPress={handleSymptomPress}
        />

        <FoodInsights
          insights={mockData.foodInsights}
          onInsightPress={handleInsightPress}
        />

        <RecommendedProducts
          products={mockData.productSuggestions}
          onProductPress={handleProductPress}
        />
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
});

export default HomePage;

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickActionFAB from '../../components/QuickActionFAB';
import StatCard from '../../components/StatCard';
import { useTheme } from '../../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

interface Symptom {
  id: number;
  symptom: string;
  severity: string;
  time: string;
  icon: IconName;
}

interface FoodInsight {
  id: number;
  food: string;
  impact: 'Positive' | 'Negative';
  confidence: 'High' | 'Medium' | 'Low';
  icon: IconName;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  icon: IconName;
  priority: 'high' | 'medium' | 'low';
}

interface Product {
  id: number;
  name: string;
  brand: string;
  rating: number;
  price: string;
  image: string;
  benefits: string[];
}

export default function HomePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [modal, setModal] = useState<string | null>(null);

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
        symptom: 'Bloating',
        severity: 'Mild',
        time: '2h ago',
        icon: 'water-outline' as IconName,
      },
      {
        id: 2,
        symptom: 'Abdominal Pain',
        severity: 'Moderate',
        time: '5h ago',
        icon: 'alert-circle-outline' as IconName,
      },
      {
        id: 3,
        symptom: 'Gas',
        severity: 'Mild',
        time: '8h ago',
        icon: 'cloud-outline' as IconName,
      },
    ] as Symptom[],

    foodInsights: [
      {
        id: 1,
        food: 'Dairy Products',
        impact: 'Negative',
        confidence: 'High',
        icon: 'nutrition-outline' as IconName,
      },
      {
        id: 2,
        food: 'Leafy Greens',
        impact: 'Positive',
        confidence: 'High',
        icon: 'leaf-outline' as IconName,
      },
      {
        id: 3,
        food: 'Processed Foods',
        impact: 'Negative',
        confidence: 'Medium',
        icon: 'fast-food-outline' as IconName,
      },
    ] as FoodInsight[],

    dailyProgress: {
      waterIntake: 6,
      waterGoal: 8,
      fiberIntake: 18,
      fiberGoal: 25,
      probioticFoods: 2,
      probioticGoal: 3,
    },

    smartRecommendations: [
      {
        id: 1,
        title: 'Try Fermented Foods',
        description:
          'Add kimchi or sauerkraut to your next meal for gut-friendly bacteria',
        icon: 'restaurant-outline' as IconName,
        priority: 'high',
      },
      {
        id: 2,
        title: 'Stay Hydrated',
        description: 'Drink 2 more glasses of water today to support digestion',
        icon: 'water-outline' as IconName,
        priority: 'medium',
      },
      {
        id: 3,
        title: 'Avoid Late Night Snacks',
        description: 'Your last meal was too close to bedtime',
        icon: 'moon-outline' as IconName,
        priority: 'low',
      },
    ] as Recommendation[],

    productSuggestions: [
      {
        id: 1,
        name: 'Gut Health Probiotic',
        brand: 'BioBalance',
        rating: 4.8,
        price: '$29.99',
        image: 'https://placeholder.com/probiotic',
        benefits: [
          'Supports gut flora',
          'Reduces bloating',
          'Improves digestion',
        ],
      },
      {
        id: 2,
        name: 'Digestive Enzyme Complex',
        brand: 'EnzymePro',
        rating: 4.6,
        price: '$24.99',
        image: 'https://placeholder.com/enzyme',
        benefits: [
          'Aids food breakdown',
          'Reduces discomfort',
          'Natural formula',
        ],
      },
    ] as Product[],
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View>
            <Text
              style={[styles.greeting, { color: theme.colors.text.secondary }]}
            >
              Good morning,
            </Text>
            <Text style={[styles.name, { color: theme.colors.text.primary }]}>
              Jiahao
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={[theme.colors.primary.main, theme.colors.primary.light]}
              style={styles.profileGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name="person"
                size={24}
                color={theme.colors.primary.contrast}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Gut Score"
            value="85"
            icon="analytics"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Diet Score"
            value="78"
            icon="nutrition"
            trend={{ value: 5, isPositive: true }}
          />
        </View>

        <View style={styles.recommendationsContainer}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Today's Recommendations
          </Text>
          <View
            style={[
              styles.recommendationCard,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
          >
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Ionicons
                  name="bulb"
                  size={24}
                  color={theme.colors.primary.main}
                />
                <Text
                  style={[
                    styles.recommendationTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Increase Fiber Intake
                </Text>
              </View>
              <Text
                style={[
                  styles.recommendationText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Your gut microbiome would benefit from more fiber-rich foods.
                Try adding more fruits, vegetables, and whole grains to your
                diet.
              </Text>
            </View>
          </View>
        </View>

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
            Daily Progress
          </Text>
          <View
            style={[
              styles.progressCard,
              { backgroundColor: theme.colors.background.paper },
              theme.shadows.sm,
            ]}
          >
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Ionicons
                  name="water-outline"
                  size={20}
                  color={theme.colors.primary.main}
                />
                <Text
                  style={[
                    styles.progressLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Water Intake
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (mockData.dailyProgress.waterIntake /
                          mockData.dailyProgress.waterGoal) *
                        100
                      }%`,
                      backgroundColor: theme.colors.primary.main,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.progressText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {mockData.dailyProgress.waterIntake}/
                {mockData.dailyProgress.waterGoal} glasses
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Smart Recommendations
          </Text>
          {mockData.smartRecommendations.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={[
                styles.recommendationCard,
                { backgroundColor: theme.colors.background.paper },
                theme.shadows.sm,
              ]}
            >
              <View style={styles.recommendationContent}>
                <View style={styles.recommendationHeader}>
                  <Ionicons
                    name={rec.icon}
                    size={24}
                    color={theme.colors.primary.main}
                  />
                  <View style={styles.recommendationTitleContainer}>
                    <Text
                      style={[
                        styles.recommendationTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {rec.title}
                    </Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            rec.priority === 'high'
                              ? theme.colors.error.light
                              : rec.priority === 'medium'
                              ? theme.colors.warning.light
                              : theme.colors.success.light,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          {
                            color:
                              rec.priority === 'high'
                                ? theme.colors.error.main
                                : rec.priority === 'medium'
                                ? theme.colors.warning.main
                                : theme.colors.success.main,
                          },
                        ]}
                      >
                        {rec.priority.charAt(0).toUpperCase() +
                          rec.priority.slice(1)}{' '}
                        Priority
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={[
                    styles.recommendationText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {rec.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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

      {modal && (
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.background.paper },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: theme.colors.text.primary }]}
            >
              {modal}
            </Text>
            <TouchableOpacity
              onPress={() => setModal(null)}
              style={[
                styles.modalClose,
                { backgroundColor: theme.colors.background.elevated },
              ]}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

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
  modalContent: {
    width: '80%',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
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
  recommendationTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
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

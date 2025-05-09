import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickActionFAB from '../../components/QuickActionFAB';
import StatCard from '../../components/StatCard';
import { useTheme } from '../../context/ThemeContext';

export default function HomePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [modal, setModal] = useState<string | null>(null);

  const quickActions = [
    {
      label: 'Log Meal',
      icon: 'restaurant',
      onPress: () => {
        router.navigate('/track?add=1');
      },
    },
    {
      label: 'Track Symptoms',
      icon: 'medkit',
      onPress: () => setModal('Track Symptoms'),
    },
    {
      label: 'View Insights',
      icon: 'bar-chart',
      onPress: () => setModal('View Insights'),
    },
    {
      label: 'Expert Chat',
      icon: 'chatbubbles',
      onPress: () => setModal('Expert Chat'),
    },
  ];

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
});

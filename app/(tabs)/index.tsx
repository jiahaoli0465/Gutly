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
        router.navigate('/meals?add=1');
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background.default }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Alex</Text>
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
          <Text style={styles.sectionTitle}>Today's Recommendations</Text>
          <View style={styles.recommendationCard}>
            <LinearGradient
              colors={[
                theme.colors.background.paper,
                theme.colors.background.elevated,
              ]}
              style={styles.recommendationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.recommendationHeader}>
                <Ionicons
                  name="bulb"
                  size={24}
                  color={theme.colors.primary.main}
                />
                <Text style={styles.recommendationTitle}>
                  Increase Fiber Intake
                </Text>
              </View>
              <Text style={styles.recommendationText}>
                Your gut microbiome would benefit from more fiber-rich foods.
                Try adding more fruits, vegetables, and whole grains to your
                diet.
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
      <QuickActionFAB actions={quickActions} />
      {modal && (
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modal}</Text>
            <TouchableOpacity
              onPress={() => setModal(null)}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
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
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statGradient: {
    flex: 1,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
  recommendationsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  recommendationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  recommendationGradient: {
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
    color: '#FFFFFF',
    marginLeft: 12,
  },
  recommendationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 24,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 88,
    alignItems: 'flex-end',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabActionsColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  fabAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  fabActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  fabActionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  modalContent: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalClose: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#00BFA5',
    borderRadius: 16,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

import React, { useMemo } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickActionFAB from '../../../components/QuickActionFAB';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyState } from './components/EmptyState';
import { Header } from './components/Header';
import { MealCard } from './components/MealCard';
import { SymptomCard } from './components/SymptomCard';
import { TimelineItem } from './types';

// Mock data
const MOCK_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: '1',
    type: 'meal',
    timestamp: new Date('2024-05-09T08:30:00'),
    photo: 'https://picsum.photos/300/200',
    foodLabels: ['Greek Yogurt', 'Granola', 'Blueberries'],
    calories: 310,
  },
  {
    id: '2',
    type: 'symptom',
    timestamp: new Date('2024-05-09T10:15:00'),
    symptom: 'Bloating',
    severity: 3,
    bristolScore: 4,
  },
  {
    id: '3',
    type: 'meal',
    timestamp: new Date('2024-05-09T12:45:00'),
    photo: 'https://picsum.photos/300/200',
    foodLabels: ['Quinoa Salad', 'Grilled Chicken', 'Avocado'],
    calories: 560,
  },
  {
    id: '4',
    type: 'symptom',
    timestamp: new Date('2024-05-09T14:30:00'),
    symptom: 'Abdominal Pain',
    severity: 2,
    bristolScore: 3,
  },
];

// Timeline item component with elegant animations
const TimelineItemCard = ({
  item,
  isLastItem = false,
}: {
  item: TimelineItem;
  isLastItem?: boolean;
}) => {
  const { theme } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.97)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animation.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formattedTime = useMemo(() => {
    return item.timestamp
      .toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
      .toLowerCase();
  }, [item.timestamp]);

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: theme.colors.text.secondary }]}>
          {formattedTime}
        </Text>
      </View>

      <View style={styles.timelineConnectorContainer}>
        <View
          style={[
            styles.timelineDot,
            item.type === 'meal'
              ? { backgroundColor: theme.colors.primary.main }
              : { backgroundColor: theme.colors.error.main },
          ]}
        />

        {!isLastItem && (
          <View
            style={[
              styles.timelineLine,
              { backgroundColor: theme.colors.divider },
            ]}
          />
        )}
      </View>

      <Animated.View
        style={[
          styles.cardContainer,
          theme.shadows.sm,
          { backgroundColor: theme.colors.background.paper },
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.75} style={styles.cardTouchable}>
          {item.type === 'meal' ? (
            <MealCard item={item} />
          ) : (
            <SymptomCard item={item} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default function TrackerScreen() {
  const { theme } = useTheme();
  const sortedItems = useMemo(() => {
    return [...MOCK_TIMELINE_ITEMS].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, []);

  const quickActions = [
    {
      label: 'Add Meal',
      icon: 'restaurant',
      onPress: () => {
        // TODO: Implement add meal
        console.log('Add meal');
      },
    },
    {
      label: 'Log Symptom',
      icon: 'medkit',
      onPress: () => {
        // TODO: Implement log symptom
        console.log('Log symptom');
      },
    },
  ];

  const renderItem = ({
    item,
    index,
  }: {
    item: TimelineItem;
    index: number;
  }) => {
    return (
      <TimelineItemCard
        item={item}
        isLastItem={index === sortedItems.length - 1}
      />
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      edges={['top']}
    >
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.colors.background.default}
      />

      <Header />

      {sortedItems.length > 0 ? (
        <FlatList
          data={sortedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState />
      )}

      <QuickActionFAB actions={quickActions} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  timeContainer: {
    width: 58,
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  timelineConnectorContainer: {
    width: 30,
    alignItems: 'center',
    paddingTop: 16,
  },
  timelineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginBottom: 6,
  },
  timelineLine: {
    width: 1.5,
    height: 120,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardTouchable: {
    width: '100%',
  },
});

import React, { useMemo, useState } from 'react';
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
import Toast from 'react-native-toast-message';
import QuickActionFAB from '../../../components/QuickActionFAB';
import { useTheme } from '../../../context/ThemeContext';
import { AddMealModal } from './components/AddMealModal';
import { EmptyState } from './components/EmptyState';
import { Header } from './components/Header';
import { ItemDetailModal } from './components/ItemDetailModal';
import { MealCard } from './components/MealCard';
import { LogSymptomModal } from './components/symptom/LogSymptomModal';
import { SymptomCard } from './components/SymptomCard';
import { MealItem, SymptomItem, TimelineItem } from './types';

// Mock data
const MOCK_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: '1',
    type: 'meal',
    timestamp: new Date('2024-05-09T08:30:00'),
    photo:
      'https://images.unsplash.com/photo-1488477181946-6428a848b919?w=800&auto=format&fit=crop&q=60',
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
    photo:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
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
  onPress,
}: {
  item: TimelineItem;
  isLastItem?: boolean;
  onPress: () => void;
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
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.cardTouchable}
          onPress={onPress}
        >
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
  const [items, setItems] = useState<TimelineItem[]>(MOCK_TIMELINE_ITEMS);
  const [isAddMealVisible, setIsAddMealVisible] = useState(false);
  const [isLogSymptomVisible, setIsLogSymptomVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  }, [items]);

  const handleAddMeal = (meal: Omit<MealItem, 'id'>) => {
    const newMeal: MealItem = {
      ...meal,
      id: Date.now().toString(),
    };
    setItems([...items, newMeal]);
    Toast.show({
      type: 'success',
      text1: 'Meal added',
      position: 'bottom',
      bottomOffset: 80,
    });
  };

  const handleLogSymptom = (symptom: Omit<SymptomItem, 'id'>) => {
    const newSymptom: SymptomItem = {
      ...symptom,
      id: Date.now().toString(),
    };
    setItems([...items, newSymptom]);
    Toast.show({
      type: 'success',
      text1: 'Symptom logged',
      position: 'bottom',
      bottomOffset: 80,
    });
  };

  const handleItemPress = (item: TimelineItem) => {
    setSelectedItem(item);
    setIsDetailModalVisible(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setIsDetailModalVisible(false);
    Toast.show({
      type: 'success',
      text1: 'Item deleted',
      position: 'bottom',
      bottomOffset: 80,
    });
  };

  const quickActions = [
    {
      label: 'Add Meal',
      icon: 'restaurant',
      onPress: () => setIsAddMealVisible(true),
    },
    {
      label: 'Log Symptom',
      icon: 'medkit',
      onPress: () => setIsLogSymptomVisible(true),
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
        onPress={() => handleItemPress(item)}
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

      <AddMealModal
        visible={isAddMealVisible}
        onClose={() => setIsAddMealVisible(false)}
        onSave={handleAddMeal}
      />

      <LogSymptomModal
        visible={isLogSymptomVisible}
        onClose={() => setIsLogSymptomVisible(false)}
        onSave={handleLogSymptom}
      />

      <ItemDetailModal
        visible={isDetailModalVisible}
        item={selectedItem}
        onClose={() => {
          setIsDetailModalVisible(false);
          setTimeout(() => setSelectedItem(null), 300); // Clear after animation
        }}
        onDelete={(id) => handleDeleteItem(id)}
      />
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

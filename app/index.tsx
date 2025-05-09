import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const BACKGROUND_COLOR = '#0A0A0A';

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Track Your Gut Health',
    description:
      'Monitor your digestive health with our easy-to-use tracking system',
    icon: 'analytics-outline',
  },
  {
    id: '2',
    title: 'Personalized Insights',
    description:
      'Get customized recommendations based on your unique gut microbiome',
    icon: 'nutrition-outline',
  },
  {
    id: '3',
    title: 'Expert Guidance',
    description: 'Access professional advice and research-backed information',
    icon: 'medkit-outline',
  },
];

const OnboardingItem = ({
  item,
  index,
  scrollX,
}: {
  item: OnboardingItem;
  index: number;
  scrollX: Animated.Value;
}) => {
  const { theme } = useTheme();
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const titleScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
  });

  const descriptionScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.4, 1, 0.4],
  });

  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[
              theme.colors.primary.main,
              `${theme.colors.primary.main}E6`,
            ]}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={item.icon as any}
              size={40}
              color={theme.colors.primary.contrast}
            />
          </LinearGradient>
        </View>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{ scale: titleScale }],
              opacity,
              color: theme.colors.text.primary,
            },
          ]}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.description,
            {
              transform: [{ scale: descriptionScale }],
              opacity,
              color: theme.colors.text.secondary,
            },
          ]}
        >
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );
};

const Pagination = ({
  data,
  scrollX,
}: {
  data: OnboardingItem[];
  scrollX: Animated.Value;
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, idx) => {
        const inputRange = [
          (idx - 1) * SCREEN_WIDTH,
          idx * SCREEN_WIDTH,
          (idx + 1) * SCREEN_WIDTH,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 20, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: theme.colors.primary.main,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default function Onboarding() {
  const { theme, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.skipContainer}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={[
            styles.skipButton,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <Text
            style={[styles.skipText, { color: theme.colors.text.secondary }]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={onboardingData}
        renderItem={({ item, index }) => (
          <OnboardingItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <Pagination data={onboardingData} scrollX={scrollX} />

      <TouchableOpacity style={styles.button} onPress={scrollTo}>
        <LinearGradient
          colors={[theme.colors.primary.main, `${theme.colors.primary.main}E6`]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: theme.colors.primary.contrast },
            ]}
          >
            {currentIndex === onboardingData.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 1,
  },
  skipButton: {
    padding: 8,
    borderRadius: 9999,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: SCREEN_HEIGHT * 0.15,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 32,
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
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    position: 'absolute',
    bottom: 55,
    left: 28,
    right: 28,
    height: 52,
    borderRadius: 28,
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
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

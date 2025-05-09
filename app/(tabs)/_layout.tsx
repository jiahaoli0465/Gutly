import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '../../components/HapticTab';
import { useTheme } from '../../context/ThemeContext';

// Screen width to calculate island width
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ISLAND_WIDTH = SCREEN_WIDTH * 0.7; // 70% of screen width

const TabBarIcon = ({
  name,
  isFocused,
}: {
  name: string;
  isFocused: boolean;
}) => {
  const { theme } = useTheme();

  // Animation for the icon
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  // useEffect(() => {
  //   if (isFocused) {
  //     Animated.parallel([
  //       Animated.spring(scaleAnim, {
  //         toValue: 1.2,
  //         friction: 6,
  //         tension: 100,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(opacityAnim, {
  //         toValue: 1,
  //         duration: 150,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   } else {
  //     Animated.parallel([
  //       Animated.spring(scaleAnim, {
  //         toValue: 1,
  //         friction: 6,
  //         tension: 100,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(opacityAnim, {
  //         toValue: 0.7,
  //         duration: 150,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   }
  // }, [isFocused, scaleAnim, opacityAnim]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={
          {
            // transform: [{ scale: scaleAnim }],
            // opacity: opacityAnim,
            // alignItems: 'center',
            // justifyContent: 'center',
            // width: 20, // Match the icon size
            // height: 20, // Match the icon size
          }
        }
      >
        <Ionicons
          name={name as any}
          size={24}
          color={
            isFocused ? theme.colors.primary.main : theme.colors.text.secondary
          }
          // style={{ textAlign: 'center' }} // Add this to help with centering
        />
      </Animated.View>
    </View>
  );
};

// The modern island background
const IslandBackground = () => {
  const { theme, isDark } = useTheme();

  return (
    <>
      {/* Shadow container outside the overflow hidden area */}
      <View
        style={[
          styles.shadowContainer,
          {
            backgroundColor: theme.colors.background.default,
          },
        ]}
      />
      <View style={styles.islandBackgroundContainer}>
        <View style={styles.blurContainer}>
          <BlurView
            intensity={isDark ? 45 : 75}
            tint={isDark ? 'dark' : 'light'}
            style={styles.blurView}
          />
        </View>
        <View
          style={[
            styles.islandBackground,
            {
              backgroundColor: theme.colors.background.default,
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.03)',
            },
          ]}
        />
      </View>
    </>
  );
};

// Floating Action Button component
const FloatingActionButton = () => {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.fabContainer}>
      <View
        style={[
          styles.fabShadow,
          {
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.fabButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
          onPress={() => console.log('FAB pressed')}
        >
          <Ionicons
            name="add"
            size={22}
            color={theme.colors.primary.contrast}
            style={styles.fabIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Determine tab bar height
  const tabBarHeight = 58;
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <>
      {/* Floating Action Button - positioned outside the tab bar */}
      {/* <FloatingActionButton /> */}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: bottomInset,

            marginHorizontal: 20,
            width: Dimensions.get('window').width - 40,
            height: tabBarHeight,
            paddingVertical: 0,
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'transparent',
            zIndex: 0,
          },
          tabBarBackground: () => <IslandBackground />,
          tabBarShowLabel: false,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="home" isFocused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="track/index"
          options={{
            title: 'Track',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="nutrition" isFocused={focused} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="insights/index"
          options={{
            title: 'Insights',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="analytics-outline" isFocused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="person-outline" isFocused={focused} />
            ),
          }}
        /> */}
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  // Island Navigation Styles
  islandBackgroundContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurView: {
    height: '100%',
    width: '100%',
  },
  islandBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Ensure there's an opaque background
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // large area for tap accessibility
    height: 74,
    width: 92,
    // borderWidth: 1,
    marginTop: 16,
    borderColor: 'red',
  },
  shadowContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Floating Action Button Styles
  fabContainer: {
    position: 'absolute',
    bottom: 70, // Position above the tab bar
    right: 20,
    zIndex: 100,
  },
  fabShadow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    // Add a slight offset to visually center the plus icon
    marginTop: 1,
  },
});

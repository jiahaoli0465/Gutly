import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  isFocused: boolean;
}) {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: props.isFocused ? 1.2 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [props.isFocused]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.iconInnerContainer}>
        <Ionicons
          size={22}
          color={
            props.isFocused
              ? theme.colors.primary.main
              : theme.colors.text.secondary
          }
          {...props}
        />
        {props.isFocused && (
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: theme.colors.primary.main },
            ]}
          />
        )}
      </View>
    </Animated.View>
  );
}

const TabBarBackground = () => {
  if (Platform.OS === 'ios') {
    return (
      <BlurView tint="dark" intensity={30} style={StyleSheet.absoluteFill} />
    );
  }
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
      ]}
    />
  );
};

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarShowLabel: false,
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
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="analytics" isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="bar-chart" isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="person" isFocused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInnerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});

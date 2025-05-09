import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface QuickAction {
  icon: string;
  label: string;
  onPress: () => void;
}

interface QuickActionFABProps {
  actions: QuickAction[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const QuickActionFAB: React.FC<QuickActionFABProps> = ({
  actions,
  open: openProp,
  onOpenChange,
}) => {
  const { theme } = useTheme();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    if (openProp === undefined) setInternalOpen(val);
  };

  // Create references for animations
  const fabRotation = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0)).current;

  // Create animation refs for each action button
  const actionAnims = useRef(
    actions.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.8),
      translateY: new Animated.Value(20),
    }))
  ).current;

  // Handle animations when open state changes
  useEffect(() => {
    const animations = [
      // FAB rotation animation
      Animated.timing(fabRotation, {
        toValue: open ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
        useNativeDriver: true,
      }),

      // Backdrop animation
      Animated.timing(backdropOpacity, {
        toValue: open ? 0.5 : 0,
        duration: open ? 300 : 200,
        easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),

      // Menu scale animation
      Animated.timing(menuScale, {
        toValue: open ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
        useNativeDriver: true,
      }),
    ];

    // Action button animations with staggered timing
    if (open) {
      actionAnims.forEach((anim, index) => {
        animations.push(
          Animated.sequence([
            Animated.delay(index * 50), // Stagger delay
            Animated.parallel([
              Animated.timing(anim.opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 300,
                easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
            ]),
          ])
        );
      });
    } else {
      // Close animations (faster and in reverse order)
      actionAnims.forEach((anim, index) => {
        const reverseIndex = actionAnims.length - 1 - index;
        animations.push(
          Animated.sequence([
            Animated.delay(reverseIndex * 30),
            Animated.parallel([
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: 20,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
          ])
        );
      });
    }

    // Start all animations
    Animated.parallel(animations).start();
  }, [open, fabRotation, backdropOpacity, actionAnims, menuScale]);

  // Toggle the FAB open/closed
  const toggleMenu = () => {
    setOpen(!open);
  };

  // Handle action button press
  const handleActionPress = (action: QuickAction) => {
    // Close menu first
    setOpen(false);

    // Add slight delay before executing the action
    setTimeout(() => {
      action.onPress();
    }, 300);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Backdrop overlay when menu is open */}
      {open && (
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents={open ? 'auto' : 'none'}
          onTouchStart={() => setOpen(false)}
        />
      )}

      {/* Action buttons menu */}
      <View style={styles.menuContainer} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.actionsContainer,
            {
              opacity: menuScale,
              transform: [{ scale: menuScale }],
            },
          ]}
          pointerEvents={open ? 'auto' : 'none'}
        >
          {actions.map((action, idx) => (
            <Animated.View
              key={action.label}
              style={[
                styles.actionWrapper,
                {
                  opacity: actionAnims[idx].opacity,
                  transform: [
                    { scale: actionAnims[idx].scale },
                    { translateY: actionAnims[idx].translateY },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleActionPress(action)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[
                    theme.colors.primary.main,
                    `${theme.colors.primary.main}E6`, // 90% opacity
                  ]}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={22}
                    color={theme.colors.primary.contrast}
                  />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Main FAB button */}
        <View style={styles.fabShadowContainer}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={toggleMenu}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[
                theme.colors.primary.main,
                `${theme.colors.primary.main}E6`, // 90% opacity
              ]}
              style={styles.fabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: fabRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '135deg'],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={28}
                  color={theme.colors.primary.contrast}
                />
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    right: 24,
    bottom: 88,
    alignItems: 'flex-end',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  actionWrapper: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  fabShadowContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
});

export default QuickActionFAB;

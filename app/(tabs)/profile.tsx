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
import { useTheme } from '../../context/ThemeContext';

interface User {
  name: string;
  email: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    reminders: boolean;
  };
}

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();
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
    router.replace('/');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Profile
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={40} color={theme.colors.primary.main} />
        </View>
        <Text
          style={[styles.profileName, { color: theme.colors.text.primary }]}
        >
          {user.name}
        </Text>
        <Text
          style={[styles.profileEmail, { color: theme.colors.text.secondary }]}
        >
          {user.email}
        </Text>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Preferences
        </Text>
        <View style={styles.preferencesList}>
          <TouchableOpacity
            style={[
              styles.preferenceItem,
              { backgroundColor: theme.colors.background.paper },
            ]}
            onPress={() => handleTogglePreference('notifications')}
          >
            <View style={styles.preferenceInfo}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.colors.text.primary}
              />
              <Text
                style={[
                  styles.preferenceLabel,
                  { color: theme.colors.text.primary },
                ]}
              >
                Notifications
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: user.preferences.notifications
                    ? theme.colors.primary.main
                    : theme.colors.background.default,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleHandle,
                  {
                    transform: [
                      { translateX: user.preferences.notifications ? 20 : 0 },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.preferenceItem,
              { backgroundColor: theme.colors.background.paper },
            ]}
            onPress={() => handleTogglePreference('darkMode')}
          >
            <View style={styles.preferenceInfo}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={24}
                color={theme.colors.text.primary}
              />
              <Text
                style={[
                  styles.preferenceLabel,
                  { color: theme.colors.text.primary },
                ]}
              >
                Dark Mode
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: user.preferences.darkMode
                    ? theme.colors.primary.main
                    : theme.colors.background.default,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleHandle,
                  {
                    transform: [
                      { translateX: user.preferences.darkMode ? 20 : 0 },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.preferenceItem,
              { backgroundColor: theme.colors.background.paper },
            ]}
            onPress={() => handleTogglePreference('reminders')}
          >
            <View style={styles.preferenceInfo}>
              <Ionicons
                name="time-outline"
                size={24}
                color={theme.colors.text.primary}
              />
              <Text
                style={[
                  styles.preferenceLabel,
                  { color: theme.colors.text.primary },
                ]}
              >
                Daily Reminders
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: user.preferences.reminders
                    ? theme.colors.primary.main
                    : theme.colors.background.default,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleHandle,
                  {
                    transform: [
                      { translateX: user.preferences.reminders ? 20 : 0 },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[
          styles.signOutButton,
          { backgroundColor: theme.colors.error.main },
        ]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferencesList: {
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
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
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 'auto',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

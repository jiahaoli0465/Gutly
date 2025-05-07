import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <View
          style={{ flex: 1, backgroundColor: theme.colors.background.default }}
        >
          <StatusBar
            style="light"
            backgroundColor={theme.colors.background.default}
          />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.colors.background.default,
              },
            }}
          />
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

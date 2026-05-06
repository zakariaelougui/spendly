/**
 * App — root component.
 *
 * Resolves the active theme from the user's preference ('light' | 'dark' | 'system')
 * combined with the device color scheme, then passes it to PaperProvider.
 */
import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation';
import { lightTheme, darkTheme } from './src/theme';
import { useThemeStore } from './src/store/themeStore';

export default function App() {
  const systemScheme = useColorScheme();
  const preference = useThemeStore(s => s.preference);

  const isDark =
    preference === 'dark' ||
    (preference === 'system' && systemScheme === 'dark');

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

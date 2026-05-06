/**
 * WelcomeScreen — landing screen for unauthenticated users.
 *
 * Offers three entry points: sign in, create account, and guest access.
 * Guest login triggers immediately without navigating to another screen.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { AuthNavProp } from '../navigation/types';

type Props = { navigation: AuthNavProp<'Welcome'> };

export default function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const { guestLogin, isLoading } = useAuth();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="wallet-outline" size={48} color={theme.colors.primary} />
        </View>
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
          Spendly
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 24 }}
        >
          Track your expenses,{'\n'}stay in control.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.btn}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          Sign In
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Signup')}
          style={styles.btn}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          Create Account
        </Button>
        <Button
          mode="text"
          onPress={guestLogin}
          loading={isLoading}
          disabled={isLoading}
          labelStyle={{ color: theme.colors.onSurfaceVariant }}
        >
          Continue as Guest
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, paddingHorizontal: 32, justifyContent: 'space-between' },
  hero:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  iconWrap:   { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title:      { fontWeight: '700', letterSpacing: -0.5 },
  actions:    { gap: 12, paddingBottom: 24 },
  btn:        { borderRadius: 12 },
  btnContent: { paddingVertical: 6 },
  btnLabel:   { fontSize: 16, letterSpacing: 0.2 },
});

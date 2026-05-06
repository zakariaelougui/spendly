/**
 * ProfileScreen — displays user info, appearance settings, and sign-out control.
 *
 * Shows a CTA card for guest users prompting them to create a real account.
 * Logout clears both auth state and the expenses store so the next user
 * starts with a clean slate.
 */
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Divider, useTheme, Card, Avatar, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../store/authStore';
import { useExpensesStore } from '../store/expensesStore';
import { useThemeStore, ThemePreference } from '../store/themeStore';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const resetExpenses = useExpensesStore(s => s.reset);
  const { preference, setPreference } = useThemeStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const isGuest = user?.id === 'guest';

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      resetExpenses();
    } finally {
      setLoggingOut(false);
    }
  }

  if (!user) return null;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineSmall" style={[styles.pageTitle, { color: theme.colors.onSurface }]}>
        Profile
      </Text>

      <View style={styles.avatarSection}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <Avatar.Text
            size={88}
            label={user.name.slice(0, 2).toUpperCase()}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            labelStyle={{ color: theme.colors.primary, fontWeight: '700', fontSize: 28 }}
          />
        )}
        <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onSurface }]}>
          {user.name}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {user.email}
        </Text>
        {isGuest && (
          <View style={[styles.guestBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
              Guest Account
            </Text>
          </View>
        )}
      </View>

      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={0}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account-outline" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Full Name</Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{user.name}</Text>
          </View>
        </View>

        <Divider style={{ marginHorizontal: 16 }} />

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Email</Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{user.email}</Text>
          </View>
        </View>

        <Divider style={{ marginHorizontal: 16 }} />

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="shield-account-outline" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Account Type</Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {isGuest ? 'Guest' : 'Standard'}
            </Text>
          </View>
        </View>
      </Card>

      {isGuest && (
        <Card style={[styles.guestCta, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
          <Card.Content style={styles.guestCtaContent}>
            <MaterialCommunityIcons name="star-outline" size={24} color={theme.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                Save your data
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                Create a free account to keep your expenses safe.
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={0}>
        <View style={[styles.infoRow, { paddingBottom: 8 }]}>
          <MaterialCommunityIcons name="palette-outline" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Appearance</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <SegmentedButtons
            value={preference}
            onValueChange={v => setPreference(v as ThemePreference)}
            buttons={[
              { value: 'light', label: 'Light', icon: 'weather-sunny' },
              { value: 'system', label: 'System', icon: 'cellphone' },
              { value: 'dark', label: 'Dark', icon: 'weather-night' },
            ]}
          />
        </View>
      </Card>

      <View style={styles.spacer} />

      <Button
        mode="outlined"
        onPress={handleLogout}
        loading={loggingOut}
        disabled={loggingOut}
        style={styles.logoutBtn}
        contentStyle={styles.logoutContent}
        labelStyle={{ color: theme.colors.error }}
        icon="logout"
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:            { flex: 1, paddingHorizontal: 20 },
  pageTitle:       { fontWeight: '700', marginTop: 16, marginBottom: 24 },
  avatarSection:   { alignItems: 'center', gap: 8, marginBottom: 28 },
  avatar:          { width: 88, height: 88, borderRadius: 44 },
  name:            { fontWeight: '700', marginTop: 8 },
  guestBadge:      { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100, marginTop: 4 },
  infoCard:        { borderRadius: 16, marginBottom: 16 },
  infoRow:         { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  infoText:        { gap: 2 },
  guestCta:        { borderRadius: 16, marginBottom: 8 },
  guestCtaContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spacer:          { flex: 1 },
  logoutBtn:       { borderRadius: 12, borderColor: '#ef4444', marginBottom: 16 },
  logoutContent:   { paddingVertical: 4 },
});

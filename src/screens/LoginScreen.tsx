/**
 * LoginScreen — email + password sign-in form.
 *
 * Validates fields with Zod before calling the auth store.
 * Field-level errors clear as the user types; server errors appear in a Snackbar.
 */
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useAuth } from '../context/AuthContext';
import { AuthNavProp } from '../navigation/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFields = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginFields, string>>;

// ─── Screen ───────────────────────────────────────────────────────────────────

type Props = { navigation: AuthNavProp<'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  function clearError(field: keyof LoginFields) {
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  async function handleLogin() {
    const result = loginSchema.safeParse({ email: email.trim(), password });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFields;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setServerError('');
    try {
      await login(result.data.email, result.data.password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setServerError(msg);
      setSnackVisible(true);
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Button
              icon="arrow-left"
              mode="text"
              onPress={() => navigation.goBack()}
              labelStyle={{ color: theme.colors.onSurfaceVariant }}
            >
              Back
            </Button>
          </View>

          <View style={styles.body}>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              Welcome back
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 32 }}>
              Sign in to your account
            </Text>

            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={v => { setEmail(v); clearError('email'); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!fieldErrors.email}
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
            />
            <HelperText type="error" visible={!!fieldErrors.email}>
              {fieldErrors.email}
            </HelperText>

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={v => { setPassword(v); clearError('password'); }}
              secureTextEntry={!showPassword}
              autoComplete="password"
              error={!!fieldErrors.password}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setShowPassword(v => !v)}
                />
              }
              style={styles.input}
            />
            <HelperText type="error" visible={!!fieldErrors.password}>
              {fieldErrors.password}
            </HelperText>

            <Button
              mode="text"
              onPress={() => {}}
              style={styles.forgotBtn}
              labelStyle={{ color: theme.colors.primary }}
            >
              Forgot password?
            </Button>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={[styles.btn, { marginTop: 8 }]}
              contentStyle={styles.btnContent}
              labelStyle={styles.btnLabel}
            >
              Sign In
            </Button>

            <View style={styles.switchRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Don't have an account?{' '}
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => navigation.navigate('Signup')}
                labelStyle={{ color: theme.colors.primary }}
              >
                Sign up
              </Button>
            </View>

            <View style={[styles.hint, { backgroundColor: theme.colors.surfaceVariant, borderRadius: 12 }]}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>
                Demo credentials: alex@example.com / password
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.error }}
      >
        {serverError}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  scroll:     { flexGrow: 1, paddingHorizontal: 24 },
  header:     { paddingTop: 8, marginLeft: -8 },
  body:       { flex: 1, paddingTop: 16 },
  title:      { fontWeight: '700', marginBottom: 6 },
  input:      { marginBottom: 2 },
  forgotBtn:  { alignSelf: 'flex-end', marginBottom: 4 },
  btn:        { borderRadius: 12 },
  btnContent: { paddingVertical: 6 },
  btnLabel:   { fontSize: 16 },
  switchRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  hint:       { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, marginTop: 24 },
});

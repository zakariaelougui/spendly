/**
 * SignupScreen — new account registration form.
 *
 * Validates name, email, and password (min 6 chars) with Zod before calling
 * the auth store. Field-level errors clear as the user types; server errors
 * appear in a Snackbar.
 */
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useAuth } from '../context/AuthContext';
import { AuthNavProp } from '../navigation/types';

// ─── Schema ───────────────────────────────────────────────────────────────────

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFields = z.infer<typeof signupSchema>;
type FieldErrors = Partial<Record<keyof SignupFields, string>>;

// ─── Screen ───────────────────────────────────────────────────────────────────

type Props = { navigation: AuthNavProp<'Signup'> };

export default function SignupScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  function clearError(field: keyof SignupFields) {
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  async function handleSignup() {
    const result = signupSchema.safeParse({ name: name.trim(), email: email.trim(), password });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupFields;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setServerError('');
    try {
      await signup(result.data.name, result.data.email, result.data.password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Signup failed';
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
              Create account
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 32 }}>
              Start tracking your expenses today
            </Text>

            <TextInput
              label="Full Name"
              mode="outlined"
              value={name}
              onChangeText={v => { setName(v); clearError('name'); }}
              autoComplete="name"
              error={!!fieldErrors.name}
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.input}
            />
            <HelperText type="error" visible={!!fieldErrors.name}>
              {fieldErrors.name}
            </HelperText>

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
              autoComplete="new-password"
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
              mode="contained"
              onPress={handleSignup}
              loading={isLoading}
              disabled={isLoading}
              style={[styles.btn, { marginTop: 16 }]}
              contentStyle={styles.btnContent}
              labelStyle={styles.btnLabel}
            >
              Create Account
            </Button>

            <View style={styles.switchRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Already have an account?{' '}
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => navigation.navigate('Login')}
                labelStyle={{ color: theme.colors.primary }}
              >
                Sign in
              </Button>
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
  btn:        { borderRadius: 12 },
  btnContent: { paddingVertical: 6 },
  btnLabel:   { fontSize: 16 },
  switchRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
});

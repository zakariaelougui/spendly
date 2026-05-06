/**
 * AddExpenseModal — bottom sheet modal for creating a new expense.
 *
 * Validates name, amount, and category with Zod on submit.
 * On success it calls the expenses store (which hits the API and prepends the
 * result to the list), then resets and dismisses the modal.
 * The form is also reset if the user dismisses without submitting.
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text, TextInput, Button, Chip, HelperText, useTheme, Modal, Portal,
} from 'react-native-paper';
import { z } from 'zod';

import { useExpensesStore } from '../store/expensesStore';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(v => !isNaN(+v) && +v > 0, 'Enter a valid positive amount'),
  category: z.string().min(1, 'Select a category'),
});

type Fields = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Food', 'Groceries', 'Housing', 'Transport',
  'Utilities', 'Health', 'Entertainment', 'Shopping', 'Other',
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onDismiss: () => void;
  token: string;
}

export default function AddExpenseModal({ visible, onDismiss, token }: Props) {
  const theme = useTheme();
  const addExpense = useExpensesStore(s => s.addExpense);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: keyof Fields) {
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  function resetForm() {
    setName('');
    setAmount('');
    setCategory('');
    setFieldErrors({});
  }

  function handleDismiss() {
    resetForm();
    onDismiss();
  }

  async function handleSubmit() {
    const result = schema.safeParse({ name: name.trim(), amount, category });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof Fields;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await addExpense(token, {
        name: result.data.name,
        amount: parseFloat(result.data.amount),
        category: result.data.category,
        date: today,
      });
      resetForm();
      onDismiss();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <Text variant="titleLarge" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
          Add Expense
        </Text>

        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={v => { setName(v); clearError('name'); }}
          error={!!fieldErrors.name}
          left={<TextInput.Icon icon="text-short" />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!fieldErrors.name}>
          {fieldErrors.name}
        </HelperText>

        <TextInput
          label="Amount"
          mode="outlined"
          value={amount}
          onChangeText={v => { setAmount(v); clearError('amount'); }}
          keyboardType="decimal-pad"
          error={!!fieldErrors.amount}
          left={<TextInput.Icon icon="currency-usd" />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!fieldErrors.amount}>
          {fieldErrors.amount}
        </HelperText>

        <Text variant="labelLarge" style={[styles.categoryLabel, { color: theme.colors.onSurfaceVariant }]}>
          Category
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map(cat => (
            <Chip
              key={cat}
              selected={category === cat}
              onPress={() => { setCategory(cat); clearError('category'); }}
              style={[
                styles.chip,
                category === cat && { backgroundColor: theme.colors.primaryContainer },
              ]}
              selectedColor={theme.colors.primary}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
        <HelperText type="error" visible={!!fieldErrors.category}>
          {fieldErrors.category}
        </HelperText>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleDismiss}
            style={styles.actionBtn}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.actionBtn}
          >
            Add
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal:         { margin: 20, borderRadius: 20, padding: 24 },
  modalTitle:    { fontWeight: '700', marginBottom: 20 },
  input:         { marginBottom: 2 },
  categoryLabel: { marginTop: 8, marginBottom: 8 },
  chips:         { gap: 8, paddingBottom: 4 },
  chip:          { marginRight: 0 },
  actions:       { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn:     { flex: 1, borderRadius: 12 },
});

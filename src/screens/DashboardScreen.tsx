/**
 * DashboardScreen — main expense list with summary cards.
 *
 * Fetches expenses on mount and on pull-to-refresh. Displays a "This Month"
 * total filtered to the current calendar month, an "All Time" total, and a
 * scrollable list of expense rows. Deletes are confirmed via an Alert before
 * removing from local state.
 */
import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList, RefreshControl, Alert, ListRenderItem,
} from 'react-native';
import { Text, Card, ActivityIndicator, IconButton, FAB, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../store/authStore';
import { useExpensesStore } from '../store/expensesStore';
import { Expense } from '../api/types';
import AddExpenseModal from '../components/AddExpenseModal';

// ─── Category metadata ────────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const CATEGORY_META: Record<string, { color: string; icon: IconName }> = {
  Entertainment: { color: '#8b5cf6', icon: 'music-note'        },
  Groceries:     { color: '#10b981', icon: 'cart-outline'       },
  Utilities:     { color: '#f59e0b', icon: 'lightning-bolt'     },
  Transport:     { color: '#3b82f6', icon: 'car-outline'        },
  Health:        { color: '#ef4444', icon: 'heart-pulse'        },
  Shopping:      { color: '#ec4899', icon: 'shopping-outline'   },
  Food:          { color: '#f97316', icon: 'food-outline'       },
  Housing:       { color: '#6366f1', icon: 'home-outline'       },
  Other:         { color: '#94a3b8', icon: 'cash-multiple'      },
};

const DEFAULT_META = { color: '#94a3b8', icon: 'cash-multiple' as IconName };

function getMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_META;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// ─── Expense row ──────────────────────────────────────────────────────────────

interface RowProps {
  item: Expense;
  onDelete: (id: string, name: string) => void;
}

function ExpenseRow({ item, onDelete }: RowProps) {
  const theme = useTheme();
  const meta = getMeta(item.category);

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.iconBadge, { backgroundColor: meta.color + '20' }]}>
        <MaterialCommunityIcons name={meta.icon} size={22} color={meta.color} />
      </View>

      <View style={styles.rowMid}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          {item.name}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {item.category} · {formatDate(item.date)}
        </Text>
      </View>

      <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
        {formatCurrency(item.amount)}
      </Text>

      <IconButton
        icon="trash-can-outline"
        size={18}
        iconColor={theme.colors.onSurfaceDisabled}
        onPress={() => onDelete(item.id, item.name)}
        style={styles.deleteBtn}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const theme = useTheme();
  const { user, token } = useAuthStore();
  const { expenses, isLoading, fetchExpenses, removeExpense } = useExpensesStore();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (token) fetchExpenses(token);
  }, [token, fetchExpenses]);

  async function onRefresh() {
    if (!token) return;
    setRefreshing(true);
    try {
      await fetchExpenses(token);
    } finally {
      setRefreshing(false);
    }
  }

  function confirmDelete(id: string, name: string) {
    Alert.alert('Delete Expense', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeExpense(id) },
    ]);
  }

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = expenses
    .filter(e => e.date.startsWith(thisMonth))
    .reduce((sum, e) => sum + e.amount, 0);
  const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0);

  const renderItem: ListRenderItem<Expense> = ({ item }) => (
    <ExpenseRow item={item} onDelete={confirmDelete} />
  );

  const ListHeader = (
    <View style={styles.listHeader}>
      <View style={styles.pageHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {greeting()},
        </Text>
        <Text variant="headlineSmall" style={[styles.userName, { color: theme.colors.onSurface }]}>
          {user?.name ?? 'Guest'}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primary }]} elevation={0}>
          <Card.Content style={styles.summaryCardContent}>
            <Text variant="labelMedium" style={{ color: '#e0e7ff' }}>This Month</Text>
            <Text variant="headlineMedium" style={{ color: '#ffffff', fontWeight: '700' }}>
              {formatCurrency(monthlyTotal)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
          <Card.Content style={styles.summaryCardContent}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>All Time</Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {formatCurrency(totalAll)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Recent Expenses
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {isLoading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 40 }}
            >
              No expenses yet — tap + to add one
            </Text>
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => setModalVisible(true)}
      />

      {token && (
        <AddExpenseModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          token={token}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:              { flex: 1 },
  center:            { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent:       { paddingHorizontal: 16, paddingBottom: 100 },
  listHeader:        { paddingTop: 16, marginBottom: 8 },
  pageHeader:        { marginBottom: 20 },
  userName:          { fontWeight: '700' },
  summaryRow:        { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard:       { flex: 1, borderRadius: 16 },
  summaryCardContent:{ gap: 4 },
  sectionTitle:      { fontWeight: '600', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 4,
    borderRadius: 16,
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMid:    { flex: 1, gap: 2 },
  deleteBtn: { margin: 0 },
  fab:       { position: 'absolute', right: 20, bottom: 20, borderRadius: 16 },
});

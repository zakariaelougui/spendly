/**
 * Global expenses store (Zustand).
 *
 * `addExpense` optimistically prepends to the list after the API call resolves.
 * `removeExpense` is a local-only operation — call the API separately if needed.
 * Call `reset()` on logout to clear stale data before the next user logs in.
 */
import { create } from 'zustand';
import * as expensesApi from '../api/expenses';
import { Expense } from '../api/types';
import { NewExpense } from '../api/expenses';

interface ExpensesState {
  expenses: Expense[];
  /** `true` while `fetchExpenses` is in flight. */
  isLoading: boolean;
  /** Loads all expenses from the API and replaces the current list. */
  fetchExpenses: (token: string) => Promise<void>;
  /** Calls the API then prepends the returned expense to the list. */
  addExpense: (token: string, expense: NewExpense) => Promise<void>;
  /** Removes an expense from local state by id. */
  removeExpense: (id: string) => void;
  /** Resets to initial state — called on logout. */
  reset: () => void;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: [],
  isLoading: false,

  fetchExpenses: async (token) => {
    set({ isLoading: true });
    try {
      const data = await expensesApi.getExpenses(token);
      set({ expenses: data });
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (token, expense) => {
    const newExpense = await expensesApi.addExpense(token, expense);
    set(state => ({ expenses: [newExpense, ...state.expenses] }));
  },

  removeExpense: (id) => {
    set(state => ({ expenses: state.expenses.filter(e => e.id !== id) }));
  },

  reset: () => set({ expenses: [], isLoading: false }),
}));

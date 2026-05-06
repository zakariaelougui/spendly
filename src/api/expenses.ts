/**
 * Expenses API.
 *
 * Currently backed by mock data. Replace each function body with a real HTTP
 * call when the server is ready.
 */
import { delay } from './client';
import { ExpenseListSchema, ExpenseSchema, Expense } from './types';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EXPENSES = [
  { id: '1',  name: 'Spotify',        amount: 9.99,    date: '2026-05-05', category: 'Entertainment' },
  { id: '2',  name: 'Whole Foods',    amount: 87.43,   date: '2026-05-04', category: 'Groceries'     },
  { id: '3',  name: 'Electric Bill',  amount: 124.00,  date: '2026-05-03', category: 'Utilities'     },
  { id: '4',  name: 'Netflix',        amount: 15.99,   date: '2026-05-02', category: 'Entertainment' },
  { id: '5',  name: 'Gas Station',    amount: 52.30,   date: '2026-05-01', category: 'Transport'     },
  { id: '6',  name: 'Gym Membership', amount: 40.00,   date: '2026-04-30', category: 'Health'        },
  { id: '7',  name: 'Amazon Order',   amount: 38.95,   date: '2026-04-28', category: 'Shopping'      },
  { id: '8',  name: 'Coffee Shop',    amount: 6.50,    date: '2026-04-27', category: 'Food'          },
  { id: '9',  name: 'Rent',           amount: 1800.00, date: '2026-04-01', category: 'Housing'       },
  { id: '10', name: 'Internet',       amount: 59.99,   date: '2026-04-01', category: 'Utilities'     },
];

// ─── API ──────────────────────────────────────────────────────────────────────

/** Fetches the full list of expenses for the authenticated user. */
export async function getExpenses(_token: string): Promise<Expense[]> {
  await delay(600);
  return ExpenseListSchema.parse(MOCK_EXPENSES);
}

/** Expense payload for creation — `id` is assigned by the server. */
export type NewExpense = Omit<Expense, 'id'>;

/** Persists a new expense and returns it with its server-assigned `id`. */
export async function addExpense(_token: string, expense: NewExpense): Promise<Expense> {
  await delay(400);
  return ExpenseSchema.parse({ ...expense, id: `exp-${Date.now()}` });
}

/** Deletes an expense by id. */
export async function deleteExpense(_token: string, _id: string): Promise<void> {
  await delay(300);
}
